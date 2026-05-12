// 中药知识库页面交互逻辑

// DOM元素
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const resultTabs = document.querySelectorAll('.result-tab');
const herbModal = document.getElementById('herb-modal');
const formulaModal = document.getElementById('formula-modal');
const diseaseModal = document.getElementById('disease-modal');
const dietModal = document.getElementById('diet-modal');
const closeBtns = document.querySelectorAll('.close-btn');
const navCategories = document.getElementById('navCategories');
const alphabetContainer = document.getElementById('alphabetContainer');

// 导航分类数据
const navData = {
    herb: {
        categories: [
            {
                name: '性味归经',
                items: ['寒', '热', '温', '凉', '平', '酸', '苦', '甘', '辛', '咸', '心', '肝', '脾', '肺', '肾']
            },
            {
                name: '性质划分',
                items: ['解表药', '清热药', '泻下药', '祛风湿药', '化湿药', '利水渗湿药', '温里药', '理气药', '消食药', '驱虫药', '止血药', '活血化瘀药', '化痰止咳平喘药', '安神药', '平肝息风药', '开窍药', '补虚药', '收涩药', '涌吐药', '外用药']
            },
            {
                name: '功效主治',
                items: ['清热解毒', '活血化瘀', '祛风除湿', '补气养血', '止咳化痰', '平肝息风', '利水消肿', '理气止痛', '消食导滞', '涩肠止泻']
            }
        ] 
    },
    formula: {
        categories: [
            {
                name: '适用病症',
                items: ['感冒', '发热', '咳嗽', '腹泻', '便秘', '疼痛', '失眠', '高血压', '糖尿病', '心脏病']
            },
            {
                name: '功能分类',
                items: ['解表剂', '清热剂', '和解剂', '泻下剂', '温里剂', '补益剂', '固涩剂', '安神剂', '理气剂', '理血剂', '祛湿剂', '祛痰剂']
            },
            {
                name: '组成规模',
                items: ['单味药', '小方（2-5味）', '中方（6-12味）', '大方（13味以上）']
            }
            
        ]
    },
    disease: {
        categories: [
            {
                name: '中医分类',
                items: ['外感病', '内伤病', '热病', '寒病', '虚证', '实证', '表里证', '寒热证', '虚实证', '阴阳证']
            },
            {
                name: '西医分类',
                items: ['呼吸系统', '消化系统', '心血管系统', '神经系统', '内分泌系统', '免疫系统', '泌尿系统', '生殖系统', '运动系统', '皮肤科']
            },
            {
                name: '发病部位',
                items: ['头部', '颈部', '胸部', '腹部', '背部', '四肢', '全身', '内脏', '皮肤', '五官']
            }
        ]
    },
    diet: {
        categories: [
            {
                name: '功能分类',
                items: ['滋补养生', '清热解毒', '活血化瘀', '祛风除湿', '补气养血', '健脾开胃', '润肺止咳', '补肾壮阳', '美容养颜', '减肥瘦身']
            },
            {
                name: '适用人群',
                items: ['儿童', '青少年', '成人', '老年人', '孕妇', '产妇', '体虚者', '肥胖者', '高血压', '糖尿病']
            },
            {
                name: '季节分类',
                items: ['春季', '夏季', '秋季', '冬季', '四季通用', '节气养生', '节日养生']
            }
        ]
    }
};

// 26个英文字母
const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// 获取汉字首字母（大写） - 只使用基于首字符的映射表
function getFirstLetter(chineseChar) {
    // 常用中药名称首字符拼音首字母映射表
    const charPinyinMap = {
        // A
        '阿': 'A', '艾': 'A', '安': 'A', '桉': 'A',
        // B
        '巴': 'B', '白': 'B', '柏': 'B', '百': 'B', '斑': 'B', '半': 'B', '蚌': 'B', '贝': 'B', '北': 'B', '本': 'B', '崩': 'B', '荜': 'B', '扁': 'B', '鳖': 'B', '槟': 'B', '冰': 'B', '硼': 'B', '补': 'B', '布': 'B', '薄': 'B',
        // C
        '苍': 'C', '草': 'C', '柴': 'C', '蝉': 'C', '蟾': 'C', '长': 'C', '车': 'C', '陈': 'C', '赤': 'C', '虫': 'C', '臭': 'C', '川': 'C', '穿': 'C', '垂': 'C', '春': 'C', '刺': 'C', '粗': 'C', '磁': 'C', '雌': 'C', '葱': 'C', '醋': 'C', '藏': 'C',
        // D
        '大': 'D', '丹': 'D', '淡': 'D', '当': 'D', '党': 'D', '倒': 'D', '灯': 'D', '地': 'D', '丁': 'D', '冬': 'D', '豆': 'D', '独': 'D', '杜': 'D', '断': 'D', '煅': 'D',
        // E
        '莪': 'E', '鹅': 'E', '饿': 'E', '儿': 'E',
        // F
        '法': 'F', '番': 'F', '防': 'F', '飞': 'F', '非': 'F', '粉': 'F', '蜂': 'F', '凤': 'F', '佛': 'F', '伏': 'F', '茯': 'F', '浮': 'F', '附': 'F',
        // G
        '甘': 'G', '干': 'G', '高': 'G', '葛': 'G', '蛤': 'G', '钩': 'G', '狗': 'G', '枸': 'G', '骨': 'G', '瓜': 'G', '关': 'G', '贯': 'G', '广': 'G', '归': 'G', '桂': 'G',
        // H
        '海': 'H', '寒': 'H', '诃': 'H', '荷': 'H', '黑': 'H', '红': 'H', '厚': 'H', '胡': 'H', '葫': 'H', '虎': 'H', '花': 'H', '化': 'H', '槐': 'H', '黄': 'H', '火': 'H',
        // J
        '鸡': 'J', '积': 'J', '戟': 'J', '蓟': 'J', '寄': 'J', '加': 'J', '甲': 'J', '姜': 'J', '僵': 'J', '降': 'J', '椒': 'J', '绞': 'J', '接': 'J', '芥': 'J', '金': 'J', '荆': 'J', '锦': 'J', '京': 'J', '韭': 'J', '九': 'J', '久': 'J', '橘': 'J',
        // K
        '卡': 'K', '开': 'K', '坎': 'K', '康': 'K', '苦': 'K', '款': 'K',
        // L
        '莱': 'L', '蓝': 'L', '狼': 'L', '老': 'L', '雷': 'L', '藜': 'L', '李': 'L', '连': 'L', '莲': 'L', '凉': 'L', '羚': 'L', '铃': 'L', '刘': 'L', '龙': 'L', '芦': 'L', '路': 'L', '鹿': 'L', '吕': 'L', '绿': 'L', '萝': 'L', '络': 'L',
        // M
        '麻': 'M', '马': 'M', '麦': 'M', '蔓': 'M', '茅': 'M', '梅': 'M', '没': 'M', '木': 'M',
        // N
        '南': 'N', '牛': 'N', '女': 'N',
        // O
        '藕': 'O',
        // P
        '胖': 'P', '炮': 'P', '佩': 'P', '蒲': 'P',
        // Q
        '七': 'Q', '漆': 'Q', '戚': 'Q', '蕲': 'Q', '前': 'Q', '羌': 'Q', '枪': 'Q', '秦': 'Q', '青': 'Q', '轻': 'Q', '全': 'Q', '瞿': 'Q',
        // R
        '人': 'R', '忍': 'R', '肉': 'R', '乳': 'R',
        // S
        '三': 'S', '桑': 'S', '沙': 'S', '山': 'S', '商': 'S', '少': 'S', '蛇': 'S', '射': 'S', '生': 'S', '升': 'S', '石': 'S', '使': 'S', '士': 'S', '首': 'S', '双': 'S', '水': 'S', '松': 'S', '苏': 'S', '酸': 'S', '锁': 'S',
        // T
        '桃': 'T', '天': 'T', '田': 'T', '铁': 'T', '通': 'T', '土': 'T',
        // W
        '瓦': 'W', '王': 'W', '威': 'W', '薇': 'W', '乌': 'W', '吴': 'W', '五': 'W',
        // X
        '西': 'X', '豨': 'X', '喜': 'X', '仙': 'X', '香': 'X', '橡': 'X', '小': 'X', '薤': 'X', '辛': 'X', '杏': 'X', '雄': 'X', '续': 'X', '旋': 'X', '雪': 'X',
        // Y
        '鸭': 'Y', '延': 'Y', '岩': 'Y', '盐': 'Y', '洋': 'Y', '阳': 'Y', '杨': 'Y', '羊': 'Y', '野': 'Y', '叶': 'Y', '夜': 'Y', '一': 'Y', '伊': 'Y', '衣': 'Y', '银': 'Y', '淫': 'Y', '郁': 'Y', '玉': 'Y', '芋': 'Y', '元': 'Y', '远': 'Y', '越': 'Y',
        // Z
        '泽': 'Z', '樟': 'Z', '枣': 'Z', '皂': 'Z', '赭': 'Z', '浙': 'Z', '贞': 'Z', '珍': 'Z', '知': 'Z', '栀': 'Z', '枝': 'Z', '植': 'Z', '蛭': 'Z', '钟': 'Z', '重': 'Z', '朱': 'Z', '竹': 'Z', '紫': 'Z'
    };
    
    // 直接返回映射结果，如果没有找到则返回空字符串
    return charPinyinMap[chineseChar] || '';
}

