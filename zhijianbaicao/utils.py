import torch
import torchvision.transforms as transforms
from PIL import Image
import cv2
import numpy as np
import torchvision
from ultralytics import YOLO

with open('data/10.txt', 'r', encoding='utf-8') as f:
    class_names = [line.strip() for line in f.readlines()]
# 加载模型
def load_models():
    models = {}
    
    # 加载ConvNeXt模型
    convnext_model = torchvision.models.convnext_tiny(pretrained=False, num_classes=5)
    w = torch.load('static/models/cvmp5.pth', map_location='cpu',weights_only=False)
    w = w['model']
    convnext_model.load_state_dict(w)
    convnext_model.eval()
    models['convnext5'] = convnext_model
    
    convnext_model = torchvision.models.convnext_tiny(pretrained=False, num_classes=300)
    w = torch.load('static/models/cvmp300.pth', map_location='cpu',weights_only=False)
    w = w['model']
    convnext_model.load_state_dict(w)
    convnext_model.eval()
    models['convnext300'] = convnext_model
    
    # 加载YOLO模型
    yolo_model = YOLO('static/models/yolo_mp10.pt')
    yolo_model.eval()
    models['yolo'] = yolo_model

    yolo_model = YOLO('static/models/best.pt')
    yolo_model.eval()
    models['yoloface'] = yolo_model
    
    return models

# 图像预处理
def preprocess_image(image):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    return transform(image).unsqueeze(0)

# 预测中草药
def predict_herb(model, image, class_names):
    input_tensor = preprocess_image(image)
    
    with torch.no_grad():
        output = model(input_tensor)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        predicted_class = torch.argmax(probabilities).item()
        confidence = probabilities[predicted_class].item()
    
    return {
        'class_id': predicted_class,
        'class_name': class_names[predicted_class],
        'confidence': confidence
    }

# 预测方剂
def predict_formula(model, image):
    try:
        # 使用YOLO模型进行检测
        results = model(image)
        detection_results = []
        
        # 检查results是否有效
        if not results or len(results) == 0:
            print("未检测到任何结果")
            return detection_results
            
        for result in results:
            boxes = result.boxes  # Boxes object for bounding box outputs
            
            if boxes is not None and len(boxes) > 0:
                # 获取检测到的每个对象的信息
                for i in range(len(boxes)):
                    try:
                        # 获取类别索引
                        cls_index = int(boxes.cls[i].item())
                        # 获取置信度
                        confidence = boxes.conf[i].item()
                        
                        # 过滤低置信度的检测结果
                        if confidence < 0.3:
                            continue

                        # YOLO默认返回xyxy格式
                        x1, y1, x2, y2 = boxes.xyxy[i].tolist()
                        x , y = x1 , y1
                        w , h = x2 - x1 , y2 - y1

                        # 根据类别索引获取类别名称
                        if cls_index >= 0 and cls_index < len(class_names):
                            class_name = class_names[cls_index]
                        else:
                            class_name = f"未知类别_{cls_index}"
                            print(f"警告: 检测到未知类别索引 {cls_index}")
                        
                        detection_results.append({
                            'class_name': class_name,
                            'confidence': round(confidence, 4),
                            'bbox':[round(coord, 2) for coord in [x, y, w, h]]
                        })
                    except Exception as e:
                        print(f"处理检测框时出错: {e}")
            else:
                print("未检测到任何目标")
        
        print(f"成功检测到 {len(detection_results)} 个目标")
        return detection_results
    except Exception as e:
        print(f"预测过程中发生错误: {e}")
        # 返回空列表而不是抛出异常，以避免服务器崩溃
        return []

# 人脸识别函数
def predict_face(model, image):
    try:
        # 使用YOLO模型检测人脸
        results = model(image)
        
        # 初始化识别结果
        face_results = {
            'faces': [],
            'recognized_user_index': None,
            'confidence': 0.0
        }
        
        # 处理检测结果
        for result in results:
            boxes = result.boxes  # Boxes object for bounding box outputs
            
            if boxes is not None and len(boxes) > 0:
                # 获取检测到的每个对象的信息
                for i in range(len(boxes)):
                    try:
                        # 获取类别索引
                        cls_index = int(boxes.cls[i].item())
                        # 获取置信度
                        confidence = boxes.conf[i].item()
                        
                        # 过滤低置信度的检测结果
                        if confidence < 0.3:
                            continue
                        
                        # YOLO默认返回xyxy格式
                        x1, y1, x2, y2 = boxes.xyxy[i].tolist()
                        
                        # 计算宽度和高度
                        w, h = x2 - x1, y2 - y1
                        
                        # 添加人脸信息到结果
                        face_results['faces'].append({
                            'bbox': [round(coord, 2) for coord in [x1, y1, w, h]],
                            'confidence': confidence,
                            'class_index': cls_index
                        })
                        
                        # 第一个检测到的人脸是要识别的用户，选择置信度最高的人脸
                        if confidence > face_results['confidence']:
                            face_results['recognized_user_index'] = cls_index
                            face_results['confidence'] = confidence
                            
                    except Exception as e:
                        print(f"处理人脸检测结果时出错: {e}")
        
        print(f"成功检测到 {len(face_results['faces'])} 张人脸")
        if face_results['recognized_user_index'] is not None:
            print(f"识别到用户索引: {face_results['recognized_user_index']}, 置信度: {face_results['confidence']:.4f}")
        return face_results
    except Exception as e:
        print(f"人脸识别过程中发生错误: {e}")
        # 返回空结果而不是抛出异常，以避免服务器崩溃
        return {
            'faces': [],
            'recognized_user_index': None,
            'confidence': 0.0
        }