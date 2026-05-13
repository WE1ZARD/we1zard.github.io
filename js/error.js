// Error page specific JavaScript code

// 存储所有错误代码数据
let allErrorCodes = [];

// 页面加载完成后执行初始化
window.addEventListener('load', function() {
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
});

// 加载错误代码数据
async function loadErrorCodes() {
    try {
        // 尝试从Gist获取最新数据
        const gistUrl = 'https://api.github.com/gists/a4b8c01bb453028cd0008f282098f696';
        const response = await fetch(gistUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch Gist data: ${response.status}`);
        }
        
        const gistData = await response.json();
        
        // 从Gist中获取错误代码文本
        const fileContent = gistData.files['homebrew_sysmodules.txt'].content;
        
        // 解析Gist内容并转换为系统需要的格式
        const parsedCodes = parseGistContent(fileContent);
        
        // 也加载本地JSON数据作为补充
        const localResponse = await fetch('/data/error_codes.json');
        if (localResponse.ok) {
            const localCodes = await localResponse.json();
            // 合并数据，优先使用Gist数据
            allErrorCodes = mergeErrorCodes(parsedCodes, localCodes);
        } else {
            // 如果本地数据加载失败，只使用Gist数据
            allErrorCodes = parsedCodes;
        }
        
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
        // 如果从Gist获取数据失败，回退到本地数据
        try {
            const response = await fetch('/data/error_codes.json');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch local data: ${response.status}`);
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
        } catch (localError) {
            const noResults = document.getElementById('no-results');
            
            if (noResults) {
                noResults.style.display = 'block';
                noResults.innerHTML = `<p>加载错误代码数据失败: ${localError.message}</p>`;
            }
        }
    }
}

// 解析Gist内容
function parseGistContent(content) {
    const lines = content.split('\n');
    const codes = [];
    
    // 跳过注释和空行
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === '' || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*/')) {
            continue;
        }
        
        // 格式：CODE\tNAME
        const parts = trimmedLine.split('\t');
        if (parts.length >= 2) {
            codes.push({
                code: parts[0],
                description: parts[1],
                section: 'Homebrew系统模块',
                subsection: '错误代码',
                subsubsection: ''
            });
        }
    }
    
    return codes;
}

// 合并错误代码数据
function mergeErrorCodes(gistCodes, localCodes) {
    const mergedMap = new Map();
    
    // 先添加本地数据
    for (const code of localCodes) {
        mergedMap.set(code.code, code);
    }
    
    // 再添加Gist数据，覆盖本地数据
    for (const code of gistCodes) {
        // 如果本地有相同的代码，但没有描述，则使用Gist的描述
        if (mergedMap.has(code.code) && !mergedMap.get(code.code).description) {
            mergedMap.set(code.code, {
                ...mergedMap.get(code.code),
                description: code.description
            });
        } else {
            mergedMap.set(code.code, code);
        }
    }
    
    return Array.from(mergedMap.values());
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