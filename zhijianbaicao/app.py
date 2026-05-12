from flask import Flask, render_template, request, jsonify, send_file, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import os
import json
import base64
from io import BytesIO
from PIL import Image
import torch
import cv2
import numpy as np
from utils import load_models, predict_herb, predict_formula, predict_face
# 导入数据库配置
from db import create_tables, get_db, User, PreDiagnosisReport
from ultralytics import YOLO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here-change-this-in-production'  # 用于session加密的密钥
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# 登录状态检查装饰器
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# 加载模型和数据
models = load_models()

class_names5 = []
with open('data/5.txt', 'r', encoding='utf-8') as f:
    class_names5 = [line.strip() for line in f.readlines()]
class_names300 = []
with open('data/300.txt', 'r', encoding='utf-8') as f:
    class_names300 = [line.strip() for line in f.readlines()]

# 加载人脸名称映射
face_names = []
with open('data/face_names.txt', 'r', encoding='utf-8') as f:
    face_names = [line.strip() for line in f.readlines()]

id_to_name = os.listdir('static/imgs/')
# 可能需要根据实际的分隔符来分割字符串
id_to_name = {int(name[:3])-1: name for name in id_to_name if name[:3].isdigit()}
herb_to_formulas = {}
with open('data/yao2yf.txt', 'r', encoding='utf-8') as f:
    for line in f.readlines():
        parts = line.strip().split('\t')
        if len(parts) >= 2:
            herb_to_formulas[parts[0]] = [formula.strip() for formula in parts[1].split(',')]

# 加载药材功能数据
herb_functions = {}

with open('data/yaocmpd.txt', 'r', encoding='utf-8') as f:
    for line in f.readlines():
        parts = line.strip().split('\t')
        if len(parts) >= 2:
            herb_functions[parts[0]] = parts[1]


# 加载药方功能数据
formula_functions = {}
with open('data/yaoD.txt', 'r', encoding='utf-8') as f:
    for line in f.readlines():
        parts = line.strip().split('\t')
        if len(parts) >= 2:
            formula_functions[parts[0]] = parts[1]

# 加载疾病-药方数据
disease_to_formulas = {}

# 加载药方-药材数据
formula_to_herbs = {}
with open('data/yaoAna_new_names.txt', 'r', encoding='utf-8') as f:
    for line in f.readlines():
        parts = line.strip().split('\t')
        if len(parts) >= 2:
            formula_to_herbs[parts[0]] = [herb.strip() for herb in parts[1].split(',')]
with open('data/disease_formulas.txt', 'r', encoding='utf-8') as f:
    for line in f.readlines():
        parts = line.strip().split('\t')
        if len(parts) >= 2:
            disease_to_formulas[parts[0]] = parts[1].split(',')

@app.route('/')
def index():
    username = session.get('username')
    return render_template('index.html', username=username)

@app.route('/classification')
def classification():
    return render_template('classification.html')

@app.route('/camera')
def camera():
    return render_template('camera.html')

@app.route('/zhijianbaicao')
def zhijianbaicao():
    return render_template('zhijianbaicao.html')

@app.route('/formula')
def formula():
    return render_template('formula.html')

@app.route('/voice')
def voice():
    username = session.get('username')
    return render_template('voice.html', username=username)

@app.route('/all_formulas')
def all_formulas():
    return render_template('all_formulas.html')

@app.route('/knowledge_base')
def knowledge_base():
    return render_template('knowledge_base.html')

@app.route('/weight')
def weight():
    return render_template('weight.html')

@app.route('/new_page')
def new_page():
    return render_template('new_page.html')

@app.route('/my_clinic')
@login_required
def my_clinic():
    return render_template('my_clinic.html', username=session['username'])

