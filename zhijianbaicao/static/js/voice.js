// AI中医预诊页面交互逻辑

// DOM元素
const startDialogBtn = document.getElementById('startDialog');
const voiceStatus = document.getElementById('voiceStatus');
const voiceWave = document.getElementById('voiceWave');
const chatMessages = document.getElementById('chatMessages');
const callStatus = document.getElementById('callStatus');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const controlCircle = document.getElementById('controlCircle');
const controlIcon = document.getElementById('controlIcon');
const generateReportBtn = document.getElementById('generateReport');
const printReportBtn = document.getElementById('printReport');
const endCallBtn = document.getElementById('endCall');
const reportContent = document.getElementById('reportContent');
const clearChatBtn = document.getElementById('clearChatBtn');

// 全局状态
let isCalling = false;
let isListening = false;
let isSpeaking = false;
let recognition = null;
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let conversationHistory = [];

// 对话阶段管理
    let currentPhase = 'greeting';
    let currentQuestionIndex = 0;
    let patientInfo = {
        name: '',
        gender: '',
        age: '',
        region: '',
        occupation: '',
        mainComplaint: '',
        symptoms: {},
        diagnosis: '',
        treatmentPlan: ''
    };
    
    // 问诊类型配置 - 可以根据需要扩展更多用户
    const userConsultationType = {
        '陈先生': 'cough',  // 慢性咳嗽
        '吴女士': 'default'   // 吴女士使用默认的失眠流程
        // 可以添加更多用户配置
    };