// 生成字母索引
function generateAlphabetIndex() {
    if (!alphabetContainer) return;
    
    let html = '';
    alphabets.forEach(letter => {
        html += `<button class="alphabet-item" data-letter="${letter}">${letter}</button>`;
    });
    
    alphabetContainer.innerHTML = html;
    
    // 绑定字母点击事件
    const alphabetItems = alphabetContainer.querySelectorAll('.alphabet-item');
    alphabetItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除其他字母的选中状态
            alphabetItems.forEach(btn => btn.classList.remove('active'));
            // 添加当前字母的选中状态
            item.classList.add('active');
            
            // 获取当前选中的标签页类型
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const tabType = activeTab.getAttribute('data-tab');
                // 根据字母筛选卡片
                filterByLetter(item.dataset.letter, tabType);
            }
        });
    });
}

// 根据字母筛选卡片
function filterByLetter(letter, type) {
    // 根据类型获取当前的所有结果
    let allResults;
    switch(type) {
        case 'herb':
            allResults = getHerbsList();
            break;
        case 'formula':
            allResults = getFormulasList();
            break;
        case 'disease':
            allResults = getDiseasesList();
            break;
        case 'diet':
            allResults = getDietsList();
            break;
        default:
            allResults = [];
    }
    
    // 根据首字母筛选结果
    const filteredResults = allResults.filter(item => {
        if (!item.name || item.name.length === 0) return false;
        
        // 获取首字首字母
        const firstChar = item.name.charAt(0);
        const firstLetter = getFirstLetter(firstChar);
        
        // 只有当首字母能确定且与目标字母匹配时才显示
        return firstLetter === letter;
    });
    
    // 显示筛选结果
    switch(type) {
        case 'herb':
            displayHerbResults(filteredResults);
            break;
        case 'formula':
            displayFormulaResults(filteredResults);
            break;
        case 'disease':
            displayDiseaseResults(filteredResults);
            break;
        case 'diet':
            displayDietResults(filteredResults);
            break;
    }
    
    // 显示筛选结果提示
    showMessage(`已筛选首字母为${letter}的${type === 'herb' ? '药材' : type === 'formula' ? '药方' : type === 'disease' ? '疾病' : '药膳'}，共${filteredResults.length}个结果`, 'success');
}

// 生成导航栏
function generateNavigation(category) {
    if (!navCategories) return;
    
    const data = navData[category];
    if (!data) {
        navCategories.innerHTML = '<p style="color: #666; padding: 1rem;">暂无分类数据</p>';
        return;
    }
    
    let html = '';
    data.categories.forEach((group, groupIndex) => {
        html += `
            <div class="category-group ${groupIndex === 0 ? 'expanded' : ''}">
                <h4>${group.name}</h4>
                <div class="category-items">
                    ${group.items.map(item => `
                        <div class="category-item" data-category="${item}">
                            ${item}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    navCategories.innerHTML = html;
    
    // 绑定分类组展开/收起事件
    const categoryGroups = navCategories.querySelectorAll('.category-group');
    categoryGroups.forEach(group => {
        const header = group.querySelector('h4');
        header.addEventListener('click', () => {
            group.classList.toggle('expanded');
        });
    });
    
    // 绑定分类项点击事件
    const categoryItems = navCategories.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // 移除其他选中状态
            categoryItems.forEach(btn => btn.classList.remove('active'));
            // 添加当前选中状态
            item.classList.add('active');
            
            // 筛选显示相应卡片
            filterCards(item.dataset.category, category);
        });
    });
}

// 筛选显示卡片
function filterCards(category, type) {
    // 根据类型获取当前的所有结果
    let allResults;
    switch(type) {
        case 'herb':
            allResults = getHerbsList();
            break;
        case 'formula':
            allResults = getFormulasList();
            break;
        case 'disease':
            allResults = getDiseasesList();
            break;
        case 'diet':
            allResults = getDietsList();
            break;
        default:
            allResults = [];
    }
    
    // 根据分类筛选结果
    let filteredResults = allResults;
    
    if (category) {
        filteredResults = allResults.filter(item => {
            // 根据不同类型使用不同的筛选逻辑
            switch(type) {
                case 'herb':
                    // 药材筛选：检查功能描述是否包含分类关键词
                    return item.function.includes(category) || item.name.includes(category);
                case 'formula':
                    // 药方筛选：检查功能描述是否包含分类关键词
                    return item.function.includes(category) || item.name.includes(category);
                case 'disease':
                    // 疾病筛选：检查疾病是否属于所选分类
                    // 使用疾病名称与分类的关联进行匹配
                    return item.name.includes(category) || 
                           item.formulas.some(formula => formula.includes(category)) ||
                           // 根据分类特性进行更智能的匹配
                           (category === '呼吸系统' && (item.name.includes('咳嗽') || item.name.includes('感冒') || item.name.includes('肺炎'))) ||
                           (category === '消化系统' && (item.name.includes('腹泻') || item.name.includes('便秘') || item.name.includes('胃痛'))) ||
                           (category === '心血管系统' && (item.name.includes('高血压') || item.name.includes('心脏病'))) ||
                           (category === '神经系统' && (item.name.includes('头痛') || item.name.includes('失眠'))) ||
                           (category === '内分泌系统' && (item.name.includes('糖尿病'))) ||
                           (category === '免疫系统' && (item.name.includes('过敏'))) ||
                           (category === '泌尿系统' && (item.name.includes('肾炎') || item.name.includes('尿路感染'))) ||
                           (category === '生殖系统' && (item.name.includes('月经') || item.name.includes('不孕'))) ||
                           (category === '运动系统' && (item.name.includes('关节炎') || item.name.includes('腰痛'))) ||
                           (category === '皮肤科' && (item.name.includes('湿疹') || item.name.includes('痤疮'))) ||
                           (category === '外感病' && (item.name.includes('感冒') || item.name.includes('发热'))) ||
                           (category === '内伤病' && (item.name.includes('头痛') || item.name.includes('胃痛'))) ||
                           (category === '热病' && (item.name.includes('发热') || item.name.includes('中暑'))) ||
                           (category === '寒病' && (item.name.includes('感冒') || item.name.includes('腹痛'))) ||
                           (category === '虚证' && (item.name.includes('虚弱') || item.name.includes('乏力'))) ||
                           (category === '实证' && (item.name.includes('便秘') || item.name.includes('腹胀'))) ||
                           (category === '头部' && (item.name.includes('头痛') || item.name.includes('眩晕'))) ||
                           (category === '胸部' && (item.name.includes('咳嗽') || item.name.includes('胸痛'))) ||
                           (category === '腹部' && (item.name.includes('腹痛') || item.name.includes('腹泻'))) ||
                           (category === '四肢' && (item.name.includes('关节炎') || item.name.includes('腿痛'))) ||
                           (category === '皮肤' && (item.name.includes('湿疹') || item.name.includes('痤疮')));
                case 'diet':
                    // 药膳筛选：检查功能、适用人群或名称是否包含分类关键词
                    return item.function.includes(category) || 
                           item.name.includes(category) ||
                           (item.suitable && item.suitable.includes(category));
                default:
                    return true;
            }
        });
    }
    
    // 显示筛选结果
    switch(type) {
        case 'herb':
            displayHerbResults(filteredResults);
            break;
        case 'formula':
            displayFormulaResults(filteredResults);
            break;
        case 'disease':
            displayDiseaseResults(filteredResults);
            break;
        case 'diet':
            displayDietResults(filteredResults);
            break;
    }
    
    // 显示筛选结果提示
    showMessage(`已筛选${category}类${type === 'herb' ? '药材' : type === 'formula' ? '药方' : type === 'disease' ? '疾病' : '药膳'}，共${filteredResults.length}个结果`, 'success');
}

