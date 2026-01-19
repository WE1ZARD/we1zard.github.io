// 辅助函数：获取正确的图片路径
function getImagePath(relativePath) {
    // 检查是否在本地环境
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // 本地环境使用相对路径
        return relativePath;
    } else {
        // 生产环境确保使用正确的相对路径
        return relativePath;
    }
}

// 确保DOM加载完成后执行所有操作
window.addEventListener('load', function() {
    console.log('DOM完全加载完成，开始执行脚本...');

    // -- 自动添加favicon
    const head = document.head;
    
    // 检查是否已经存在favicon
    if (!document.querySelector('link[rel="icon"]')) {
        // 创建favicon链接
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = getImagePath('/img/favicon.png');
        favicon.type = 'image/png';
        head.appendChild(favicon);
        console.log('添加了favicon');
    }
    // 检查是否已经存在shortcut icon
    if (!document.querySelector('link[rel="shortcut icon"]')) {
        // 创建shortcut icon链接
        const shortcutIcon = document.createElement('link');
        shortcutIcon.rel = 'shortcut icon';
        shortcutIcon.href = getImagePath('/img/favicon.png');
        shortcutIcon.type = 'image/png';
        head.appendChild(shortcutIcon);
        console.log('添加了shortcut icon');
    }
    
    // 检查是否已经存在apple-touch-icon
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
        // 创建apple-touch-icon链接
        const appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        appleTouchIcon.href = getImagePath('/img/favicon.png');
        head.appendChild(appleTouchIcon);
        console.log('添加了apple-touch-icon');
    }
    
    // -- 检查是否已经存在悬浮球
    if (!document.querySelector('.floating-ball')) {
        // 创建悬浮球元素
        const floatingBall = document.createElement('a');
        floatingBall.href = '/';
        floatingBall.className = 'floating-ball';
        
        // 创建图片元素
        const img = document.createElement('img');
        img.src = getImagePath('/img/avatar.png');
        img.alt = 'Home';
        
        // 将图片添加到悬浮球中
        floatingBall.appendChild(img);
        
        // 将悬浮球添加到页面
        document.body.appendChild(floatingBall);
        console.log('添加了悬浮球');
    } else {
        console.log('悬浮球已经存在');
    }
    
    // -- 处理页脚和悬浮按钮
    console.log('开始处理页脚和悬浮按钮...');
    
    // 先移除可能存在的页脚
    const existingFooter = document.querySelector('footer');
    if (existingFooter) {
        existingFooter.remove();
        console.log('移除了现有页脚');
    }
    
    // 创建新的固定页脚
    const footer = document.createElement('footer');
    
    // 应用固定样式
    footer.style.position = 'fixed';
    footer.style.bottom = '0';
    footer.style.left = '0';
    footer.style.width = '100%';
    footer.style.backgroundColor = '#051427';
    footer.style.zIndex = '9999';
    footer.style.borderTop = '1px solid rgba(59, 130, 246, 0.2)';
    footer.style.padding = '15px 0';
    footer.style.color = '#9CA3AF';
    footer.style.fontSize = '14px';
    
    // 创建页脚内部结构
    const footerContent = document.createElement('div');
    footerContent.style.maxWidth = '640px';
    footerContent.style.margin = '0 auto';
    footerContent.style.textAlign = 'center';
    
    // 创建版权信息
    const copyright = document.createElement('div');
    // 使用Unicode转义序列避免中文编码问题
    copyright.innerHTML = '© 2025 WE1ZARD \u4fdd\u7559\u6240\u6709\u6743\u5229.';
    
    // 组装页脚结构
    footerContent.appendChild(copyright);
    footer.appendChild(footerContent);
    
    // 检查页面是否已经有底部间距div
    let bottomSpacing = document.querySelector('div[style*="height: 80px"]');
    if (!bottomSpacing) {
        // 创建底部间距div
        bottomSpacing = document.createElement('div');
        bottomSpacing.style.height = '80px';
        // 在页脚之前添加底部间距
        document.body.appendChild(bottomSpacing);
        console.log('添加了底部间距div');
    }
    
    // 将页脚添加到页面
    document.body.appendChild(footer);
    
    console.log('成功创建并添加了固定页脚和底部间距');
    
    // 创建悬浮按钮容器
    const floatingButtons = document.createElement('div');
    floatingButtons.id = 'floating-action-buttons';
    floatingButtons.style.position = 'fixed'; // 保持固定定位
    floatingButtons.style.top = '50%'; // 整体下移到屏幕下方
    floatingButtons.style.left = '50%';
    // 仅水平居中，不再向上移动
    floatingButtons.style.transform = 'translate(-50%, -50%)';
    floatingButtons.style.zIndex = '9998';
    floatingButtons.style.display = 'none'; // 默认隐藏
    floatingButtons.style.opacity = '0';
    floatingButtons.style.transition = 'opacity 0.3s ease-in-out';
    floatingButtons.style.backgroundColor = '#051427';
    floatingButtons.style.border = '1px solid rgba(59, 130, 246, 0.2)';
    floatingButtons.style.borderRadius = '8px';
    floatingButtons.style.padding = '20px 20px 15px 20px'; // 调整内边距
    floatingButtons.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
    floatingButtons.style.textAlign = 'center';
    // 注意：这里不需要再设置position: relative，因为关闭按钮的定位会相对于fixed容器
    floatingButtons.style.minWidth = '280px'; // 减小最小宽度，适应移动设备
    floatingButtons.style.maxWidth = '90%'; // 使用百分比最大宽度，适应不同屏幕
    floatingButtons.style.boxSizing = 'border-box'; // 确保padding不影响宽度
    
    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '-48px'; // 调整到框外右上角
    closeButton.style.right = '-48px';
    closeButton.style.width = '48px'; // 增大关闭按钮，避免误触
    closeButton.style.height = '48px';
    closeButton.style.borderRadius = '50%';
    closeButton.style.backgroundColor = 'rgba(59, 130, 246, 0.8)';
    closeButton.style.color = '#FFFFFF';
    closeButton.style.border = '2px solid rgba(255, 255, 255, 0.8)';
    closeButton.style.fontSize = '36px'; // 调整字体大小，使×更居中
    closeButton.style.lineHeight = '44px'; // 调整行高，略小于高度，使×垂直居中
    closeButton.style.textAlign = 'center'; // 确保水平居中
    closeButton.style.cursor = 'pointer';
    closeButton.style.transition = 'all 0.3s ease';
    closeButton.style.zIndex = '9999';
    closeButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)'; // 添加阴影，提高可见度
    
    // 添加关闭按钮悬停效果
    closeButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(59, 130, 246, 0.5)';
        this.style.color = '#3B82F6';
        this.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';
    });
    
    closeButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
        this.style.color = '#9CA3AF';
        this.style.boxShadow = 'none';
    });
    
    // 添加关闭按钮点击事件
    closeButton.addEventListener('click', function() {
        floatingButtons.style.opacity = '0';
        setTimeout(() => {
            floatingButtons.style.display = 'none';
        }, 300);
        // 添加一个标志，防止滚动事件重新显示按钮
        floatingButtons.dataset.hide = 'true';
    });
    
    // 将关闭按钮添加到悬浮容器
    floatingButtons.appendChild(closeButton);
    
    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8';
    buttonContainer.style.width = 'auto';
    buttonContainer.style.maxWidth = '360px';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.margin = '0 auto'; // 确保容器居中
    
    // 创建加入Q群按钮（合并QRCode和文本）
    const qqButton = document.createElement('a');
    qqButton.href = 'https://qm.qq.com/q/TzIMB20la2';
    qqButton.target = '_blank';
    qqButton.style.display = 'flex';
    qqButton.style.flexDirection = 'column';
    qqButton.style.alignItems = 'center';
    qqButton.style.width = 'auto';
    qqButton.style.minWidth = '150px';
    qqButton.style.maxWidth = '250px';
    qqButton.style.padding = '12px';
    qqButton.style.backgroundColor = '#051427';
    qqButton.style.border = '1px solid rgba(59, 130, 246, 0.5)';
    qqButton.style.borderRadius = '8px';
    qqButton.style.color = '#9CA3AF';
    qqButton.style.fontSize = '14px';
    qqButton.style.textAlign = 'center';
    qqButton.style.textDecoration = 'none';
    qqButton.style.transition = 'all 0.3s ease';
    qqButton.style.margin = '0 auto'; // 确保按钮居中
    
    // QQ群QRCode图片
    const qqQrCode = document.createElement('img');
    qqQrCode.src = '/img/qr_qq.png';
    qqQrCode.alt = 'QQ\u7fa4\u4e8c\u7ef4\u7801';
    qqQrCode.style.width = '100%';
    qqQrCode.style.height = 'auto';
    qqQrCode.style.maxHeight = '180px';
    qqQrCode.style.marginBottom = '10px';
    qqQrCode.style.borderRadius = '4px';
    // 移除QRCode图片的边框
    qqQrCode.style.objectFit = 'contain'; // 保持图片比例
    
    // 按钮文本
    const qqButtonText = document.createElement('span');
    qqButtonText.textContent = '\u52a0\u5165Q\u7fa4';
    qqButtonText.style.display = 'block';
    
    // 组装QQ群按钮
    qqButton.appendChild(qqQrCode);
    qqButton.appendChild(qqButtonText);
    
    // 添加悬停效果
    qqButton.addEventListener('mouseenter', function() {
        this.style.color = '#3B82F6';
        this.style.borderColor = '#3B82F6';
        this.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.4)';
    });
    
    qqButton.addEventListener('mouseleave', function() {
        this.style.color = '#9CA3AF';
        this.style.borderColor = 'rgba(59, 130, 246, 0.5)';
        this.style.boxShadow = 'none';
    });
    
    // 创建请我喝咖啡按钮（合并QRCode和文本）
    const coffeeButton = document.createElement('a');
    coffeeButton.href = 'https://afdian.com/a/weizard/plan';
    coffeeButton.target = '_blank';
    coffeeButton.style.display = 'flex';
    coffeeButton.style.flexDirection = 'column';
    coffeeButton.style.alignItems = 'center';
    coffeeButton.style.width = 'auto';
    coffeeButton.style.minWidth = '150px';
    coffeeButton.style.maxWidth = '250px';
    coffeeButton.style.padding = '12px';
    coffeeButton.style.backgroundColor = '#051427';
    coffeeButton.style.border = '1px solid rgba(59, 130, 246, 0.5)';
    coffeeButton.style.borderRadius = '8px';
    coffeeButton.style.color = '#9CA3AF';
    coffeeButton.style.fontSize = '14px';
    coffeeButton.style.textAlign = 'center';
    coffeeButton.style.textDecoration = 'none';
    coffeeButton.style.transition = 'all 0.3s ease';
    coffeeButton.style.margin = '0 auto'; // 确保按钮居中
    
    // 请我喝咖啡QRCode图片
    const coffeeQrCode = document.createElement('img');
    coffeeQrCode.src = '/img/qr_afdian.png';
    coffeeQrCode.alt = '\u8bf7\u6211\u559d\u5496\u5561\u4e8c\u7ef4\u7801';
    coffeeQrCode.style.width = '100%';
    coffeeQrCode.style.height = 'auto';
    coffeeQrCode.style.maxHeight = '180px';
    coffeeQrCode.style.marginBottom = '10px';
    coffeeQrCode.style.borderRadius = '4px';
    // 移除QRCode图片的边框
    coffeeQrCode.style.objectFit = 'contain'; // 保持图片比例
    
    // 按钮文本
    const coffeeButtonText = document.createElement('span');
    coffeeButtonText.textContent = '\u8bf7\u6211\u559d\u5496\u5561';
    coffeeButtonText.style.display = 'block';
    
    // 组装请我喝咖啡按钮
    coffeeButton.appendChild(coffeeQrCode);
    coffeeButton.appendChild(coffeeButtonText);
    
    // 添加悬停效果
    coffeeButton.addEventListener('mouseenter', function() {
        this.style.color = '#3B82F6';
        this.style.borderColor = '#3B82F6';
        this.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.4)';
    });
    
    coffeeButton.addEventListener('mouseleave', function() {
        this.style.color = '#9CA3AF';
        this.style.borderColor = 'rgba(59, 130, 246, 0.5)';
        this.style.boxShadow = 'none';
    });
    
    // 组装按钮容器
    buttonContainer.appendChild(qqButton);
    buttonContainer.appendChild(coffeeButton);
    
    // 将按钮容器添加到悬浮容器
    floatingButtons.appendChild(buttonContainer);
    
    // 将悬浮容器添加到页面
    document.body.appendChild(floatingButtons);
    
    console.log('成功创建并添加了悬浮按钮和QRCode');
    
    // 添加媒体查询，在移动端只放大关闭按钮
    const mediaQuery = window.matchMedia('(max-width: 768px)'); // 移动设备断点
    
    // 定义处理函数
    function handleMediaQueryChange(e) {
        if (e.matches) {
            // 移动端：整个悬浮按钮框保持50%大小，关闭按钮放大
            floatingButtons.style.transform = 'translate(-50%, -50%) scale(0.5)';
            closeButton.style.width = '40px'; // 放大关闭按钮
            closeButton.style.height = '40px';
            closeButton.style.fontSize = '28px';
            closeButton.style.lineHeight = '36px';
            closeButton.style.textAlign = 'center'; // 确保水平居中
            closeButton.style.top = '-20px'; // 调整位置以适应放大后的关闭按钮
            closeButton.style.right = '-20px';
        } else {
            // 电脑端：恢复原始大小
            floatingButtons.style.transform = 'translate(-50%, -50%)';
            closeButton.style.width = '32px'; // 恢复原始关闭按钮大小
            closeButton.style.height = '32px';
            closeButton.style.fontSize = '22px';
            closeButton.style.lineHeight = '28px';
            closeButton.style.textAlign = 'center'; // 确保水平居中
            closeButton.style.top = '-14px'; // 恢复原始位置
            closeButton.style.right = '-14px';
        }
    }
    
    // 初始执行一次
    handleMediaQueryChange(mediaQuery);
    
    // 添加事件监听
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    
    // 检查是否在error.html页面
    const isErrorPage = window.location.pathname.endsWith('/error.html') || window.location.pathname.endsWith('/tool/error.html');
    
    // 检查是否在index.html页面
    const isIndexPage = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/';
    
    // 检查是否在feedback.html页面
    const isFeedbackPage = window.location.pathname.endsWith('/feedback.html');
    
    // 只有在非index.html和非feedback.html页面添加弹窗机制
    if (!isIndexPage && !isFeedbackPage) {
        // 设置60秒计时器，页面停留时间超过60秒后显示悬浮按钮
        const popupTimer = setTimeout(() => {
            // 检查是否有隐藏标志，如果有则不显示按钮
            if (floatingButtons.dataset.hide !== 'true') {
                // 检查虚拟键盘是否打开：比较当前窗口高度与初始高度
                const initialWindowHeight = window.innerHeight;
                const currentWindowHeight = window.innerHeight;
                const isKeyboardOpen = initialWindowHeight - currentWindowHeight > 200;
                
                if (!isKeyboardOpen) {
                    floatingButtons.style.display = 'block';
                    // 使用setTimeout确保display属性已生效，然后再修改opacity
                    setTimeout(() => {
                        floatingButtons.style.opacity = '1';
                    }, 10);
                }
            }
        }, 60000); // 60秒后显示
        
        // 清除计时器的清理函数
        const cleanup = () => {
            clearTimeout(popupTimer);
        };
        
        // 当用户离开页面时清除计时器
        window.addEventListener('beforeunload', cleanup);
    } else {
        // 在index.html或feedback.html页面，不自动显示悬浮按钮
        console.log(`在${isIndexPage ? 'index.html' : 'feedback.html'}页面，不自动显示悬浮按钮`);
    }
});

