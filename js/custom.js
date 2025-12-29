// 自动为页面添加悬浮球和favicon
document.addEventListener('DOMContentLoaded', function() {

// -- 自动添加favicon
    const head = document.head;
    
    // 检查是否已经存在favicon
    if (!document.querySelector('link[rel="icon"]')) {
        // 创建favicon链接
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = '/img/favicon.ico';
        favicon.type = 'image/x-icon';
        head.appendChild(favicon);
    }
    
    // 检查是否已经存在shortcut icon
    if (!document.querySelector('link[rel="shortcut icon"]')) {
        // 创建shortcut icon链接
        const shortcutIcon = document.createElement('link');
        shortcutIcon.rel = 'shortcut icon';
        shortcutIcon.href = '/img/favicon.ico';
        shortcutIcon.type = 'image/x-icon';
        head.appendChild(shortcutIcon);
    }
    
    // 检查是否已经存在apple-touch-icon
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
        // 创建apple-touch-icon链接
        const appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        appleTouchIcon.href = '/img/favicon.png';
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
        img.src = '/img/avatar.png';
        img.alt = 'Home';
        
        // 将图片添加到悬浮球中
        floatingBall.appendChild(img);
        
        // 将悬浮球添加到页面顶部
        document.body.insertBefore(floatingBall, document.body.firstChild);
    }
});