// 获取搜索类型（简单实现，因为我们移除了搜索类型选择器）
function getSearchType() {
    // 默认搜索全部，或者根据当前激活的标签页确定搜索类型
    const activeTab = document.querySelector('.tab-btn.active');
    return activeTab ? activeTab.getAttribute('data-tab') : 'all';
}

// 从后端API获取的实际数据
let knowledgeData = {
    herb_to_formulas: {},
    formula_to_herbs: {},
    herb_functions: {},
    formula_functions: {},
    disease_to_formulas: {},
    herb_to_img_info: {},
    diet_recipes: {} // 新增药膳数据结构
};
// 示例药膳数据
const sampleDietRecipes = [
    {
        name: '当归生姜羊肉汤',
        function: '温中补虚，散寒止痛',
        suitable: '虚寒腹痛、产后血虚、阳虚体质者、冬季手脚冰凉、痛经女性',
        ingredients: ['羊肉', '当归', '生姜', '大葱', '料酒', '盐'],
        method: '1. 羊肉洗净切块焯水；当归洗净切片；生姜洗净切片。2. 将当归、生姜、羊肉放入砂锅中，加适量清水。3. 大火煮沸后转小火炖1.5小时。4. 加入大葱、料酒、盐调味，再炖10分钟即可。'
    },
    {
        name: '黄芪炖鸡汤',
        function: '补气养血，健脾益胃',
        suitable: '气血两虚、脾胃虚弱、免疫力低下者',
        ingredients: ['黄芪', '鸡肉', '红枣', '枸杞', '生姜', '盐'],
        method: '1. 黄芪洗净；鸡肉洗净切块焯水；红枣、枸杞洗净。2. 将所有材料放入炖盅，加适量清水。3. 隔水炖2小时，加盐调味即可。'
    },
    {
        name: '百合莲子粥',
        function: '滋阴润肺，养心安神',
        suitable: '肺燥咳嗽、失眠多梦、心烦不安者',
        ingredients: ['百合', '莲子', '大米', '冰糖'],
        method: '1. 百合、莲子洗净浸泡2小时；大米洗净。2. 将所有材料放入锅中，加适量清水。3. 大火煮沸后转小火煮40分钟，加冰糖调味即可。'
    },
    {
        name: '陈皮粥',
        function: '理气健脾，燥湿化痰',
        suitable: '脾胃气滞、痰湿咳嗽者',
        ingredients: ['陈皮', '大米'],
        method: '1. 陈皮洗净切丝；大米洗净。2. 将陈皮丝放入锅中，加适量清水煮15分钟，去渣留汁。3. 加入大米煮成粥即可。'
    },
    {
        name: '银耳雪梨汤',
        function: '滋阴润肺，清热生津',
        suitable: '肺热咳嗽、咽喉干燥、便秘者',
        ingredients: ['银耳', '雪梨', '冰糖', '枸杞'],
        method: '1. 银耳泡发撕小朵；雪梨去皮去核切块。2. 将银耳、雪梨放入锅中，加适量清水。3. 大火煮沸后转小火炖1小时，加冰糖、枸杞再炖10分钟即可。'
    },
    {
        name: '桂圆红枣茶',
        function: '补心脾，益气血',
        suitable: '心脾两虚、气血不足、失眠健忘者',
        ingredients: ['桂圆肉', '红枣', '红糖'],
        method: '1. 桂圆肉、红枣洗净。2. 将材料放入锅中，加适量清水煮20分钟。3. 加红糖调味即可。'
    },
    {
        name: '四君子汤',
        function: '益气健脾',
        suitable: '气虚乏力、面色萎黄者',
        ingredients: ['党参', '白术', '茯苓', '炙甘草', '鸡肉'],
        method: '1. 党参、白术、茯苓、炙甘草洗净；鸡肉洗净切块焯水。2. 将所有材料放入砂锅中，加适量清水。3. 大火煮沸后转小火炖1.5小时，加盐调味即可。'
    },
    {
        name: '四神汤',
        function: '健脾养胃，固涩止泻',
        suitable: '脾虚腹泻、食欲不振者',
        ingredients: ['茯苓', '莲子', '芡实', '山药'],
        method: '1. 茯苓、莲子、芡实、山药洗净。2. 将所有材料放入砂锅中，加适量清水。3. 大火煮沸后转小火炖1.5小时，可根据个人口味加适量冰糖调味。'
    },
    {
        name: '绿豆丝瓜花汤',
        function: '消暑解毒',
        suitable: '夏季暑热、痱子瘙痒',
        ingredients: ['绿豆', '鲜丝瓜花'],
        method: '1. 绿豆洗净，加适量清水煮至绿豆开花。2. 加入鲜丝瓜花煮2-3分钟即可。3. 可根据个人口味加适量冰糖调味。'
    },
    {
        name: '参芪鹌鹑汤',
        function: '补气固表，增强免疫力',
        suitable: '气虚体质、易疲劳、易感冒者',
        ingredients: ['党参', '黄芪', '鹌鹑'],
        method: '1. 党参、黄芪洗净；鹌鹑洗净切块焯水。2. 将所有材料放入炖盅，加适量清水。3. 隔水炖1.5小时，加盐调味即可。'
    },
    {
        name: '石斛玉竹老鸭汤',
        function: '滋阴清热，生津止渴',
        suitable: '阴虚体质、口干舌燥、潮热盗汗、糖尿病患者及阴虚火旺者',
        ingredients: ['石斛', '玉竹', '老鸭'],
        method: '1. 石斛、玉竹洗净；老鸭洗净切块焯水。2. 将所有材料放入砂锅中，加适量清水。3. 大火煮沸后转小火炖2小时，加盐调味即可。'
    },
    {
        name: '陈皮荷叶茶',
        function: '化痰祛湿，减肥降脂',
        suitable: '痰湿体质、体型肥胖、痰多者',
        ingredients: ['陈皮', '荷叶'],
        method: '1. 陈皮、荷叶洗净。2. 将材料放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '荠菜猪肝汤',
        function: '养肝明目',
        suitable: '春季养肝、改善春困',
        ingredients: ['荠菜', '猪肝'],
        method: '1. 荠菜洗净；猪肝洗净切片，用料酒、盐腌制10分钟。2. 锅中加水煮沸，放入猪肝煮熟。3. 加入荠菜煮2-3分钟，加盐调味即可。'
    },
    {
        name: '四花茶',
        function: '疏肝理气',
        suitable: '春季疏肝解郁',
        ingredients: ['白梅花', '月季花', '玫瑰花', '野菊花'],
        method: '1. 四种花洗净。2. 将材料放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '绿豆百合汤',
        function: '清热解毒，消暑',
        suitable: '夏季暑热',
        ingredients: ['绿豆', '百合', '冰糖'],
        method: '1. 绿豆洗净，加适量清水煮至绿豆开花。2. 加入百合煮10分钟。3. 加冰糖调味即可。'
    },
    {
        name: '木棉花薏苡仁陈皮排骨汤',
        function: '清热化湿',
        suitable: '夏季湿热、南方梅雨季节',
        ingredients: ['木棉花', '薏苡仁', '陈皮', '排骨'],
        method: '1. 木棉花、薏苡仁、陈皮洗净；排骨洗净切块焯水。2. 将所有材料放入砂锅中，加适量清水。3. 大火煮沸后转小火炖2小时，加盐调味即可。'
    },
    {
        name: '川贝雪梨炖猪肺',
        function: '滋阴润肺，止咳化痰',
        suitable: '秋燥干咳、咳嗽痰多者',
        ingredients: ['川贝', '雪梨', '猪肺'],
        method: '1. 川贝洗净；雪梨去皮去核切块；猪肺洗净切块焯水。2. 将所有材料放入炖盅，加适量清水。3. 隔水炖2小时，加盐调味即可。'
    },
    {
        name: '黄芪牛肉汤',
        function: '补气养血，增强抵抗力',
        suitable: '冬季进补、气血不足者',
        ingredients: ['黄芪', '牛肉', '生姜', '盐'],
        method: '1. 黄芪洗净；牛肉洗净切块焯水；生姜洗净切片。2. 将所有材料放入砂锅中，加适量清水。3. 大火煮沸后转小火炖2小时，加盐调味即可。'
    },
    {
        name: '红枣桂圆茶',
        function: '健脾养心，改善睡眠',
        suitable: '气血不足、失眠者',
        ingredients: ['红枣', '桂圆', '枸杞'],
        method: '1. 红枣、桂圆、枸杞洗净。2. 将材料放入锅中，加适量清水煮沸后转小火煮15分钟。3. 代茶饮。'
    },
    {
        name: '山药薏米粥',
        function: '健脾益胃，祛湿止泻',
        suitable: '脾胃虚弱、食欲不振、痰湿体质者',
        ingredients: ['山药', '薏米', '大米'],
        method: '1. 薏米先浸泡2小时；大米洗净；山药洗净切块。2. 薏米与大米同煮，八成熟时加入山药。3. 煮至粥熟即可。'
    },
    {
        name: '酸枣仁粥',
        function: '养心安神，滋阴敛汗',
        suitable: '失眠多梦、心悸怔忡、自汗盗汗者',
        ingredients: ['酸枣仁', '大米', '冰糖'],
        method: '1. 酸枣仁洗净，捣成碎末。2. 大米洗净，与酸枣仁末一起放入锅中，加适量清水。3. 大火煮沸后转小火煮30分钟，加冰糖调味即可。'
    },
    {
        name: '菊花枸杞茶',
        function: '清肝明目，滋阴补肾',
        suitable: '眼睛干涩、视力模糊、肝肾阴虚者',
        ingredients: ['菊花', '枸杞', '决明子'],
        method: '1. 菊花、枸杞、决明子洗净。2. 将材料放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '玫瑰花茶',
        function: '疏肝解郁，活血化瘀',
        suitable: '肝郁气滞、月经不调、痛经者',
        ingredients: ['玫瑰花', '红枣', '枸杞'],
        method: '1. 玫瑰花、红枣、枸杞洗净。2. 将材料放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '生姜红糖水',
        function: '温中散寒，和胃止呕',
        suitable: '风寒感冒、胃寒呕吐、痛经者',
        ingredients: ['生姜', '红糖'],
        method: '1. 生姜洗净切片。2. 将生姜放入锅中，加适量清水煮沸。3. 加入红糖搅拌至溶化，再煮5分钟即可。'
    },
    {
        name: '蜂蜜柠檬水',
        function: '美白养颜，润肠通便',
        suitable: '皮肤干燥、便秘、美容养颜者',
        ingredients: ['柠檬', '蜂蜜', '温水'],
        method: '1. 柠檬洗净切片。2. 将柠檬片放入杯中，加入温水。3. 待水温降至60℃以下时，加入蜂蜜搅拌均匀即可。'
    },
    {
        name: '黑芝麻糊',
        function: '补肾益精，乌发养颜',
        suitable: '肾虚脱发、头发早白、便秘者',
        ingredients: ['黑芝麻', '糯米粉', '冰糖'],
        method: '1. 黑芝麻洗净，小火炒熟。2. 糯米粉小火炒至微黄。3. 将黑芝麻和糯米粉混合，用搅拌机打成粉末。4. 取适量粉末，加入热水调成糊状，加冰糖调味即可。'
    },
    {
        name: '核桃粥',
        function: '补肾益智，润肠通便',
        suitable: '肾虚腰痛、记忆力减退、便秘者',
        ingredients: ['核桃', '大米', '红枣', '冰糖'],
        method: '1. 核桃去壳，取仁捣碎；大米洗净；红枣洗净去核。2. 将所有材料放入锅中，加适量清水。3. 大火煮沸后转小火煮30分钟，加冰糖调味即可。'
    },
    {
        name: '莲子羹',
        function: '养心安神，健脾止泻',
        suitable: '心悸失眠、脾虚泄泻者',
        ingredients: ['莲子', '银耳', '百合', '冰糖'],
        method: '1. 莲子、银耳、百合洗净浸泡2小时。2. 将所有材料放入锅中，加适量清水。3. 大火煮沸后转小火炖1小时，加冰糖调味即可。'
    },
    {
        name: '鸡汤面',
        function: '补气养血，健脾开胃',
        suitable: '气血不足、脾胃虚弱、术后恢复者',
        ingredients: ['鸡肉', '面条', '青菜', '生姜', '盐', '料酒'],
        method: '1. 鸡肉洗净切块焯水；生姜洗净切片。2. 将鸡肉、生姜放入锅中，加适量清水和料酒，大火煮沸后转小火炖1小时。3. 另起锅煮面条，煮至八成熟时加入青菜。4. 将面条和青菜捞出，加入鸡汤，加盐调味即可。'
    },
    {
        name: '鲫鱼豆腐汤',
        function: '健脾利湿，通乳下奶',
        suitable: '脾胃虚弱、产后缺乳者',
        ingredients: ['鲫鱼', '豆腐', '生姜', '大葱', '盐', '料酒'],
        method: '1. 鲫鱼洗净，两面煎至金黄；豆腐切块；生姜洗净切片；大葱洗净切段。2. 将煎好的鲫鱼、生姜、大葱放入砂锅中，加适量清水和料酒。3. 大火煮沸后转小火炖30分钟，加入豆腐再炖15分钟，加盐调味即可。'
    },
    {
        name: '冬瓜排骨汤',
        function: '清热利湿，消肿减肥',
        suitable: '水肿、肥胖、高血压者',
        ingredients: ['排骨', '冬瓜', '生姜', '盐'],
        method: '1. 排骨洗净切块焯水；冬瓜去皮切块；生姜洗净切片。2. 将排骨、生姜放入砂锅中，加适量清水。3. 大火煮沸后转小火炖1小时，加入冬瓜再炖30分钟，加盐调味即可。'
    },
    {
        name: '菠菜猪肝汤',
        function: '补血明目，润燥滑肠',
        suitable: '缺铁性贫血、视力模糊、便秘者',
        ingredients: ['菠菜', '猪肝', '生姜', '盐', '料酒'],
        method: '1. 菠菜洗净焯水；猪肝洗净切片，用料酒、盐腌制10分钟；生姜洗净切片。2. 锅中加水煮沸，放入生姜和猪肝。3. 猪肝煮熟后加入菠菜，再煮2分钟，加盐调味即可。'
    },
    {
        name: '胡萝卜炖羊肉',
        function: '温中补虚，益气养血',
        suitable: '虚寒体质、气血不足、冬季进补者',
        ingredients: ['羊肉', '胡萝卜', '生姜', '大葱', '盐', '料酒'],
        method: '1. 羊肉洗净切块焯水；胡萝卜洗净切块；生姜洗净切片；大葱洗净切段。2. 将羊肉、生姜、大葱放入砂锅中，加适量清水和料酒。3. 大火煮沸后转小火炖1小时，加入胡萝卜再炖30分钟，加盐调味即可。'
    },
    {
        name: '银耳莲子百合羹',
        function: '滋阴润肺，养心安神',
        suitable: '肺燥咳嗽、失眠多梦、心烦不安者',
        ingredients: ['银耳', '莲子', '百合', '冰糖'],
        method: '1. 银耳、莲子、百合洗净浸泡2小时。2. 将所有材料放入锅中，加适量清水。3. 大火煮沸后转小火炖1.5小时，加冰糖调味即可。'
    },
    {
        name: '山药炖排骨',
        function: '健脾益胃，补肾养血',
        suitable: '脾胃虚弱、肾虚腰痛、气血不足者',
        ingredients: ['排骨', '山药', '生姜', '盐'],
        method: '1. 排骨洗净切块焯水；山药洗净切块；生姜洗净切片。2. 将排骨、生姜放入砂锅中，加适量清水。3. 大火煮沸后转小火炖1小时，加入山药再炖30分钟，加盐调味即可。'
    },
    {
        name: '红枣莲子粥',
        function: '补气养血，健脾养心',
        suitable: '气血不足、心悸失眠、脾胃虚弱者',
        ingredients: ['红枣', '莲子', '大米', '冰糖'],
        method: '1. 红枣洗净去核；莲子洗净浸泡2小时；大米洗净。2. 将所有材料放入锅中，加适量清水。3. 大火煮沸后转小火煮30分钟，加冰糖调味即可。'
    },
    {
        name: '桂圆莲子汤',
        function: '补心脾，益气血',
        suitable: '心脾两虚、气血不足、失眠健忘者',
        ingredients: ['桂圆肉', '莲子', '红枣', '冰糖'],
        method: '1. 莲子洗净浸泡2小时；红枣洗净去核。2. 将莲子、红枣放入锅中，加适量清水。3. 大火煮沸后转小火炖1小时，加入桂圆肉和冰糖再炖30分钟即可。'
    },
    {
        name: '枸杞菊花茶',
        function: '清肝明目，滋阴补肾',
        suitable: '眼睛干涩、视力模糊、肝肾阴虚者',
        ingredients: ['枸杞', '菊花'],
        method: '1. 枸杞、菊花洗净。2. 将材料放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '桂花茶',
        function: '温中散寒，暖胃止痛',
        suitable: '胃寒疼痛、消化不良者',
        ingredients: ['桂花', '红茶', '冰糖'],
        method: '1. 桂花、红茶洗净。2. 将材料放入茶壶中，用沸水冲泡。3. 焖5分钟后，加冰糖调味即可。'
    },
    {
        name: '茉莉花茶',
        function: '理气解郁，辟秽和中',
        suitable: '肝郁气滞、脾胃不和者',
        ingredients: ['茉莉花', '绿茶'],
        method: '1. 茉莉花、绿茶洗净。2. 将材料放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '柠檬蜂蜜茶',
        function: '美白养颜，润肠通便',
        suitable: '皮肤干燥、便秘、美容养颜者',
        ingredients: ['柠檬', '蜂蜜', '温水'],
        method: '1. 柠檬洗净切片。2. 将柠檬片放入杯中，加入温水。3. 待水温降至60℃以下时，加入蜂蜜搅拌均匀即可。'
    },
    {
        name: '薄荷茶',
        function: '疏散风热，清利头目',
        suitable: '风热感冒、头痛目赤者',
        ingredients: ['薄荷', '绿茶'],
        method: '1. 薄荷、绿茶洗净。2. 将材料放入茶壶中，用沸水冲泡。3. 焖3分钟后即可饮用。'
    },
    {
        name: '山楂茶',
        function: '消食化积，活血化瘀',
        suitable: '食积停滞、瘀血经闭者',
        ingredients: ['山楂', '冰糖'],
        method: '1. 山楂洗净。2. 将山楂放入锅中，加适量清水煮沸。3. 转小火煮15分钟，加冰糖调味即可。'
    },
    {
        name: '决明子茶',
        function: '清肝明目，润肠通便',
        suitable: '目赤肿痛、便秘者',
        ingredients: ['决明子'],
        method: '1. 决明子洗净。2. 将决明子放入茶壶中，用沸水冲泡。3. 焖10分钟后即可饮用。'
    },
    {
        name: '荷叶茶',
        function: '清热利湿，减肥降脂',
        suitable: '肥胖、高血脂、夏季暑热者',
        ingredients: ['荷叶'],
        method: '1. 荷叶洗净。2. 将荷叶放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '玉米须茶',
        function: '利尿消肿，平肝利胆',
        suitable: '水肿、高血压、胆囊炎者',
        ingredients: ['玉米须'],
        method: '1. 玉米须洗净。2. 将玉米须放入茶壶中，用沸水冲泡。3. 焖10分钟后即可饮用。'
    },
    {
        name: '蒲公英茶',
        function: '清热解毒，消肿散结',
        suitable: '疮疡肿毒、乳腺炎、咽喉肿痛者',
        ingredients: ['蒲公英'],
        method: '1. 蒲公英洗净。2. 将蒲公英放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '金银花茶',
        function: '清热解毒，疏散风热',
        suitable: '风热感冒、咽喉肿痛、疮疡肿毒者',
        ingredients: ['金银花'],
        method: '1. 金银花洗净。2. 将金银花放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '菊花茶',
        function: '清肝明目，清热解毒',
        suitable: '目赤肿痛、头痛眩晕、风热感冒者',
        ingredients: ['菊花'],
        method: '1. 菊花洗净。2. 将菊花放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '枸杞茶',
        function: '补肾益精，养肝明目',
        suitable: '肝肾阴虚、视力模糊、腰膝酸软者',
        ingredients: ['枸杞'],
        method: '1. 枸杞洗净。2. 将枸杞放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '红枣茶',
        function: '补气养血，健脾养胃',
        suitable: '气血不足、脾胃虚弱、失眠健忘者',
        ingredients: ['红枣'],
        method: '1. 红枣洗净去核。2. 将红枣放入茶壶中，用沸水冲泡。3. 焖10分钟后即可饮用。'
    },
    {
        name: '甘草茶',
        function: '清热解毒，祛痰止咳',
        suitable: '咽喉肿痛、咳嗽痰多者',
        ingredients: ['甘草'],
        method: '1. 甘草洗净切片。2. 将甘草放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '麦冬茶',
        function: '滋阴润肺，清心除烦',
        suitable: '肺燥干咳、心烦失眠、口渴咽干者',
        ingredients: ['麦冬'],
        method: '1. 麦冬洗净。2. 将麦冬放入茶壶中，用沸水冲泡。3. 焖10分钟后即可饮用。'
    },
    {
        name: '玉竹茶',
        function: '养阴润燥，生津止渴',
        suitable: '肺胃阴虚、燥热咳嗽、口渴咽干者',
        ingredients: ['玉竹'],
        method: '1. 玉竹洗净切片。2. 将玉竹放入茶壶中，用沸水冲泡。3. 焖10分钟后即可饮用。'
    },
    {
        name: '沙参茶',
        function: '养阴清肺，益胃生津',
        suitable: '肺热燥咳、胃阴不足、口渴咽干者',
        ingredients: ['沙参'],
        method: '1. 沙参洗净切片。2. 将沙参放入茶壶中，用沸水冲泡。3. 焖10分钟后即可饮用。'
    },
    {
        name: '百合茶',
        function: '养阴润肺，清心安神',
        suitable: '阴虚燥咳、失眠多梦、精神恍惚者',
        ingredients: ['百合'],
        method: '1. 百合洗净。2. 将百合放入茶壶中，用沸水冲泡。3. 焖10分钟后即可饮用。'
    },
    {
        name: '莲子心茶',
        function: '清心安神，交通心肾',
        suitable: '心火亢盛、失眠多梦、心悸怔忡者',
        ingredients: ['莲子心'],
        method: '1. 莲子心洗净。2. 将莲子心放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '竹叶茶',
        function: '清热除烦，生津利尿',
        suitable: '热病烦渴、口舌生疮、小便短赤者',
        ingredients: ['竹叶'],
        method: '1. 竹叶洗净。2. 将竹叶放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '薄荷菊花茶',
        function: '疏散风热，清利头目',
        suitable: '风热感冒、头痛目赤、咽喉肿痛者',
        ingredients: ['薄荷', '菊花'],
        method: '1. 薄荷、菊花洗净。2. 将材料放入茶壶中，用沸水冲泡。3. 焖3分钟后即可饮用。'
    },
    {
        name: '金银花菊花茶',
        function: '清热解毒，疏散风热',
        suitable: '风热感冒、咽喉肿痛、疮疡肿毒者',
        ingredients: ['金银花', '菊花'],
        method: '1. 金银花、菊花洗净。2. 将材料放入茶壶中，用沸水冲泡。3. 焖5分钟后即可饮用。'
    },
    {
        name: '枸杞红枣茶',
        function: '补气养血，补肾益精',
        suitable: '气血不足、肝肾阴虚、失眠健忘者',
        ingredients: ['枸杞', '红枣'],
        method: '1. 枸杞、红枣洗净，红枣去核。2. 将材料放入茶壶中，用沸水冲泡。3. 焖10分钟后即可饮用。'
    },
    {
        name: '麦冬玉竹茶',
        function: '滋阴润肺，生津止渴',
        suitable: '肺胃阴虚、燥热咳嗽、口渴咽干者',
        ingredients: ['麦冬', '玉竹'],
        method: '1. 麦冬、玉竹洗净切片。2. 将材料放入茶壶中，用沸水冲泡。3. 焖10分钟后即可饮用。'
    },
    {
        name: '沙参麦冬茶',
        function: '养阴清肺，益胃生津',
        suitable: '肺热燥咳、胃阴不足、口渴咽干者',
        ingredients: ['沙参', '麦冬'],
        method: '1. 沙参、麦冬洗净切片。2. 将材料放入茶壶中，用沸水冲泡。3. 焖10分钟后即可饮用。'
    },
    {
        name: '百合莲子茶',
        function: '养阴润肺，清心安神',
        suitable: '阴虚燥咳、失眠多梦、精神恍惚者',
        ingredients: ['百合', '莲子'],
        method: '1. 百合、莲子洗净。2. 将材料放入茶壶中，用沸水冲泡。3. 焖10分钟后即可饮用。'
    },
    {
        name: '银耳红枣汤',
        function: '滋阴润肺，补气养血',
        suitable: '肺燥咳嗽、气血不足、面色苍白者',
        ingredients: ['银耳', '红枣', '冰糖'],
        method: '1. 银耳泡发撕小朵；红枣洗净去核。2. 将银耳、红枣放入锅中，加适量清水。3. 大火煮沸后转小火炖1小时，加冰糖调味即可。'
    },
    {
        name: '百合银耳汤',
        function: '养阴润肺，清心安神',
        suitable: '肺燥咳嗽、失眠多梦、心烦不安者',
        ingredients: ['百合', '银耳', '冰糖'],
        method: '1. 百合、银耳洗净浸泡2小时。2. 将材料放入锅中，加适量清水。3. 大火煮沸后转小火炖1小时，加冰糖调味即可。'
    },
    {
        name: '红枣莲子汤',
        function: '补气养血，健脾养心',
        suitable: '气血不足、心悸失眠、脾胃虚弱者',
        ingredients: ['红枣', '莲子', '冰糖'],
        method: '1. 红枣洗净去核；莲子洗净浸泡2小时。2. 将材料放入锅中，加适量清水。3. 大火煮沸后转小火炖1小时，加冰糖调味即可。'
    },
    {
        name: '桂圆红枣汤',
        function: '补心脾，益气血',
        suitable: '心脾两虚、气血不足、失眠健忘者',
        ingredients: ['桂圆肉', '红枣', '冰糖'],
        method: '1. 桂圆肉、红枣洗净，红枣去核。2. 将材料放入锅中，加适量清水。3. 大火煮沸后转小火炖1小时，加冰糖调味即可。'
    },
    {
        name: '枸杞银耳汤',
        function: '滋阴润肺，补肾益精',
        suitable: '肺燥咳嗽、肝肾阴虚、视力模糊者',
        ingredients: ['枸杞', '银耳', '冰糖'],
        method: '1. 枸杞洗净；银耳泡发撕小朵。2. 将材料放入锅中，加适量清水。3. 大火煮沸后转小火炖1小时，加冰糖调味即可。'
    },
    {
        name: '莲子银耳汤',
        function: '养心安神，健脾止泻',
        suitable: '心悸失眠、脾虚泄泻者',
        ingredients: ['莲子', '银耳', '冰糖'],
        method: '1. 莲子、银耳洗净浸泡2小时。2. 将材料放入锅中，加适量清水。3. 大火煮沸后转小火炖1小时，加冰糖调味即可。'
    },
    {
        name: '山药粥',
        function: '健脾益胃，补肾益精',
        suitable: '脾胃虚弱、肾虚腰痛、糖尿病患者',
        ingredients: ['山药', '大米'],
        method: '1. 山药洗净切块；大米洗净。2. 将材料放入锅中，加适量清水。3. 大火煮沸后转小火煮30分钟即可。'
    },
    {
        name: '南瓜粥',
        function: '补中益气，健脾养胃',
        suitable: '脾胃虚弱、糖尿病患者、便秘者',
        ingredients: ['南瓜', '大米'],
        method: '1. 南瓜洗净去皮切块；大米洗净。2. 将材料放入锅中，加适量清水。3. 大火煮沸后转小火煮30分钟即可。'
    },
    {
        name: '小米粥',
        function: '健脾养胃，滋阴养血',
        suitable: '脾胃虚弱、产后血虚、失眠健忘者',
        ingredients: ['小米'],
        method: '1. 小米洗净。2. 将小米放入锅中，加适量清水。3. 大火煮沸后转小火煮30分钟即可。'
    },
    {
        name: '玉米粥',
        function: '健脾养胃，利尿消肿',
        suitable: '脾胃虚弱、水肿、高血压者',
        ingredients: ['玉米粉', '大米'],
        method: '1. 大米洗净；玉米粉用冷水调成糊状。2. 将大米放入锅中，加适量清水煮沸。3. 慢慢倒入玉米糊，边倒边搅拌。4. 转小火煮20分钟即可。'
    },
    {
        name: '红豆粥',
        function: '健脾利湿，清热解毒',
        suitable: '水肿、湿热黄疸、便秘者',
        ingredients: ['红豆', '大米'],
        method: '1. 红豆洗净浸泡4小时；大米洗净。2. 将材料放入锅中，加适量清水。3. 大火煮沸后转小火煮1小时即可。'
    },
    {
        name: '绿豆粥',
        function: '清热解毒，消暑利尿',
        suitable: '夏季暑热、热毒疮疡、便秘者',
        ingredients: ['绿豆', '大米'],
        method: '1. 绿豆洗净浸泡4小时；大米洗净。2. 将材料放入锅中，加适量清水。3. 大火煮沸后转小火煮1小时即可。'
    },
    {
        name: '黑豆粥',
        function: '补肾益精，健脾利湿',
        suitable: '肾虚腰痛、水肿、须发早白者',
        ingredients: ['黑豆', '大米'],
        method: '1. 黑豆洗净浸泡4小时；大米洗净。2. 将材料放入锅中，加适量清水。3. 大火煮沸后转小火煮1小时即可。'
    },
    {
        name: '薏米粥',
        function: '健脾利湿，清热排脓',
        suitable: '脾虚泄泻、水肿、湿热黄疸者',
        ingredients: ['薏米', '大米'],
        method: '1. 薏米洗净浸泡4小时；大米洗净。2. 将材料放入锅中，加适量清水。3. 大火煮沸后转小火煮1小时即可。'
    },
    {
        name: '八宝粥',
        function: '补气养血，健脾养胃',
        suitable: '气血不足、脾胃虚弱、营养不良者',
        ingredients: ['大米', '糯米', '红豆', '绿豆', '黑豆', '薏米', '红枣', '桂圆肉', '枸杞', '莲子', '冰糖'],
        method: '1. 各种豆类洗净浸泡4小时；大米、糯米洗净；红枣去核；桂圆肉、枸杞、莲子洗净。2. 将所有材料放入锅中，加适量清水。3. 大火煮沸后转小火煮2小时，加冰糖调味即可。'
    }
];
// 获取知识库数据
async function loadKnowledgeData() {
    try {
        const response = await fetch('/api/knowledge_base_data');
        const result = await response.json();
        if (result.success) {
            knowledgeData = result.data;
            console.log('知识库数据加载成功');
            } else {
            console.log('使用默认数据');
        }
        // 添加示例药膳数据
        knowledgeData.diet_recipes = sampleDietRecipes;
        return true;
    } catch (error) {
        console.error('加载知识库数据失败:', error);
        // 加载失败时使用示例数据
        knowledgeData.diet_recipes = sampleDietRecipes;
        return false;
    }
}

