// 自动为页面添加悬浮球和favicon

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

document.addEventListener('DOMContentLoaded', function() {

// -- 自动添加favicon
    const head = document.head;
    
    // 检查是否已经存在favicon
    if (!document.querySelector('link[rel="icon"]')) {
        // 创建favicon链接
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = getImagePath('/img/favicon.ico');
        favicon.type = 'image/x-icon';
        head.appendChild(favicon);
    }
    
    // 检查是否已经存在shortcut icon
    if (!document.querySelector('link[rel="shortcut icon"]')) {
        // 创建shortcut icon链接
        const shortcutIcon = document.createElement('link');
        shortcutIcon.rel = 'shortcut icon';
        shortcutIcon.href = getImagePath('/img/favicon.ico');
        shortcutIcon.type = 'image/x-icon';
        head.appendChild(shortcutIcon);
    }
    
    // 检查是否已经存在apple-touch-icon
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
        // 创建apple-touch-icon链接
        const appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        appleTouchIcon.href = getImagePath('/img/favicon.png');
        head.appendChild(appleTouchIcon);
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
        
        // 验证悬浮球是否存在
        const checkBall = document.querySelector('.floating-ball');
        console.log('悬浮球验证结果:', checkBall ? '存在' : '不存在');
    } else {
        console.log('悬浮球已经存在');
    }
});