// 对话阶段配置 - 支持多用户
const dialoguePhases = {
    // 通用开场阶段
    greeting: {
        name: '开场问候',
        questions: [
            '${patientInfo.name}，您好，我是您的私人AI中医助手小康。接下来，我将通过对话了解您的健康状况，为您提供中医调理建议。请您在安静的环境中回答。',
            '我已查看您的过往病史，请问您现在的主要问题是什么，有怎样的症状？'
        ],
        onComplete: () => {
            // 调试信息：打印当前患者信息和问诊类型
            console.log('当前患者信息:', patientInfo);
            
            // 根据当前用户的问诊类型选择对话流程
            const consultationType = userConsultationType[patientInfo.name] || 'default';
            console.log('选择的问诊类型:', consultationType);
            
            if (consultationType === 'cough') {
                // 启动咳嗽问诊流程
                currentPhase = 'chenMainComplaint';
                console.log('启动咳嗽问诊流程');
            } else {
                // 启动低血糖问诊流程
                currentPhase = 'smartInquiry';
                console.log('启动低血糖问诊流程');
            }
            currentQuestionIndex = 0;
            speakNextQuestion();
        }
    },
    
    // 低血糖问诊流程 - 适用于吴女士
    smartInquiry: {
        name: '智能追问',
        questions: [
            '我注意到您之前有过低血糖情况。这次的头晕和无力症状和以前的低血糖时像吗，是不是在饥饿的时候更明显？比如快到饭点的时候？',
            '头晕时会不会有心慌、手抖、出冷汗？和之前的情况像吗？'
        ],
        onComplete: () => {
            currentPhase = 'targetedConfirmation';
            currentQuestionIndex = 0;
            speakNextQuestion();
        }
    },
    
    targetedConfirmation: {
        name: '针对性确认',
        questions: [
            '根据您的病史，我重点关注几个问题。您今天用餐了吗？具体吃了什么？',
            '这几天三餐规律吗？有没有刻意节食或者大量运动？',
            '头晕的时候，如果马上吃点东西，会不会很快好转？'
        ],
        onComplete: () => {
            currentPhase = 'comprehensiveAnalysis';
            currentQuestionIndex = 0;
            speakNextQuestion();
        }
    },
    
    comprehensiveAnalysis: {
        name: '综合分析',
        questions: [
            '好的，我已经明白了。基于您的症状、既往病史和当前情况，我为您分析一下：症状匹配度分析：1. 饥饿时头晕乏力（符合度95%）；2. 伴心慌手抖（符合度90%）；3. 进食后迅速缓解（符合度98%）；4. 有低血糖病史（匹配100%）。中医辨证：您这是“气虚血弱，脾失健运”的表现，中医称为“虚劳头晕”。现代医学分析：结合您的病史和症状，这很可能是低血糖的典型表现。由于您早餐只喝了咖啡，没有摄入足够的碳水化合物，导致血糖下降过快，引起头晕、乏力、心慌等症状。'
        ],
        onComplete: () => {
            currentPhase = 'personalizedAdvice';
            currentQuestionIndex = 0;
            speakNextQuestion();
        }
    },
    
    personalizedAdvice: {
        name: '个性化建议',
        questions: [
            '根据您的具体情况，我建议：1. 立即措施：现在请立即吃些含糖食物（果汁、糖果等）；2. 饮食调整：必须吃早餐，选择复合碳水化合物（燕麦、全麦面包）；3. 生活规律：三餐定时，可少食多餐；4. 就医建议：如果频繁发作，建议复查血糖和糖化血红蛋白。我已将这次问诊记录更新到您的健康档案。请注意，我的建议仅供参考，如有需要请及时就医。'
        ],
        onComplete: () => {
            endCall();
        }
    },
    
    // 咳嗽问诊流程 - 适用于所有有咳嗽症状的用户
    chenMainComplaint: {
        name: '开场与问题定位',
        questions: [
            '您好，我是您的AI中医助手小康。了解到您最近有些咳嗽的困扰，中医调理咳嗽讲究辨证，我们花几分钟，一起把您的情况理清楚，找到适合您的调理方向，好吗？'
        ],
        onComplete: () => {
            currentPhase = 'chenCoreSymptoms';
            currentQuestionIndex = 0;
            speakNextQuestion();
        }
    },
    chenCoreSymptoms: {
        name: '核心症状探询与辨证',
        questions: [
            '首先，您仔细感觉一下，咳嗽的冲动主要是来自喉咙以上，觉得嗓子发痒就必须咳；还是感觉胸口或气管比较深的地方有东西，需要用力咳才舒服？',
            '嗯，尤其是在需要集中精力的时候更觉烦扰。别担心，我们从您最直接的感受开始梳理。',
            '主要是喉咙痒，一痒就忍不住想清嗓子、咳嗽，感觉位置比较靠上。',
            '咽痒确实是风邪的一个典型信号。那咳嗽的时候有痰吗？还是以干咳为主？',
            '有点痰，但不多，咳几下才能出来一点。',
            '这口痰的颜色和质地对我们判断性质很重要。它看起来是偏白、偏黄，还是灰？质地是清稀像水，还是比较粘稠不容易吐干净？',
            '颜色是白的，质地有点稀，不算粘。',
            '很清楚。我们再来找找规律：这个咳嗽在一天之中有没有特别明显的时候？比如早晨刚起床、半夜、躺下后，或者是说话、运动之后？',
            '早上起床的时候最明显，总要咳一阵，感觉有痰要清一下。另外就是在图书馆或者教室里待久了，一出门遇冷风，或者晚上熬夜复习累了，也容易咳。',
            '这个规律很有参考价值。为了找到根源，回想一下这次咳嗽开始前，有没有感冒、着凉的经历？或者您本身有没有过敏性鼻炎、鼻窦炎这类情况？',
            '最开始好像是几个月前一次重感冒之后，感冒好了但咳嗽没全好。我有过敏性鼻炎，换季或者空气不好的时候容易打喷嚏、流鼻涕。',
            '我明白了，这是感冒后身体没有完全恢复，余邪未清。除了咳嗽本身，全身有没有其他不舒服的感觉？比如怕风、怕冷、容易出汗、鼻子通不通气、咽喉干不干痛，或者总觉得累、没精神？',
            '确实比之前怕风怕冷，在教室或图书馆不敢对着空调风口坐。鼻子有点堵，时好时坏。喉咙主要是干和痒，不算很痛。人容易疲劳，特别是这学期课业重，感觉精力不如以前。'
        ],
        onComplete: () => {
            currentPhase = 'chenAnalysis';
            currentQuestionIndex = 0;
            speakNextQuestion();
        }
    },
    chenAnalysis: {
        name: '综合分析、确认与方案引出',
        questions: [
            '感谢您这么清晰的描述。我现在把您的情况梳理一下，您听听看对不对：您在几个月前感冒后，风邪没有完全被清除，留在呼吸道。主要表现是喉咙痒、咳嗽、咳白稀痰。同时，您本身有过敏性鼻炎，体质上存在肺卫气虚、防御外邪能力偏弱的一面，所以容易怕风怕冷、容易疲劳。早上咳嗽加重，是夜间痰湿积聚的表现。综合来看，您的情况可以归纳为风邪恋肺，痰湿内蕴，肺气失宣，兼有肺卫不固。就像一个房间，窗户关不严（卫气虚），冷风进来后没完全出去（风邪恋肺），还在屋里留下了一些湿气（痰湿）。我理解到这个程度，符合您的感受吗？',
            '好的，那么调理的思路也就清晰了。核心是疏风宣肺，化痰止咳，兼以益气固表。接下来，我将从中药思路、生活茶饮、穴位保健和日常养护四个方面，为您提供一份具体的调理参考，您可以重点听自己感兴趣的部分。',
            '第一，立即行动（本周开始）：颈部保暖：佩戴围巾或穿高领衣物，避免咽喉及颈后（大椎穴区域）受凉。穴位按压：咽痒发作时，即时按揉天突穴（胸骨上窝中央）2-3分钟。环境调整：在干燥的宿舍或图书馆，可使用加湿器，保持空气湿润。第二，饮食调理：适宜食物：可适量食用白萝卜、山药、梨子（炖煮）等润肺化痰的食材。忌口提醒：严格避免冰镇饮品、甜食、油炸及辛辣食物，以防助湿生痰或刺激咽喉。第三，生活方式：作息管理：保证充足睡眠，避免连续熬夜，因疲劳会显著降低抵抗力。适度锻炼：天气良好时进行温和户外活动（如散步），但避免大汗后吹风。口鼻防护：在人员密集或空气不佳场所，可佩戴口罩，减少刺激。第四，药方推荐：治疗方：止嗽散合玉屏风散加减。方剂组成：炙黄芪12克、炒白术9克、防风6克、桔梗6克、荆芥6克、紫菀9克、百部9克、白前9克、茯苓9克、陈皮6克、生甘草3克。中成药方：通宣理肺丸（适用于咳嗽、白痰、怕冷明显时）、玉屏风颗粒（适用于平时怕风、易感冒、用于体质调理）。茶饮方：利咽止咳茶：金银花3克、桔梗3克、甘草2克，沸水冲泡，代茶徐徐含咽。特别提醒：如果出现咳嗽加剧，出现黄脓痰、发烧、胸痛，或出现呼吸急促、喘息或呼吸困难，或症状持续加重影响日常休息与活动，请立即就医。我会在两周后提醒您复诊，评估调理效果。您对哪个建议需要更详细的解释吗？'
        ],
        onComplete: () => {
            endCall();
        }
    }
};