// 预处理数据，将对象转换为数组格式，便于搜索和展示
function getHerbsList() {
    return Object.keys(knowledgeData.herb_to_formulas)
        .map(herbName => ({
            name: herbName,
            function: knowledgeData.herb_functions[herbName] || '暂无功能描述',
            formulas: knowledgeData.herb_to_formulas[herbName] || [],
            hasImage: knowledgeData.herb_to_img_info[herbName] && knowledgeData.herb_to_img_info[herbName].files && knowledgeData.herb_to_img_info[herbName].files.length > 0
        }))
        .sort((a, b) => {
            // 有图片的排在前面
            if (a.hasImage && !b.hasImage) return -1;
            if (!a.hasImage && b.hasImage) return 1;
            // 都有图片或都没有图片时按名称排序
            return a.name.localeCompare(b.name);
        });
}

function getFormulasList() {
    return Object.keys(knowledgeData.formula_to_herbs).map(formulaName => ({
        name: formulaName,
        function: knowledgeData.formula_functions[formulaName] || '暂无功能描述',
        herbs: knowledgeData.formula_to_herbs[formulaName] || []
    }));
}

function getDiseasesList() {
    return Object.keys(knowledgeData.disease_to_formulas).map(diseaseName => ({
        name: diseaseName,
        formulas: knowledgeData.disease_to_formulas[diseaseName] || []
    }));
}
// 获取药膳列表
function getDietsList() {
    return knowledgeData.diet_recipes || [];
}
// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', async () => {
    // 加载知识库数据
    await loadKnowledgeData();
    
    // 初始化导航栏
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        const tabType = activeTab.getAttribute('data-tab');
        generateNavigation(tabType);
    }
    
    // 生成字母索引
    generateAlphabetIndex();
    
    // 绑定事件监听
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // 标签页切换
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchTab(tab);
            // 更新左侧导航栏
            generateNavigation(tab);
        });
    });

    // 关闭模态框
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            herbModal.style.display = 'none';
            formulaModal.style.display = 'none';
            diseaseModal.style.display = 'none';
            dietModal.style.display = 'none';
        });
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === herbModal) herbModal.style.display = 'none';
        if (e.target === formulaModal) formulaModal.style.display = 'none';
        if (e.target === diseaseModal) diseaseModal.style.display = 'none';
        if (e.target === dietModal) dietModal.style.display = 'none';
    });
    
    // 根据URL参数设置标签页
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam && tabParam === 'formula') {
        // 如果URL参数指定了药方库标签页，直接加载药方列表
        switchTab('formula', false);
        loadFormulasList();
        // 更新左侧导航栏
        generateNavigation('formula');
    } else {
        // 默认显示药材库的所有数据
        loadHerbsList();
        // 更新左侧导航栏
        generateNavigation('herb');
    }
});

