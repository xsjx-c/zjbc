// 人脸识别登录功能

document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const faceLoginBtn = document.getElementById('faceLoginBtn');
    const faceLoginModal = document.getElementById('faceLoginModal');
    const closeBtn = document.querySelector('.close');
    const stopFaceLoginBtn = document.getElementById('stopFaceLoginBtn');
    const captureFaceBtn = document.getElementById('captureFaceBtn');
    const faceVideo = document.getElementById('faceVideo');
    const faceCanvas = document.getElementById('faceCanvas');
    const faceLoginStatus = document.getElementById('faceLoginStatus');
    
    let stream = null;
    let isStreaming = false;
    
    // 打开模态框
    faceLoginBtn.addEventListener('click', function() {
        faceLoginModal.style.display = 'block';
        initCamera();
    });
    
    // 关闭模态框
    function closeModal() {
        faceLoginModal.style.display = 'none';
        stopCamera();
    }
    
    // 关闭按钮点击事件
    closeBtn.addEventListener('click', closeModal);
    
    // 取消按钮点击事件
    stopFaceLoginBtn.addEventListener('click', closeModal);
    
    // 点击模态框外部关闭模态框
    window.addEventListener('click', function(event) {
        if (event.target === faceLoginModal) {
            closeModal();
        }
    });
    
    // 初始化摄像头
    async function initCamera() {
        try {
            faceLoginStatus.textContent = '正在初始化摄像头...';
            
            // 请求摄像头权限
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user' // 使用前置摄像头
                }
            });
            
            // 设置视频流
            faceVideo.srcObject = stream;
            isStreaming = true;
            faceLoginStatus.textContent = '摄像头初始化成功，请将面部对准摄像头';
        } catch (error) {
            console.error('摄像头初始化失败:', error);
            faceLoginStatus.textContent = '摄像头初始化失败: ' + error.message;
        }
    }
    
    // 停止摄像头
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            isStreaming = false;
        }
    }
    
    // 捕获人脸
    captureFaceBtn.addEventListener('click', async function() {
        if (!isStreaming) {
            faceLoginStatus.textContent = '摄像头未初始化';
            return;
        }
        
        faceLoginStatus.textContent = '正在捕获人脸...';
        
        // 在canvas上绘制当前视频帧
        const ctx = faceCanvas.getContext('2d');
        faceCanvas.width = faceVideo.videoWidth;
        faceCanvas.height = faceVideo.videoHeight;
        ctx.drawImage(faceVideo, 0, 0, faceCanvas.width, faceCanvas.height);
        
        // 将canvas转换为base64字符串
        const faceImage = faceCanvas.toDataURL('image/jpeg', 0.8);
        
        // 发送人脸图像到服务器进行识别
        try {
            faceLoginStatus.textContent = '正在识别人脸...';
            
            const response = await fetch('/api/face_login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: faceImage
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                faceLoginStatus.textContent = '人脸识别成功，正在登录...';
                // 登录成功，重定向到首页
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                faceLoginStatus.textContent = '人脸识别失败: ' + result.message;
            }
        } catch (error) {
            console.error('人脸识别请求失败:', error);
            faceLoginStatus.textContent = '人脸识别请求失败: ' + error.message;
        }
    });
});