// 添加开关拖动功能
(function() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        // 获取所有自定义开关（checkbox）
        const toggles = document.querySelectorAll('input[type="checkbox"]');
        
        // 为每个开关添加拖动功能
        toggles.forEach(function(toggle) {
            let isDragging = false;
            let startX = 0;
            let currentX = 0;
            
            // 鼠标按下/触摸开始事件
            function handleStart(e) {
                isDragging = true;
                startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                
                // 添加事件监听器
                document.addEventListener('mousemove', handleMove);
                document.addEventListener('touchmove', handleMove, { passive: false });
                document.addEventListener('mouseup', handleEnd);
                document.addEventListener('touchend', handleEnd);
                
                e.preventDefault();
            }
            
            // 鼠标移动/触摸移动事件
            function handleMove(e) {
                if (!isDragging) return;
                
                currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                const toggleWidth = toggle.offsetWidth; // 实时获取最新宽度
                const toggleRect = toggle.getBoundingClientRect();
                const mouseXInToggle = currentX - toggleRect.left;
                const percent = Math.max(0, Math.min(1, mouseXInToggle / toggleWidth));
                
                // 核心修复：模拟点击，同步状态+UI，避免重复触发
                if (percent > 0.5 && !toggle.checked) {
                    toggle.click();
                } else if (percent <= 0.5 && toggle.checked) {
                    toggle.click();
                }
                
                e.preventDefault();
            }
            
            // 鼠标释放/触摸结束事件
            function handleEnd() {
                isDragging = false;
                
                // 移除事件监听器，避免内存泄漏
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('touchmove', handleMove);
                document.removeEventListener('mouseup', handleEnd);
                document.removeEventListener('touchend', handleEnd);
            }
            
            // 绑定初始事件
            toggle.addEventListener('mousedown', handleStart);
            toggle.addEventListener('touchstart', handleStart);
        });
    });
})();