# 人脸识别登录API
@app.route('/api/face_login', methods=['POST'])
def face_login():
    try:
        # 获取请求数据
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'success': False, 'message': '缺少图像数据'})
        
        # 解码图像数据
        img_data = data['image'].split(',')[1]  # 移除data:image/jpeg;base64,前缀
        img_bytes = base64.b64decode(img_data)
        img = Image.open(BytesIO(img_bytes))
        
        # 将PIL图像转换为OpenCV格式
        img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        
        # 使用predict_face函数识别人脸
        face_result = predict_face(models['yoloface'], img_cv)
        
        # 获取识别到的用户索引
        user_index = face_result['recognized_user_index']
        confidence = face_result['confidence']
        
        # 检查是否识别到用户
        if user_index is not None and confidence > 0.3:
            # 检查索引是否在有效范围内
            if user_index < len(face_names):
                username = face_names[user_index]
                
                # 设置用户会话
                session['username'] = username
                
                return jsonify({
                    'success': True, 
                    'message': '人脸识别成功', 
                    'username': username,
                    'confidence': confidence
                })
            else:
                return jsonify({'success': False, 'message': f'未识别到有效用户，索引 {user_index} 超出范围'})
        else:
            return jsonify({'success': False, 'message': '未识别到有效人脸或置信度不足'})
            
    except Exception as e:
        print(f'人脸识别错误: {e}')
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': f'人脸识别失败: {str(e)}'})