// 执行搜索
function performSearch() {
    const keyword = searchInput.value.trim();
    if (!keyword) return;

    const type = getSearchType();
    
    // 获取数据列表
    const herbs = getHerbsList();
    const formulas = getFormulasList();
    const diseases = getDiseasesList();
    const diets = getDietsList();

    // 根据选择的类型进行搜索
    switch (type) {
        case 'herb':
            // 在药材名称和功能描述中搜索
            const herbResults = herbs.filter(herb => 
                herb.name.includes(keyword) || herb.function.includes(keyword)
            );
            displayHerbResults(herbResults);
            switchTab('herb', false);
            break;
        case 'formula':
            // 在药方名称和功能描述中搜索
            const formulaResults = formulas.filter(formula => 
                formula.name.includes(keyword) || formula.function.includes(keyword)
            );
            displayFormulaResults(formulaResults);
            switchTab('formula', false);
            break;
        case 'disease':
            // 在疾病名称中搜索
            const diseaseResults = diseases.filter(disease => disease.name.includes(keyword));
            displayDiseaseResults(diseaseResults);
            switchTab('disease', false);
            break;
        case 'diet':
            // 在药膳名称和功能描述中搜索
            const dietResults = diets.filter(diet => 
                diet.name.includes(keyword) || diet.function.includes(keyword) || diet.suitable.includes(keyword)
            );
            displayDietResults(dietResults);
            switchTab('diet', false);
            break;
        case 'all':
            // 全部搜索需要在不同标签页显示结果
            const allHerbResults = herbs.filter(herb => 
                herb.name.includes(keyword) || herb.function.includes(keyword)
            );
            const allFormulaResults = formulas.filter(formula => 
                formula.name.includes(keyword) || formula.function.includes(keyword)
            );
            const allDiseaseResults = diseases.filter(disease => disease.name.includes(keyword));
            const allDietResults = diets.filter(diet => 
                diet.name.includes(keyword) || diet.function.includes(keyword) || diet.suitable.includes(keyword)
            );

            displayHerbResults(allHerbResults);
            displayFormulaResults(allFormulaResults);
            displayDiseaseResults(allDiseaseResults);
            displayDietResults(allDietResults);

            // 自动切换到有结果的第一个标签页
            if (allHerbResults.length > 0) {
                switchTab('herb', false);
            } else if (allFormulaResults.length > 0) {
                switchTab('formula', false);
            } else if (allDiseaseResults.length > 0) {
                switchTab('disease', false);
            } else if (allDietResults.length > 0) {
                switchTab('diet', false);
            } else {
                // 无结果
                showNoResults();
            }
            break;
    }
}