// 预设回复映射
const presetReplies = {
    '头痛': '头痛就要好好休息，多喝水，保持充足的睡眠。',
    '肚子痛': '肚子痛可以喝点温水，注意饮食清淡。',
    '发烧': '发烧要多休息，适当降温，必要时请就医。',
    '感冒': '感冒要多喝水，注意保暖，适当休息。',
    '咳嗽': '咳嗽可以多喝温水，避免辛辣刺激食物。',
    '失眠': '失眠可以尝试放松心情，保持规律作息，睡前避免使用电子设备。',
    '便秘': '便秘要多吃蔬菜水果，多喝水，适当运动。',
    '疲劳': '疲劳要注意休息，保证充足睡眠，适当补充营养。',
    '口渴': '口渴要及时补充水分，保持身体水分平衡。',
    '恶心': '恶心可以尝试深呼吸，避免油腻食物，适当休息。',
    '腹泻': '腹泻要多喝水，避免食用生冷食物，注意腹部保暖。',
    '过敏': '过敏要避免接触过敏原，必要时请就医。',
    '气喘': '气喘要保持冷静，避免剧烈运动，必要时请就医。',
    '胸闷': '胸闷要保持通风，避免紧张，必要时请就医。',
    '腰酸': '腰酸要注意休息，避免久坐，适当进行腰部锻炼。',
    '背痛': '背痛要保持正确姿势，避免长时间保持同一姿势。',
    '关节痛': '关节痛要注意保暖，避免过度劳累，适当进行康复运动。',
    '牙痛': '牙痛要保持口腔清洁，避免冷热刺激，必要时请就医。',
    '眼痛': '眼痛要注意眼部休息，避免长时间使用电子设备，保持正确坐姿。',
    '耳鸣': '耳鸣要保持充足睡眠，避免噪音刺激，必要时请就医。'
};