@app.route('/api/classify_herb', methods=['POST'])
def classify_herb():
    if 'file' not in request.files:
        return jsonify({'error': '没有文件上传'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': '没有选择文件'})
    
    # 读取图片
    img_bytes = file.read()
    img = Image.open(BytesIO(img_bytes))
    
    # 预测
    result = predict_herb(models['convnext300'], img, class_names300)
    
    # 获取相关图片
    related_imgs = []
    id = result['class_id']
    name = id_to_name[id]
    class_dir = f"static/imgs/{name}"
    if os.path.exists(class_dir):
        for img_file in os.listdir(class_dir)[:3]:
            related_imgs.append(f"{class_dir}/{img_file}")
    
    # 获取功能和药方
    function = herb_functions.get(result['class_name'], '功能信息暂未收录')
    formulas = herb_to_formulas.get(result['class_name'], [])
    
    return jsonify({
        'class_name': result['class_name'],
        'confidence': result['confidence'],
        'related_imgs': related_imgs,
        'function': function,
        'formulas': formulas
    })

@app.route('/api/classify_camera', methods=['POST'])
def classify_camera():
    data = request.get_json()
    img_data = data['image'].split(',')[1]  # 移除data:image/jpeg;base64,前缀
    
    # 解码图片
    img_bytes = base64.b64decode(img_data)
    img = Image.open(BytesIO(img_bytes))
    
    # 预测
    result = predict_herb(models['convnext5'], img, class_names5)
    
    # 获取功能和药方
    function = herb_functions.get(result['class_name'], '功能信息暂未收录')
    formulas = herb_to_formulas.get(result['class_name'], [])
    
    return jsonify({
        'class_name': result['class_name'],
        'confidence': result['confidence'],
        'function': function,
        'formulas': formulas
    })

@app.route('/api/detect_formula', methods=['POST'])
def detect_formula():
    try:
        # 记录请求开始
        print("接收到检测请求...")
        
        # 获取和验证请求数据
        data = request.get_json()
        if not data:
            return jsonify({'error': '无效的JSON数据'}), 400
            
        if 'image' not in data:
            return jsonify({'error': '缺少图像数据'}), 400
            
        # 解析图像数据
        img_data = data['image'].split(',')[1]  # 移除data:image/jpeg;base64,前缀
        target_herbs = data.get('target_herbs', [])
        
        print(f"目标药材列表: {target_herbs}")
        
        # 解码图片
        img_bytes = base64.b64decode(img_data)
        img_np = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'error': '无法解码图像数据'}), 400
            
        # 使用YOLO模型检测定位
        detections = predict_formula(models['yolo'], img)

        #使用MPcnn进行检测识别（传入yolo的框选结果）
        # results = predict_herb(models['mpcnn'], detections, class_names5)

        # 记录检测结果
        detected_herbs = [det['class_name'] for det in detections]
        print(f"检测到的药材: {detected_herbs}")
        print(f"检测结果数量: {len(detections)}")
        
        # 比对检测结果和目标药材
        missing = []
        extra = []
        
        for herb in target_herbs:
            if herb not in detected_herbs:
                missing.append(herb)
        
        for herb in detected_herbs:
            if herb not in target_herbs:
                extra.append(herb)
        
        # 生成语音消息
        if len(missing) == 0 and len(extra) == 0:
            voice_message = "药方无误，所有药材均已识别"
        else:
            voice_message = ""
            
        # 完善语音消息
        if len(missing) > 0:
            voice_message += f"缺少{','.join(missing)}。"
        
        if len(extra) > 0:
            voice_message += f"检测到多余的药材：{','.join(extra)}。"
        
        # 确保总是返回包含detections字段的JSON响应
        return jsonify({
            'detections': detections,
            'missing': missing,
            'extra': extra,
            'voice_message': voice_message
        })
    except Exception as e:
        # 记录详细错误信息
        print(f"检测过程中发生错误: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # 返回友好的错误响应，同时包含错误详情用于调试
        return jsonify({
            'error': '检测过程中发生错误',
            'details': str(e),
            'detections': []  # 确保总是有detections字段
        }), 500

@app.route('/api/search_formulas', methods=['POST'])
def search_formulas():
    data = request.get_json()
    disease = data['disease']
    
    formulas = disease_to_formulas.get(disease, [])
    formula_details = []
    
    for formula in formulas:
        function = formula_functions.get(formula, '功能信息暂未收录')
        formula_details.append({
            'name': formula,
            'function': function
        })
    
    return jsonify({
        'disease': disease,
        'formulas': formula_details
    })

@app.route('/api/all_formulas', methods=['GET'])
def get_all_formulas():
    # 从disease_to_formulas、herb_to_formulas和formula_to_herbs中收集所有药方，去重
    all_formula_set = set()
    for formulas in disease_to_formulas.values():
        all_formula_set.update(formulas)
    for formulas in herb_to_formulas.values():
        all_formula_set.update(formulas)
    # 添加formula_to_herbs中的所有药方名称
    all_formula_set.update(formula_to_herbs.keys())
    
    # 转换为列表并排序
    all_formulas_list = sorted(list(all_formula_set))
    
    # 准备返回数据
    formula_details = []
    for formula in all_formulas_list:
        function = formula_functions.get(formula, '功能信息暂未收录')
        formula_details.append({
            'name': formula,
            'function': function
        })
    
    return jsonify({
        'formulas': formula_details
    })

# 预诊报告相关API

@app.route('/api/save_report', methods=['POST'])
@login_required
def save_report():
    """保存预诊报告"""
    data = request.get_json()
    db = next(get_db())
    
    # 创建新报告
    report = PreDiagnosisReport(
        user_id=session['user_id'],
        patient_name=data.get('patientInfo', {}).get('name', ''),
        gender=data.get('patientInfo', {}).get('gender', ''),
        age=data.get('patientInfo', {}).get('age', ''),
        occupation=data.get('patientInfo', {}).get('occupation', ''),
        main_complaint=data.get('patientInfo', {}).get('mainComplaint', ''),
        content=data.get('content', ''),
        conversation_history=json.dumps(data.get('conversationHistory', []), ensure_ascii=False)
    )
    
    # 保存到数据库
    db.add(report)
    db.commit()
    db.refresh(report)
    
    return jsonify({'success': True, 'message': '报告保存成功', 'report_id': report.id})

@app.route('/api/get_reports', methods=['GET'])
@login_required
def get_reports():
    """获取当前用户的所有预诊报告"""
    db = next(get_db())
    # 只返回当前用户的报告
    user_reports = db.query(PreDiagnosisReport).filter(PreDiagnosisReport.user_id == session['user_id']).all()
    
    # 转换为JSON格式
    reports = []
    for report in user_reports:
        reports.append({
            'id': report.id,
            'timestamp': report.created_at.isoformat(),
            'date': report.created_at.strftime('%Y年%m月%d日'),
            'patientInfo': {
                'name': report.patient_name,
                'gender': report.gender,
                'age': report.age,
                'occupation': report.occupation,
                'mainComplaint': report.main_complaint
            },
            'content': report.content
        })
    
    return jsonify({'success': True, 'reports': reports})

@app.route('/api/get_report/<int:report_id>', methods=['GET'])
@login_required
def get_report(report_id):
    """获取指定预诊报告"""
    db = next(get_db())
    report = db.query(PreDiagnosisReport).filter(PreDiagnosisReport.id == report_id).first()
    
    if report:
        # 检查报告是否属于当前用户
        if report.user_id == session['user_id']:
            return jsonify({
                'success': True, 
                'report': {
                    'id': report.id,
                    'timestamp': report.created_at.isoformat(),
                    'date': report.created_at.strftime('%Y年%m月%d日'),
                    'patientInfo': {
                        'name': report.patient_name,
                        'gender': report.gender,
                        'age': report.age,
                        'occupation': report.occupation,
                        'mainComplaint': report.main_complaint
                    },
                    'content': report.content,
                    'conversationHistory': report.get_conversation_history()
                }
            })
        else:
            return jsonify({'success': False, 'message': '没有权限访问此报告'}), 403
    
    return jsonify({'success': False, 'message': '报告不存在'}), 404

@app.route('/api/formula/<formula_name>', methods=['GET'])
def get_formula_details(formula_name):
    # 获取方剂的药材组成
    herbs = formula_to_herbs.get(formula_name, [])
    # 获取方剂的功能
    function = formula_functions.get(formula_name, '功能信息暂未收录')
    
    return jsonify({
        'name': formula_name,
        'herbs': herbs,
        'function': function
    })

@app.route('/api/knowledge_base_data', methods=['GET'])
def get_knowledge_base_data():
    # 创建中文药材名称到图片信息的映射
    herb_to_img_info = {}
    for idx, herb_name in enumerate(class_names300):
        if idx in id_to_name:
            img_dir = id_to_name[idx]
            class_dir = f"static/imgs/{img_dir}"
            img_files = []
            if os.path.exists(class_dir):
                # 获取文件夹中的所有图片文件，支持jpg、jpeg、png、webp格式
                all_files = os.listdir(class_dir)
                img_files = [f for f in all_files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))][:3]  # 最多取3张
            herb_to_img_info[herb_name] = {
                'dir': img_dir,
                'files': img_files
            }
    
    # 提供知识库所需的全部数据
    data = {
        'herb_to_formulas': herb_to_formulas,
        'formula_to_herbs': formula_to_herbs,
        'herb_functions': herb_functions,
        'formula_functions': formula_functions,
        'disease_to_formulas': disease_to_formulas,
        'herb_to_img_info': herb_to_img_info
    }
    return jsonify({'success': True, 'data': data})