// 切换标签页
function switchTab(tab, executeSearch = true) {
    // 移除所有标签和结果的激活状态
    tabBtns.forEach(btn => btn.classList.remove('active'));
    resultTabs.forEach(t => t.classList.remove('active'));

    // 激活选中的标签和结果
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`result-${tab}`).classList.add('active');
    
    const keyword = searchInput.value.trim();
    if (executeSearch && keyword) {
        // 如果搜索框有内容且允许执行搜索，则执行搜索以显示当前标签页的搜索结果
        performSearch();
    } else if (!keyword) {
        // 如果搜索框为空，则加载当前标签页的所有数据
        switch(tab) {
            case 'herb':
                loadHerbsList();
                break;
            case 'formula':
                loadFormulasList();
                break;
            case 'disease':
                loadDiseasesList();
                break;
            case 'diet':
                loadDietsList();
                break;
        }
    }
    // 否则保持当前显示内容
}

// 显示药材搜索结果
function displayHerbResults(results) {
    const resultContainer = document.getElementById('result-herb');
    
    if (results.length === 0) {
        resultContainer.innerHTML = `
            <div class="no-results">
                <p>未找到相关药材</p>
                <button onclick="clearSearch()">清除搜索</button>
            </div>
        `;
        return;
    }

    let html = '<div class="result-list">';
    results.forEach(herb => {
        html += `
            <div class="result-item" onclick="showHerbDetail('${herb.name}')">
                <h4>${herb.name}</h4>
                <p>${herb.function.substring(0, 50)}${herb.function.length > 50 ? '...' : ''}</p>
            </div>
        `;
    });
    html += '</div>';
    
    resultContainer.innerHTML = html;
}

