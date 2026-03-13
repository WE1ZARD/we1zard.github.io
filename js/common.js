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
    
    // 悬浮按钮已移除
    console.log('悬浮按钮已移除');
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