@app.route('/api/disease_formulas', methods=['GET'])
def get_disease_formulas():
    # 直接返回疾病-药方映射和药方功能信息
    return jsonify({
        'diseases': disease_to_formulas,
        'formula_functions': formula_functions
    })

@app.route('/api/function_formulas', methods=['GET'])
def get_function_formulas():
    # 按功能分类药方（简单实现，基于功能描述中的关键词）
    function_categories = {
        '解表剂': [],
        '清热剂': [],
        '和解剂': [],
        '泻下剂': [],
        '温里剂': [],
        '补益剂': [],
        '固涩剂': [],
        '安神剂': [],
        '理气剂': [],
        '理血剂': [],
        '祛湿剂': [],
        '祛痰剂': [],
        '其他': []
    }
    
    # 从disease_to_formulas和herb_to_formulas中收集所有药方，去重
    all_formula_set = set()
    for formulas in disease_to_formulas.values():
        all_formula_set.update(formulas)
    for formulas in herb_to_formulas.values():
        all_formula_set.update(formulas)
    
    # 分类药方
    for formula in all_formula_set:
        function = formula_functions.get(formula, '')
        function_lower = function.lower()
        
        # 根据功能描述中的关键词进行分类
        if '解表' in function_lower or '发散' in function_lower:
            function_categories['解表剂'].append(formula)
        elif '清热' in function_lower or '解毒' in function_lower or '泻火' in function_lower:
            function_categories['清热剂'].append(formula)
        elif '和解' in function_lower or '少阳' in function_lower:
            function_categories['和解剂'].append(formula)
        elif '泻下' in function_lower or '通便' in function_lower:
            function_categories['泻下剂'].append(formula)
        elif '温里' in function_lower or '散寒' in function_lower or '回阳' in function_lower:
            function_categories['温里剂'].append(formula)
        elif '补' in function_lower or '虚' in function_lower:
            function_categories['补益剂'].append(formula)
        elif '固涩' in function_lower or '止' in function_lower:
            function_categories['固涩剂'].append(formula)
        elif '安神' in function_lower or '镇静' in function_lower:
            function_categories['安神剂'].append(formula)
        elif '理气' in function_lower or '行气' in function_lower:
            function_categories['理气剂'].append(formula)
        elif '活血' in function_lower or '止血' in function_lower or '化瘀' in function_lower:
            function_categories['理血剂'].append(formula)
        elif '祛湿' in function_lower or '利湿' in function_lower or '化湿' in function_lower:
            function_categories['祛湿剂'].append(formula)
        elif '祛痰' in function_lower or '化痰' in function_lower:
            function_categories['祛痰剂'].append(formula)
        else:
            function_categories['其他'].append(formula)
    
    # 移除空分类
    for category in list(function_categories.keys()):
        if len(function_categories[category]) == 0:
            del function_categories[category]
    
    # 对每个分类中的药方排序
    for category in function_categories:
        function_categories[category].sort()
    
    return jsonify({
        'function_categories': function_categories,
        'formula_functions': formula_functions
    })