// 显示药方搜索结果
function displayFormulaResults(results) {
    const resultContainer = document.getElementById('result-formula');
    
    if (results.length === 0) {
        resultContainer.innerHTML = `
            <div class="no-results">
                <p>未找到相关药方</p>
                <button onclick="clearSearch()">清除搜索</button>
            </div>
        `;
        return;
    }

    let html = '<div class="result-list">';
    results.forEach(formula => {
        html += `
            <div class="result-item" onclick="showFormulaDetail('${formula.name}')">
                <h4>${formula.name}</h4>
                <p>${formula.function.substring(0, 50)}${formula.function.length > 50 ? '...' : ''}</p>
            </div>
        `;
    });
    html += '</div>';
    
    resultContainer.innerHTML = html;
}

// 选择药方用于验证
function selectFormulaForVerification(formulaName) {
    // 跳转到药方智验页面，并传递所选药方名称
    window.location.href = `/formula?formula=${encodeURIComponent(formulaName)}`;
}

// 显示疾病搜索结果
function displayDiseaseResults(results) {
    const resultContainer = document.getElementById('result-disease');
    
    if (results.length === 0) {
        resultContainer.innerHTML = `
            <div class="no-results">
                <p>未找到相关疾病</p>
                <button onclick="clearSearch()">清除搜索</button>
            </div>
        `;
        return;
    }

    let html = '<div class="result-list">';
    results.forEach(disease => {
        html += `
            <div class="result-item" onclick="showDiseaseDetail('${disease.name}')">
                <h4>${disease.name}</h4>
                <p>推荐药方：${disease.formulas.slice(0, 2).join('、')}${disease.formulas.length > 2 ? '...' : ''}</p>
            </div>
        `;
    });
    html += '</div>';
    
    resultContainer.innerHTML = html;
}
// 显示药膳搜索结果
function displayDietResults(results) {
    const resultContainer = document.getElementById('result-diet');
    
    if (results.length === 0) {
        resultContainer.innerHTML = `
            <div class="no-results">
                <p>未找到相关药膳</p>
                <button onclick="clearSearch()">清除搜索</button>
            </div>
        `;
        return;
    }

    let html = '<div class="result-list">';
    results.forEach(diet => {
        html += `
            <div class="result-item" onclick="showDietDetail('${diet.name}')">
                <h4>${diet.name}</h4>
                <p>功能：${diet.function.substring(0, 50)}${diet.function.length > 50 ? '...' : ''}</p>
                <p>适宜人群：${diet.suitable.substring(0, 50)}${diet.suitable.length > 50 ? '...' : ''}</p>
            </div>
        `;
    });
    html += '</div>';
    
    resultContainer.innerHTML = html;
}
// 加载药材列表
function loadHerbsList() {
    const herbs = getHerbsList(); // 显示所有药材
    displayHerbResults(herbs);
}

