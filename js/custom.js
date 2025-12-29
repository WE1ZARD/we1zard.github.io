// 自动为页面添加悬浮球、favicon和页脚

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
        favicon.href = getImagePath('/img/favicon.ico');
        favicon.type = 'image/x-icon';
        head.appendChild(favicon);
        console.log('添加了favicon');
    }
    
    // 检查是否已经存在shortcut icon
    if (!document.querySelector('link[rel="shortcut icon"]')) {
        // 创建shortcut icon链接
        const shortcutIcon = document.createElement('link');
        shortcutIcon.rel = 'shortcut icon';
        shortcutIcon.href = getImagePath('/img/favicon.ico');
        shortcutIcon.type = 'image/x-icon';
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
        bottomSpacing.style.height = '20px';
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
    floatingButtons.style.top = '50%'; // 垂直居中基准
    floatingButtons.style.left = '50%';
    // 计算移动距离：按钮文本高度(14px) + 二维码底部外边距(10px) + 二维码高度(150px) + 按钮底部内边距(12px) = 186px
    // 将弹出框往上移动186px，从垂直居中位置调整到新位置
    floatingButtons.style.transform = 'translate(-50%, calc(-50% - 93px))';
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
    closeButton.style.top = '5px'; // 调整到内框右上角
    closeButton.style.right = '5px';
    closeButton.style.width = '28px'; // 略微增大关闭按钮
    closeButton.style.height = '28px';
    closeButton.style.borderRadius = '50%';
    closeButton.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
    closeButton.style.color = '#9CA3AF';
    closeButton.style.border = '1px solid rgba(59, 130, 246, 0.5)';
    closeButton.style.fontSize = '20px';
    closeButton.style.lineHeight = '26px'; // 调整行高使×居中
    closeButton.style.cursor = 'pointer';
    closeButton.style.transition = 'all 0.3s ease';
    closeButton.style.zIndex = '9999';
    
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
    buttonContainer.className = 'grid grid-cols-2 gap-8';
    buttonContainer.style.width = 'auto';
    buttonContainer.style.maxWidth = '360px';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.margin = '0 auto'; // 确保容器居中
    
    // 创建加入Q群按钮（合并QRCode和文本）
    const qqButton = document.createElement('a');
    qqButton.href = 'https://qm.qq.com/q/TzIMB20la2';
    qqButton.target = '_blank';
    qqButton.style.display = 'flex';
    qqButton.style.flexDirection = 'column';
    qqButton.style.alignItems = 'center';
    qqButton.style.width = '150px';
    qqButton.style.padding = '12px';
    qqButton.style.backgroundColor = '#051427';
    qqButton.style.border = '1px solid rgba(59, 130, 246, 0.5)';
    qqButton.style.borderRadius = '8px';
    qqButton.style.color = '#9CA3AF';
    qqButton.style.fontSize = '14px';
    qqButton.style.textAlign = 'center';
    qqButton.style.textDecoration = 'none';
    qqButton.style.transition = 'all 0.3s ease';
    qqButton.style.margin = '0'; // 确保没有额外的外边距
    
    // QQ群QRCode图片
    const qqQrCode = document.createElement('img');
    qqQrCode.src = '/img/qr_qq.png';
    qqQrCode.alt = 'QQ\u7fa4\u4e8c\u7ef4\u7801';
    qqQrCode.style.width = '100%';
    qqQrCode.style.height = 'auto';
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
    coffeeButton.style.width = '150px';
    coffeeButton.style.padding = '12px';
    coffeeButton.style.backgroundColor = '#051427';
    coffeeButton.style.border = '1px solid rgba(59, 130, 246, 0.5)';
    coffeeButton.style.borderRadius = '8px';
    coffeeButton.style.color = '#9CA3AF';
    coffeeButton.style.fontSize = '14px';
    coffeeButton.style.textAlign = 'center';
    coffeeButton.style.textDecoration = 'none';
    coffeeButton.style.transition = 'all 0.3s ease';
    coffeeButton.style.margin = '0'; // 确保没有额外的外边距
    
    // 请我喝咖啡QRCode图片
    const coffeeQrCode = document.createElement('img');
    coffeeQrCode.src = '/img/qr_afdian.png';
    coffeeQrCode.alt = '\u8bf7\u6211\u559d\u5496\u5561\u4e8c\u7ef4\u7801';
    coffeeQrCode.style.width = '100%';
    coffeeQrCode.style.height = 'auto';
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
    
    // 检查是否在error.html页面
    const isErrorPage = window.location.pathname.endsWith('/error.html') || window.location.pathname.endsWith('/p/error.html');
    
    // 检查是否在index.html页面
    const isIndexPage = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/';
    
    // 检查是否在feedback.html页面
    const isFeedbackPage = window.location.pathname.endsWith('/feedback.html');
    
    // 只有在非index.html且非feedback.html页面添加滚动事件监听器，控制悬浮按钮的显示和隐藏
    if (!isIndexPage && !isFeedbackPage) {
        if (isErrorPage) {
            // error.html页面特殊处理：监听window的滚动
            window.addEventListener('scroll', function() {
                // 判断是否滚动到底部
                const scrollHeight = document.documentElement.scrollHeight;
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const clientHeight = document.documentElement.clientHeight;
                
                // 检查是否有隐藏标志，如果有则不显示按钮
                if (floatingButtons.dataset.hide === 'true') {
                    return;
                }
                
                // 当滚动到距离底部100px以内时显示悬浮按钮
                if (scrollHeight - scrollTop - clientHeight < 100) {
                    floatingButtons.style.display = 'block';
                    // 使用setTimeout确保display属性已生效，然后再修改opacity
                    setTimeout(() => {
                        floatingButtons.style.opacity = '1';
                    }, 10);
                } else {
                    floatingButtons.style.opacity = '0';
                    // 当透明度动画结束后隐藏元素
                    setTimeout(() => {
                        if (floatingButtons.style.opacity === '0') {
                            floatingButtons.style.display = 'none';
                        }
                    }, 300);
                }
            });
        } else {
            // 其他非index页面：监听window的滚动
            window.addEventListener('scroll', function() {
                // 判断是否滚动到底部
                const scrollHeight = document.documentElement.scrollHeight;
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const clientHeight = document.documentElement.clientHeight;
                
                // 检查是否有隐藏标志，如果有则不显示按钮
                if (floatingButtons.dataset.hide === 'true') {
                    return;
                }
                
                // 当滚动到距离底部100px以内时显示悬浮按钮
                if (scrollHeight - scrollTop - clientHeight < 100) {
                    floatingButtons.style.display = 'block';
                    // 使用setTimeout确保display属性已生效，然后再修改opacity
                    setTimeout(() => {
                        floatingButtons.style.opacity = '1';
                    }, 10);
                } else {
                    floatingButtons.style.opacity = '0';
                    // 当透明度动画结束后隐藏元素
                    setTimeout(() => {
                        if (floatingButtons.style.opacity === '0') {
                            floatingButtons.style.display = 'none';
                        }
                    }, 300);
                }
            });
        }
    } else {
        console.log('在index.html页面，不显示悬浮按钮');
    }
    
    // Error page specific JavaScript code from error.html
    if (isErrorPage) {
        // 存储所有错误代码数据
        let allErrorCodes = [];

        // 直接执行初始化代码
        // 加载错误代码数据
        loadErrorCodes();
        
        // 添加搜索事件监听
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            // 按下回车键
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchErrorCodes();
                }
            });
            
            // 实时搜索
            searchInput.addEventListener('input', searchErrorCodes);
        }

        // 加载错误代码数据
        async function loadErrorCodes() {
            try {
                // 使用绝对路径加载数据，确保无论页面位置如何都能正确访问
                const response = await fetch('/data/error_codes.json');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                allErrorCodes = await response.json();
                
                // 更新总数
                const totalCount = document.getElementById('total-count');
                if (totalCount) {
                    totalCount.textContent = allErrorCodes.length;
                }
                
                // 初始不显示任何内容，包括未找到提示
                const listContainer = document.getElementById('error-code-list');
                const noResults = document.getElementById('no-results');
                const currentCount = document.getElementById('current-count');
                
                if (listContainer) listContainer.innerHTML = '';
                if (noResults) noResults.style.display = 'none';
                if (currentCount) currentCount.textContent = '0';
            } catch (error) {
                const noResults = document.getElementById('no-results');
                
                if (noResults) {
                    noResults.style.display = 'block';
                    noResults.innerHTML = `<p>加载错误代码数据失败: ${error.message}</p>`;
                }
            }
        }
        
        // 搜索错误代码
        function searchErrorCodes() {
            const searchInput = document.getElementById('search-input');
            const listContainer = document.getElementById('error-code-list');
            const noResults = document.getElementById('no-results');
            const currentCount = document.getElementById('current-count');
            const searchContainer = document.querySelector('.search-container');
            
            if (!searchInput) {
                return;
            }
            
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // 如果搜索框为空，隐藏结果区域和未找到提示
                if (listContainer) listContainer.innerHTML = '';
                if (noResults) noResults.style.display = 'none';
                if (currentCount) currentCount.textContent = '0';
                
                // 清空搜索结果时恢复搜索框居中
                if (searchContainer) {
                    searchContainer.classList.remove('has-content');
                }
                return;
            }
            
            // 模糊搜索
            const filteredCodes = allErrorCodes.filter(code => {
                const match = code.code.toLowerCase().includes(searchTerm) ||
                       code.description.toLowerCase().includes(searchTerm) ||
                       code.section.toLowerCase().includes(searchTerm) ||
                       code.subsection.toLowerCase().includes(searchTerm);
                return match;
            });
            
            // 显示搜索结果
            displayErrorCodes(filteredCodes);
            
            // 如果有搜索结果，添加has-content类
            if (searchContainer && filteredCodes.length > 0) {
                searchContainer.classList.add('has-content');
            }
        }
        
        // 显示错误代码列表
        function displayErrorCodes(codes) {
            const listContainer = document.getElementById('error-code-list');
            const noResults = document.getElementById('no-results');
            const currentCount = document.getElementById('current-count');
            
            // 更新当前显示数量
            if (currentCount) {
                currentCount.textContent = codes.length;
            }
            
            if (codes.length === 0) {
                if (listContainer) listContainer.innerHTML = '';
                if (noResults) noResults.style.display = 'block';
                
                // 无结果时恢复搜索框居中
                const searchContainer = document.querySelector('.search-container');
                if (searchContainer) {
                    searchContainer.classList.remove('has-content');
                }
            } else {
                if (noResults) noResults.style.display = 'none';
                
                // 创建错误代码列表，使用与其他页面相同的样式
                const html = codes.map(code => `
                    <div class="bg-[#051427] border border-blue-500 rounded-md p-4 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 my-2">
                        <div class="text-sm text-gray-500 mb-2">
                            ${escapeHtml(code.section)} - ${escapeHtml(code.subsection)}
                        </div>
                        <div class="text-xl font-bold text-blue-500 mb-3">${escapeHtml(code.code)}</div>
                        <div class="text-gray-300 whitespace-pre-line">${escapeHtml(code.description || ' ')}</div>
                    </div>
                `).join('') + 
                // 在最后添加一个空的结果项，确保最后一个真实结果能完全显示
                '<div class="bg-[#051427] rounded-md p-8 my-2"></div>';
                
                if (listContainer) {
                    listContainer.innerHTML = html;
                }
            }
        }
        
        // HTML转义函数，防止XSS攻击
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }
});