@app.route('/api/formula_detail', methods=['GET'])
def get_formula_detail():
    formula_name = request.args.get('name')
    if not formula_name:
        return jsonify({'error': '缺少药方名称参数'}), 400
    
    # 获取药方功能
    function = formula_functions.get(formula_name, '功能信息暂未收录')
    
    # 获取药方组成药材
    herbs = formula_to_herbs.get(formula_name, [])
    
    # 返回药方详细信息
    return jsonify({
        'formula': {
            'name': formula_name,
            'function': function,
            'herbs': herbs
        }
    })

# 用户登录路由
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # 查询数据库中的用户
        db = next(get_db())
        user = db.query(User).filter(User.username == username).first()
        
        if user and check_password_hash(user.password, password):
            # 登录成功，设置session
            session['username'] = username
            session['user_id'] = user.id
            return redirect(url_for('index'))
        
        # 登录失败
        return render_template('login.html', error='用户名或密码错误')
    
    # GET请求，显示登录页面
    return render_template('login.html')

# 用户注册路由
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        email = request.form.get('email', '')
        
        # 检查密码是否匹配
        if password != confirm_password:
            return render_template('register.html', error='两次输入的密码不一致')
        
        # 查询数据库中是否已存在该用户名
        db = next(get_db())
        existing_user = db.query(User).filter(User.username == username).first()
        
        if existing_user:
            return render_template('register.html', error='用户名已存在')
        
        # 创建新用户
        new_user = User(
            username=username,
            password=generate_password_hash(password),
            email=email
        )
        
        # 保存到数据库
        db.add(new_user)
        db.commit()
        
        # 注册成功，重定向到登录页面
        return redirect(url_for('login'))
    
    # GET请求，显示注册页面
    return render_template('register.html')

# 用户登出路由
@app.route('/logout')
def logout():
    # 清除session
    session.pop('username', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    # 创建数据库表
    create_tables()
    app.run(debug=True, host='0.0.0.0', port=5002)