// 加载药方列表
function loadFormulasList() {
    const formulas = getFormulasList(); // 显示所有药方
    displayFormulaResults(formulas);
}

// 加载疾病列表
function loadDiseasesList() {
    const diseases = getDiseasesList();
    displayDiseaseResults(diseases);
}
// 加载药膳列表
function loadDietsList() {
    const diets = getDietsList(); // 显示所有药膳
    displayDietResults(diets);
}
// 显示药材详情
function showHerbDetail(herbName) {
    const herbs = getHerbsList();
    const herb = herbs.find(h => h.name === herbName);
    if (!herb) return;

    document.getElementById('modal-title').textContent = herb.name;
    document.getElementById('herb-name').textContent = herb.name;
    document.getElementById('herb-function').textContent = herb.function;

    // 加载药材图片 - 使用中文名称到图片信息的映射
    const imgInfo = knowledgeData.herb_to_img_info[herbName];
    
    // 获取所有图片元素
    const imgElements = [
        document.getElementById('herb-image-1'),
        document.getElementById('herb-image-2'),
        document.getElementById('herb-image-3')
    ];
    
    // 先隐藏所有图片
    imgElements.forEach(img => {
        img.style.display = 'none';
    });
    
    // 如果有图片信息且有图片文件
    if (imgInfo && imgInfo.files && imgInfo.files.length > 0) {
        const herbImagesDir = `/static/imgs/${encodeURIComponent(imgInfo.dir)}/`;
        
        // 加载可用的图片
        imgInfo.files.forEach((imgFile, index) => {
            if (index < 3) { // 最多显示3张图片
                const imgElement = imgElements[index];
                imgElement.src = `${herbImagesDir}${encodeURIComponent(imgFile)}`;
                
                // 设置图片加载失败时的处理
                imgElement.onerror = function() {
                    this.style.display = 'none';
                };
                
                // 图片加载成功时显示
                imgElement.onload = function() {
                    this.style.display = 'inline-block';
                };
            }
        });
    }

    const formulasList = document.getElementById('herb-formulas');
    formulasList.innerHTML = '';
    herb.formulas.forEach(formula => {
        const li = document.createElement('li');
        li.textContent = formula;
        li.addEventListener('click', () => showFormulaDetail(formula));
        formulasList.appendChild(li);
    });

    herbModal.style.display = 'flex';
}

// 当前选中的药方名称
let currentFormulaName = '';

// 显示药方详情
function showFormulaDetail(formulaName) {
    const formulas = getFormulasList();
    const formula = formulas.find(f => f.name === formulaName);
    if (!formula) return;
    
    // 保存当前选中的药方名称
    currentFormulaName = formulaName;

    document.getElementById('formula-modal-title').textContent = formula.name;
    document.getElementById('formula-name').textContent = formula.name;
    document.getElementById('formula-function').textContent = formula.function;

    const herbsList = document.getElementById('formula-herbs-list');
    herbsList.innerHTML = '';
    formula.herbs.forEach(herb => {
        const li = document.createElement('li');
        li.textContent = herb;
        li.addEventListener('click', () => {
            formulaModal.style.display = 'none';
            showHerbDetail(herb);
        });
        herbsList.appendChild(li);
    });
    
    // 为验证药方按钮添加点击事件
    const verifyBtn = document.getElementById('verify-formula-btn');
    if (verifyBtn) {
        // 移除旧的事件监听器
        verifyBtn.onclick = null;
        // 添加新的事件监听器
        verifyBtn.onclick = function() {
            // 获取当前药方的药材组成
            const formula = formulas.find(f => f.name === currentFormulaName);
            if (formula) {
                // 跳转到药方智鉴界面，并传递所选药方名称和药材组成
                const url = new URL('/formula', window.location.origin);
                url.searchParams.append('formula', currentFormulaName);
                url.searchParams.append('herbs', JSON.stringify(formula.herbs));
                window.location.href = url.toString();
            }
        };
    }
    
    // 为搜索药方验证按钮添加功能
    const searchFormulaBtn = document.getElementById('searchFormula');
    if (searchFormulaBtn) {
        searchFormulaBtn.onclick = function() {
            // 获取搜索输入框的值
            const formulaInput = document.getElementById('formulaName');
            const formulaToSearch = formulaInput ? formulaInput.value.trim() : '';
            
            // 验证输入是否为空
            if (formulaToSearch) {
                // 跳转到药方智鉴界面，并传递搜索的药方名称
                window.location.href = `/formula?formula=${encodeURIComponent(formulaToSearch)}`;
            } else {
                // 提示用户输入药方名称
                alert('请输入要搜索的药方名称');
            }
        };
        
        // 添加回车事件监听
        if (document.getElementById('formulaName')) {
            document.getElementById('formulaName').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchFormulaBtn.click();
                }
            });
        }
    }

    formulaModal.style.display = 'flex';
}

// 显示疾病详情
function showDiseaseDetail(diseaseName) {
    const diseases = getDiseasesList();
    const disease = diseases.find(d => d.name === diseaseName);
    if (!disease) return;

    document.getElementById('disease-modal-title').textContent = disease.name;
    document.getElementById('disease-name').textContent = disease.name;

    const formulasList = document.getElementById('disease-formulas-list');
    formulasList.innerHTML = '';
    disease.formulas.forEach(formula => {
        const li = document.createElement('li');
        li.textContent = formula;
        li.addEventListener('click', () => {
            diseaseModal.style.display = 'none';
            showFormulaDetail(formula);
        });
        formulasList.appendChild(li);
    });

    diseaseModal.style.display = 'flex';
}
// 显示药膳详情
function showDietDetail(dietName) {
    const diets = getDietsList();
    const diet = diets.find(d => d.name === dietName);
    if (!diet) return;

    document.getElementById('diet-modal-title').textContent = diet.name;
    document.getElementById('diet-name').textContent = diet.name;
    document.getElementById('diet-function').textContent = diet.function;
    document.getElementById('diet-suitable').textContent = diet.suitable;

    const ingredientsList = document.getElementById('diet-ingredients-list');
    ingredientsList.innerHTML = '';
    diet.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });

    document.getElementById('diet-method-text').textContent = diet.method;

    dietModal.style.display = 'flex';
}
// 显示无结果
function showNoResults() {
    resultTabs.forEach(tab => {
        tab.innerHTML = `
            <div class="no-results">
                <p>未找到相关结果</p>
                <button onclick="clearSearch()">清除搜索</button>
            </div>
        `;
    });
}

// 清除搜索
function clearSearch() {
    searchInput.value = '';
    
    // 清除字母索引的选中状态
    const alphabetItems = alphabetContainer.querySelectorAll('.alphabet-item');
    alphabetItems.forEach(item => item.classList.remove('active'));
    
    resultTabs.forEach(tab => {
        tab.innerHTML = `
            <div class="empty-result">
                <p>请输入关键词进行搜索，或选择快速导航开始查询</p>
            </div>
        `;
    });
}

// 模拟异步加载数据（实际应用中应从后端API获取）
async function fetchData(url, params) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 这里应该是实际的fetch请求
    // return fetch(url, { ...params }).then(res => res.json());
    
    // 目前返回模拟数据
    return { success: true };
}

// 导出函数供外部调用（如果需要）
window.knowledgeBase = {
    performSearch,
    switchTab,
    showHerbDetail,
    showFormulaDetail,
    showDiseaseDetail,
    clearSearch
};