// 获取当前登录用户
function getCurrentUser() {
    const userElement = document.getElementById('currentUser');
    return userElement ? userElement.textContent.trim() : null;
}

// 从localStorage恢复聊天记录
    function restoreChatHistory() {
        const currentUser = getCurrentUser();
        const storageKey = currentUser ? `conversationHistory_${currentUser}` : 'conversationHistory';
        const savedHistory = localStorage.getItem(storageKey);
        if (savedHistory) {
            conversationHistory = JSON.parse(savedHistory);
            // 重新渲染聊天记录
            conversationHistory.forEach(msg => {
                let content = msg.content;
                // 动态替换患者信息
                if (patientInfo.name) {
                    content = content.replace(/\$\{patientInfo\.name\}/g, patientInfo.name);
                    content = content.replace(/\$\{patientInfo\.title\}/g, patientInfo.title);
                }
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.sender.toLowerCase()}`;
                messageDiv.innerHTML = `
                    <div class="sender">${msg.sender}:</div>
                    <div class="content">${content}</div>
                `;
                chatMessages.appendChild(messageDiv);
            });
            // 滚动到底部
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

// 初始化语音识别
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'zh-CN';
        
        recognition.onstart = () => {
            isListening = true;
            updateStatus('聆听中', 'listening');
            voiceWave.classList.add('wave-active');
            voiceStatus.textContent = '聆听中...';
        };
        
        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            handleUserInput(result);
        };
        
        recognition.onend = () => {
            isListening = false;
            voiceWave.classList.remove('wave-active');
            voiceStatus.textContent = '识别完成，正在回复...';
        };
        
        recognition.onerror = (event) => {
            console.error('语音识别错误:', event.error);
            isListening = false;
            voiceWave.classList.remove('wave-active');
            voiceStatus.textContent = '识别错误，请重试...';
            // 5秒后重新开始监听
            setTimeout(startListening, 5000);
        };
    } else {
        voiceStatus.textContent = '您的浏览器不支持语音识别功能';
        startDialogBtn.disabled = true;
    }
}

// 开始对话
function startDialog() {
    isCalling = true;
    startDialogBtn.disabled = true;
    endCallBtn.disabled = false;
    
    // 重置对话状态
    currentPhase = 'greeting';
    currentQuestionIndex = 0;
    
    // 从页面获取当前登录用户信息，不设置默认值
    let currentUser = '';
    try {
        // 尝试从页面获取用户信息（实际项目中应该从服务器获取）
        const userElement = document.getElementById('currentUser');
        if (userElement) {
            currentUser = userElement.textContent.trim(); // 去除前后空格和换行符
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
    
    // 如果获取不到用户名，使用一个空字符串，后续代码会根据实际情况处理
    
    // 生成患者称呼
    function generatePatientTitle(name) {
        // 根据姓名或其他信息生成合适的称呼
        // 这里可以扩展更复杂的逻辑，例如：
        // 1. 根据性别判断
        // 2. 根据年龄判断
        // 3. 根据职业判断
        // 4. 支持用户自定义称呼
        
        // 简单实现：默认女士，可根据需要扩展
        return '女士';
    }
    
    // 设置患者信息
    patientInfo = {
        name: currentUser,
        title: generatePatientTitle(currentUser),
        gender: '',
        age: '',
        region: '',
        occupation: '',
        mainComplaint: '',
        symptoms: {},
        diagnosis: '',
        treatmentPlan: ''
    };
    
    // 重置报告区域，但不清空聊天记录
    reportContent.innerHTML = '<p>通话结束后点击生成报告按钮，系统将为您生成健康报告</p>';
    printReportBtn.disabled = true;
    generateReportBtn.disabled = true;
    
    // 调试信息：打印当前用户和对话流程
    console.log('当前登录用户:', currentUser);
    console.log('用户咨询类型配置:', userConsultationType);
    
    // 开始第一个阶段
    speakNextQuestion();
}

// 播放下一个问题
    function speakNextQuestion() {
        const phase = dialoguePhases[currentPhase];
        if (currentQuestionIndex < phase.questions.length) {
            let question = phase.questions[currentQuestionIndex];
            // 动态替换患者信息
            if (patientInfo.name) {
                // 使用正则表达式进行全局替换，确保所有出现的占位符都被替换
                question = question.replace(/\$\{patientInfo\.name\}/g, patientInfo.name);
                question = question.replace(/\$\{patientInfo\.title\}/g, patientInfo.title);
            }
            addMessage('AI', question);
            speak(question, () => {
                // 问题说完后开始监听
                startListening();
            });
        } else {
            // 阶段完成
            if (phase.onComplete) {
                phase.onComplete();
            }
        }
    }

// 结束对话
function endCall() {
    isCalling = false;
    isListening = false;
    isSpeaking = false;
    
    if (recognition) {
        recognition.stop();
    }
    
    if (currentUtterance) {
        speechSynthesis.cancel();
    }
    
    // 更新UI状态
    startDialogBtn.disabled = false;
    endCallBtn.disabled = true;
    generateReportBtn.disabled = false;
    updateStatus('通话结束', '');
    voiceStatus.textContent = '通话已结束';
    voiceWave.classList.remove('wave-active');
    
    // 提示用户可以生成报告
    reportContent.innerHTML = '<p>通话已结束，点击生成报告按钮，系统将为您生成健康报告</p>';
}

// 开始监听用户语音
function startListening() {
    if (!isCalling || isSpeaking) return;
    
    if (recognition && !isListening) {
        recognition.start();
    }
}

// 停止监听
function stopListening() {
    if (recognition && isListening) {
        recognition.stop();
    }
}

// 处理用户输入
function handleUserInput(text) {
    // 添加用户消息到聊天记录
    addMessage('我', text);
    
    // 获取当前阶段
    const phase = dialoguePhases[currentPhase];
    
    // 处理当前问题的回答
    if (phase.onAnswer) {
        phase.onAnswer(text, currentQuestionIndex);
    }
    
    // 检查特殊问题的动态回复
    let dynamicReply = null;
    if (currentPhase === 'treatment' && text.includes('玫瑰花和酸枣仁茶怎么泡')) {
        dynamicReply = '取玫瑰花3克、酸枣仁5克，放入保温杯，用300毫升开水冲泡，闷15分钟后饮用。可以反复冲泡至味淡。建议下午3-5点喝，不影响晚上睡眠。';
    } else if (currentPhase === 'treatment' && text.includes('归脾汤方剂里的草药都是什么作用的')) {
        dynamicReply = '归脾汤主要用于心脾两虚证，其中黄芪、党参、白术、茯苓健脾益气；当归养血；酸枣仁、远志养心安神；木香理气醒脾；柴胡、白芍、枳壳、陈皮疏肝理气；龙骨、牡蛎重镇安神；炙甘草调和诸药。';
    }
    
    if (dynamicReply) {
        // 动态回复
        addMessage('AI', dynamicReply);
        speak(dynamicReply, () => {
            // 继续监听用户的追问
            startListening();
        });
    } else {
        // 进入下一个问题
        currentQuestionIndex++;
        
        // 检查当前阶段是否完成
        if (currentQuestionIndex < phase.questions.length) {
            // 播放下一个问题
            setTimeout(() => {
                speakNextQuestion();
            }, 500);
        } else {
            // 阶段完成
            if (phase.onComplete) {
                phase.onComplete();
            }
        }
    }
}

// 语音合成函数
function speak(text, callback) {
    if (!isCalling) return;
    
    isSpeaking = true;
    updateStatus('AI回复中', 'speaking');
    voiceStatus.textContent = 'AI回复中...';
    
    // 清空当前的语音队列
    speechSynthesis.cancel();
    
    // 创建新的语音合成实例
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.2;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
        isSpeaking = true;
        controlCircle.classList.add('recording');
        controlIcon.textContent = '🔊';
    };
    
    utterance.onend = () => {
        isSpeaking = false;
        controlCircle.classList.remove('recording');
        controlIcon.textContent = '🎤';
        voiceStatus.textContent = '等待您的回应...';
        
        if (callback) {
            callback();
        }
    };
    
    utterance.onerror = (event) => {
        console.error('语音合成错误:', event.error);
        isSpeaking = false;
        controlCircle.classList.remove('recording');
        controlIcon.textContent = '🎤';
        voiceStatus.textContent = '回复错误，请重试...';
        
        if (callback) {
            callback();
        }
    };
    
    currentUtterance = utterance;
    speechSynthesis.speak(utterance);
}

// 添加消息到聊天记录
function addMessage(sender, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender.toLowerCase()}`;
    messageDiv.innerHTML = `
        <div class="sender">${sender}:</div>
        <div class="content">${content}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 保存到对话历史
    conversationHistory.push({
        sender,
        content,
        timestamp: new Date().toLocaleString()
    });
    
    // 将对话历史保存到localStorage
    const currentUser = getCurrentUser();
    const storageKey = currentUser ? `conversationHistory_${currentUser}` : 'conversationHistory';
    localStorage.setItem(storageKey, JSON.stringify(conversationHistory));
}

// 更新通话状态
function updateStatus(text, status) {
    statusText.textContent = text;
    statusIndicator.className = 'status-indicator';
    
    if (status) {
        statusIndicator.classList.add(status);
    }
}

// 清空聊天记录
function clearChatHistory() {
    // 清空聊天记录显示
    chatMessages.innerHTML = '';
    // 清空对话历史数组
    conversationHistory = [];
    // 从localStorage中移除对话历史
    const currentUser = getCurrentUser();
    const storageKey = currentUser ? `conversationHistory_${currentUser}` : 'conversationHistory';
    localStorage.removeItem(storageKey);
    // 重置报告区域
    reportContent.innerHTML = '<p>通话结束后点击生成报告按钮，系统将为您生成健康报告</p>';
    printReportBtn.disabled = true;
    generateReportBtn.disabled = true;
}

// 生成健康报告
function generateReport() {
    if (conversationHistory.length === 0) {
        reportContent.innerHTML = '<p>暂无对话记录，无法生成报告</p>';
        return;
    }
    
    // 显示加载状态
    const loadingHTML = `
        <div style="text-align: center; padding: 50px 0; color: #3b82f6;">
            <div style="display: flex; justify-content: center; margin-bottom: 20px;">
                <div style="width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <p style="font-size: 18px; margin-bottom: 10px;">正在生成报告...</p>
            <p style="color: #6b7280;">AI正在分析您的健康数据，预计需要3-5秒</p>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </div>
    `;
    
    reportContent.innerHTML = loadingHTML;
    generateReportBtn.disabled = true;
    
    // 延迟3秒生成报告
    setTimeout(() => {
        const now = new Date();
        const formattedDate = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日';
        const timestamp = now.toISOString();
        let reportHTML = '';
        let reportData = {};
        
        // 女士健康评估报告
        reportHTML = `<h2 style="text-align:center;border-bottom:2px solid #3b82f6;padding-bottom:10px;margin-bottom:30px;color:#1e40af;">中医健康评估报告</h2>`;
    
    // 📋 基本信息
    reportHTML += `<h3 style="color:#1e40af;border-left:4px solid #3b82f6;padding-left:15px;margin-top:30px;margin-bottom:20px;">📋 基本信息</h3>`;
    reportHTML += `<div style="margin-left:40px;">`;
    reportHTML += `<p><strong>姓名:</strong> ${patientInfo.name || '吴女士'}</p>`;
    reportHTML += `<p><strong>年龄:</strong> ${patientInfo.age || '20岁'}</p>`;
    reportHTML += `<p><strong>性别:</strong> ${patientInfo.gender || '女'}</p>`;
    reportHTML += `<p><strong>评估日期:</strong> ${formattedDate}</p>`;
    reportHTML += `<p><strong>主诉症状：</strong>${patientInfo.mainComplaint || '饥饿时头晕、乏力，伴心慌、手抖、出冷汗，进食后缓解'}</p>`;
    reportHTML += `</div>`;
    
    // 🔍 诊断结论
    reportHTML += `<h3 style="color:#1e40af;border-left:4px solid #3b82f6;padding-left:15px;margin-top:30px;margin-bottom:20px;">🔍 诊断结论</h3>`;
    reportHTML += `<div style="margin-left:40px;">`;
    reportHTML += `<p><strong>中医诊断:</strong> 虚劳（气血两虚证）</p>`;
    reportHTML += `<p><strong>体质辨识:</strong> 气虚体质（兼阳虚倾向）</p>`;
    reportHTML += `</div>`;
    
    // 📊 症状特征
    reportHTML += `<h3 style="color:#1e40af;border-left:4px solid #3b82f6;padding-left:15px;margin-top:30px;margin-bottom:20px;">📊 症状特征</h3>`;
    reportHTML += `<div style="margin-left:40px;">`;
    reportHTML += `<p>• 饥饿时头晕乏力（上午11点/下午4点明显）</p>`;
    reportHTML += `<p>• 伴心慌、手抖、出冷汗</p>`;
    reportHTML += `<p>• 进食后迅速缓解</p>`;
    reportHTML += `<p>• 早餐不规律（常只喝咖啡）</p>`;
    reportHTML += `<p>• 既往低血糖病史（空腹血糖3.8mmol/L）</p>`;
    reportHTML += `</div>`;
    
    // 🌿 中药调理方案
    reportHTML += `<h3 style="color:#1e40af;border-left:4px solid #3b82f6;padding-left:15px;margin-top:30px;margin-bottom:20px;">🌿 中药调理方案</h3>`;
    reportHTML += `<div style="margin-left:40px;">`;
    reportHTML += `<p><strong>治则:</strong> 益气健脾，升阳举陷</p>`;
    reportHTML += `<p><strong>主方:</strong> 补中益气汤加减</p>`;
    reportHTML += `<p><strong>组成:</strong></p>`;
    reportHTML += `<div style="margin-left:20px;background-color:#f5f5f5;padding:15px;border-radius:8px;">`;
    reportHTML += `<p>黄芪20g，党参15g，白术12g</p>`;
    reportHTML += `<p>当归10g，陈皮6g，升麻6g</p>`;
    reportHTML += `<p>柴胡6g，炙甘草6g，大枣5枚</p>`;
    reportHTML += `<p>生姜3片，山药15g（另加）</p>`;
    reportHTML += `</div>`;
    reportHTML += `<p><strong>服法:</strong> 每日1剂，水煎两次，早晚温服，连服7天</p>`;
    reportHTML += `</div>`;
    
    // 🥗 饮食调理要点
    reportHTML += `<h3 style="color:#1e40af;border-left:4px solid #3b82f6;padding-left:15px;margin-top:30px;margin-bottom:20px;">🥗 饮食调理要点</h3>`;
    reportHTML += `<div style="margin-left:40px;">`;
    
    reportHTML += `<h4 style="color:#3b82f6;margin-top:20px;margin-bottom:15px;">推荐食疗</h4>`;
    reportHTML += `<p>• 黄芪山药粥: 每周3-4次，早餐食用</p>`;
    reportHTML += `<p>• 桂圆红枣茶: 下午饮用，缓解心慌</p>`;
    reportHTML += `<p>• 生姜红糖水: 晨起空腹饮用，每周3次</p>`;
    reportHTML += `</div>`;
    
    
    reportHTML += `<h4 style="color:#3b82f6;margin-top:20px;margin-bottom:15px;">紧急处理</h4>`;
    reportHTML += `<p><strong>低血糖发作时:</strong></p>`;
    reportHTML += `<div style="margin-left:20px;background-color:#fff3cd;border:1px solid #ffeeba;border-radius:8px;padding:15px;">`;
    reportHTML += `<p>1. 立即坐下，防止摔倒</p>`;
    reportHTML += `<p>2. 进食15g快速升糖食物（果汁150ml/糖果3颗）</p>`;
    reportHTML += `<p>3. 15分钟未缓解重复第二步</p>`;
    reportHTML += `<p>4. 缓解后进食面包/饼干</p>`;
    reportHTML += `</div>`;
    reportHTML += `</div>`;
    
    // ⚠️ 就医与监测
    reportHTML += `<h3 style="color:#1e40af;border-left:4px solid #3b82f6;padding-left:15px;margin-top:30px;margin-bottom:20px;">⚠️ 就医与监测</h3>`;
    reportHTML += `<div style="margin-left:40px;">`;
    
    reportHTML += `<h4 style="color:#3b82f6;margin-top:20px;margin-bottom:15px;">就医指征</h4>`;
    reportHTML += `<p>• 意识模糊或昏迷</p>`;
    reportHTML += `<p>• 低血糖频繁发作（每周>2次）</p>`;
    reportHTML += `<p>• 调整后无改善</p>`;
    
    
    reportHTML += `</div>`;
    
    // 报告生成信息
    reportHTML += `<div style="margin-top:40px;padding:20px;background-color:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;">`;
    reportHTML += `<p style="margin-bottom:15px;"><strong>报告生成:</strong> AI中医小康系统 v2.1</p>`;
    reportHTML += `<p><strong>温馨提示:</strong> 本报告仅供参考，不能替代执业医师诊断。如症状加重请及时就医。</p>`;
    reportHTML += `</div>`;
    
    // 准备报告数据
    reportData = {
        id: Date.now(),
        timestamp: timestamp,
        date: formattedDate,
        patientInfo: {
            name: patientInfo.name || '吴女士',
            gender: patientInfo.gender || '女',
            age: patientInfo.age || '20岁',
            occupation: patientInfo.occupation || '未知',
            mainComplaint: patientInfo.mainComplaint || '饥饿时头晕、乏力，伴心慌、手抖、出冷汗，进食后缓解'
        },
        content: reportHTML,
        conversationHistory: conversationHistory
    };
    
    // 显示报告
    reportContent.innerHTML = reportHTML;
    
    // 启用打印按钮
    printReportBtn.disabled = false;
    
    // 保存报告数据到localStorage
    localStorage.setItem('lastReport', JSON.stringify(reportData));
    
    // 保存报告到服务器
    saveReportToServer(reportData);
    
    // 启用生成报告按钮
    generateReportBtn.disabled = false;
    
    // 关闭setTimeout
    }, 3000);
}

// 保存报告到服务器
async function saveReportToServer(report) {
    try {
        const response = await fetch('/api/save_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(report)
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('报告保存成功');
            // 可以添加保存成功的提示
            const saveSuccess = document.createElement('div');
            saveSuccess.className = 'save-success';
            saveSuccess.style.cssText = `
                background-color: #dcfce7;
                color: #166534;
                padding: 10px;
                border-radius: 5px;
                margin-top: 10px;
                text-align: center;
                font-weight: bold;
            `;
            saveSuccess.textContent = '报告已保存到您的诊室';
            reportContent.appendChild(saveSuccess);
            
            // 3秒后移除提示
            setTimeout(() => {
                saveSuccess.remove();
            }, 3000);
        }
    } catch (error) {
        console.error('保存报告失败:', error);
    }
}

// 打印报告
function printReport() {
    if (reportContent.innerHTML.includes('通话结束后点击生成报告按钮')) {
        alert('请先生成报告再打印');
        return;
    }
    
    // 打开打印对话框
    window.print();
}

// 初始化事件监听
function initEventListeners() {
    // 开始对话按钮点击事件
    startDialogBtn.addEventListener('click', startDialog);
    
    // 结束通话按钮点击事件
    endCallBtn.addEventListener('click', endCall);
    
    // 生成报告按钮点击事件
    generateReportBtn.addEventListener('click', generateReport);
    
    // 打印报告按钮点击事件
    printReportBtn.addEventListener('click', printReport);
    
    // 清空聊天记录按钮点击事件
    clearChatBtn.addEventListener('click', clearChatHistory);
    
    // 中央控制按钮点击事件
    controlCircle.addEventListener('click', () => {
        if (!isCalling) {
            startDialog();
        } else if (isListening) {
            stopListening();
        } else if (isSpeaking) {
            speechSynthesis.cancel();
        } else {
            startListening();
        }
    });
    
    // 窗口关闭或刷新时清理资源
    window.addEventListener('beforeunload', () => {
        if (isCalling) {
            endCall();
        }
    });
}

// 初始化页面
function initPage() {
    // 初始化语音识别
    initSpeechRecognition();
    
    // 初始化事件监听
    initEventListeners();
    
    // 从localStorage恢复聊天记录
    restoreChatHistory();
    
    // 设置初始状态
    updateStatus('未通话', '');
    voiceStatus.textContent = '准备对话...';
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initPage);
