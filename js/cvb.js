// CVB (Clock, Voltage, Boost) Calculator Script

// Global variables
let allCvbData = {};
let cvbData = [];
let currentTableName = 'marikoCpuDvfsTableSLT';
let selectedFrequency = null;
let frequencies = [];

// Load CVB data from JSON file
async function loadCVBData() {
    try {
        // 使用绝对路径，确保从正确的位置加载数据
        const dataUrl = '/tool/cvb_data.json';
        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // 加载所有table数据
        allCvbData = data;
        
        // 获取第一个table的名称作为默认table
        const tableNames = Object.keys(allCvbData);
        if (tableNames.length > 0) {
            currentTableName = tableNames[0];
        }
        
        // 设置当前table数据
        cvbData = allCvbData[currentTableName];
        
        // Extract unique frequencies and sort them
        frequencies = [...new Set(cvbData.map(item => item.freq))].sort((a, b) => a - b);
        
        // Initialize frequency slider
        const frequencySlider = document.getElementById('frequencySlider');
        const currentFrequencyDisplay = document.getElementById('currentFrequency');
        
        // Set slider properties
        frequencySlider.min = 0;
        frequencySlider.max = frequencies.length - 1;
        frequencySlider.value = frequencies.indexOf(1020000); // Default to 1020 MHz
        
        // Add event listener for slider input
        frequencySlider.addEventListener('input', function() {
            updateFrequencyDisplay(this.value);
        });
        
        // Update display and selected frequency
        updateFrequencyDisplay(frequencySlider.value);
        
        // 设置初始占位符文本（默认使用1020MHz的频率数据）
        const defaultFreqData = cvbData.find(item => item.freq == 1020000);
        if (defaultFreqData) {
            const c0Input = document.getElementById('c0');
            const c1Input = document.getElementById('c1');
            const c2Input = document.getElementById('c2');
            
            // 更新占位符文本，添加参数名称前缀
            c0Input.placeholder = `c0: ${defaultFreqData.c0}`;
            c1Input.placeholder = `c1: ${defaultFreqData.c1}`;
            c2Input.placeholder = `c2: ${defaultFreqData.c2}`;
        }
        
        // 动态生成表格选择下拉框的选项
        const tableSelect = document.getElementById('tableSelect');
        // 清空现有选项
        tableSelect.innerHTML = '';
        
        // 遍历allCvbData的所有键（表格名称）
        for (const tableName in allCvbData) {
            if (Object.hasOwnProperty.call(allCvbData, tableName)) {
                // 创建新的option元素
                const option = document.createElement('option');
                option.value = tableName;
                // 将table名称转换为更友好的显示文本
                let displayName = tableName;
                option.textContent = `Table: ${displayName}`;
                // 将option元素添加到tableSelect中
                tableSelect.appendChild(option);
            }
        }
        
        // 设置默认选中的表格
        tableSelect.value = currentTableName;
        
        // 添加表格选择下拉框的change事件监听器
        tableSelect.addEventListener('change', switchTable);
    } catch (error) {
        console.error('Error loading CVB data:', error);
    }
}

// Update frequency display and selected frequency
function updateFrequencyDisplay(sliderValue) {
    const freq = frequencies[sliderValue];
    selectedFrequency = freq;
    const currentFrequencyDisplay = document.getElementById('currentFrequency');
    currentFrequencyDisplay.textContent = `${(freq / 1000)} MHz`;
    
    // Update input field placeholders based on selected frequency
    const freqData = cvbData.find(item => item.freq == freq);
    if (freqData) {
        const c0Input = document.getElementById('c0');
        const c1Input = document.getElementById('c1');
        const c2Input = document.getElementById('c2');
        
        // 更新占位符文本，添加参数名称前缀
        c0Input.placeholder = `c0: ${freqData.c0}`;
        c1Input.placeholder = `c1: ${freqData.c1}`;
        c2Input.placeholder = `c2: ${freqData.c2}`;
    }
}

// Switch between different tables
function switchTable() {
    const tableSelect = document.getElementById('tableSelect');
    currentTableName = tableSelect.value;
    
    // 更新当前table数据
    cvbData = allCvbData[currentTableName];
    
    // 更新频率列表
    frequencies = [...new Set(cvbData.map(item => item.freq))].sort((a, b) => a - b);
    
    // 更新频率滑块
    const frequencySlider = document.getElementById('frequencySlider');
    frequencySlider.min = 0;
    frequencySlider.max = frequencies.length - 1;
    
    // 设置滑块到1020MHz（如果存在）
    const indexOf1020MHz = frequencies.indexOf(1020000);
    if (indexOf1020MHz !== -1) {
        frequencySlider.value = indexOf1020MHz;
    } else {
        // 如果1020MHz不存在，设置到中间位置
        frequencySlider.value = Math.floor(frequencies.length / 2);
    }
    
    // 更新频率显示、占位符和selectedFrequency
    updateFrequencyDisplay(frequencySlider.value);
    
    // 清空输入框中的值，这样会使用新table中的默认值
    // 保留用户已填写的speedo值
    const c0Input = document.getElementById('c0');
    const c1Input = document.getElementById('c1');
    const c2Input = document.getElementById('c2');
    const scaleInput = document.getElementById('Scale');
    const cvb_mvInput = document.getElementById('cvb_mv');
    
    c0Input.value = '';
    c1Input.value = '';
    c2Input.value = '';
    scaleInput.value = '';
    cvb_mvInput.value = '';
    
    // 直接重新计算结果，确保使用最新的cvbData和selectedFrequency
    calcCVB();
}

// Tegra X1定制版：NVIDIA计算内核 + 高通数值格式 + ÷1000000
function calcCVB() {
    const doms = {
        c0: document.getElementById('c0'), 
        c1: document.getElementById('c1'), 
        c2: document.getElementById('c2'),
        speedo: document.getElementById('speedo'), 
        scale: document.getElementById('Scale'), 
        cvb_mv: document.getElementById('cvb_mv')
    };
    
    const vals = {}; 
    const emptyKeys = []; // 存储所有空项的键
    
    const resultBox = document.getElementById('resultBox'); 
    const resultVal = document.getElementById('resultVal');
    const batchResultBox = document.getElementById('batchResultBox');
    const batchResults = document.getElementById('batchResults');
    
    const decimal = 10000; // 保留4位小数极致精准
    const CVB_BASE = 1000000; // 高通格式必带 百万分母
    
    // Reset result boxes
    resultBox.className = 'hidden';
    resultBox.style.display = 'none'; // 确保隐藏时不占据空间
    batchResultBox.classList.add('hidden');
    batchResultBox.style.display = 'none'; // 确保隐藏时不占据空间
    batchResults.innerHTML = '';

    // 获取当前选择的频率数据
    const defaultFreqData = cvbData.find(item => item.freq == selectedFrequency);
    
    // 读取参数并设置默认值
    for (let key in doms) {
        const dom = doms[key];
        const val = dom.value.trim();
        if (val.toLowerCase() === 'nil') {
            // 当输入框明确输入"nil"时，将参数标记为空，用于反推计算
            vals[key] = null;
            emptyKeys.push(key);
        } else if (val === '') {
            // 当输入框为空时，使用默认值
            if (defaultFreqData) {
                // 如果defaultFreqData存在，优先使用其中的值
                if (key === 'c0') {
                    vals[key] = defaultFreqData.c0;
                } else if (key === 'c1') {
                    vals[key] = defaultFreqData.c1;
                } else if (key === 'c2') {
                    vals[key] = defaultFreqData.c2;
                } else if (key === 'speedo') {
                    vals[key] = 1600; // speedo默认值为1600
                } else if (key === 'scale') {
                    vals[key] = 102.4; // scale默认值为102.4
                } else if (key === 'cvb_mv') {
                    vals[key] = null;
                    emptyKeys.push(key);
                }
            } else {
                // 如果defaultFreqData不存在，使用固定的默认值
                if (key === 'c0') {
                    vals[key] = 853926;
                } else if (key === 'c1') {
                    vals[key] = -20775;
                } else if (key === 'c2') {
                    vals[key] = 113;
                } else if (key === 'speedo') {
                    vals[key] = 1600;
                } else if (key === 'scale') {
                    vals[key] = 102.4;
                } else if (key === 'cvb_mv') {
                    vals[key] = null;
                    emptyKeys.push(key);
                }
            }
        } else {
            vals[key] = Number(val);
            if (isNaN(vals[key])) {
                // 如果输入不是数字，将参数标记为空
                vals[key] = null;
                emptyKeys.push(key);
            }
        }
    }
    
    // 自动补全参数逻辑：如果只有一个参数为空，就反推计算该值
    // 如果有多个参数为空，则为除了cvb_mv之外的参数设置默认值
    if (emptyKeys.length > 1) {
        for (let key in doms) {
            if (vals[key] === null && emptyKeys.includes(key) && key !== 'cvb_mv') {
                // 只有当有多个空参数时，才使用默认值（cvb_mv始终可以为空）
                if (defaultFreqData) {
                    // 如果defaultFreqData存在，优先使用其中的值
                    if (key === 'c0') {
                        vals[key] = defaultFreqData.c0;
                    } else if (key === 'c1') {
                        vals[key] = defaultFreqData.c1;
                    } else if (key === 'c2') {
                        vals[key] = defaultFreqData.c2;
                    } else if (key === 'speedo') {
                        vals[key] = 1600; // speedo默认值为1600
                    } else if (key === 'scale') {
                        vals[key] = 102.4; // scale默认值为102.4
                    }
                } else {
                    // 如果defaultFreqData不存在，使用固定的默认值
                    if (key === 'c0') {
                        vals[key] = 853926;
                    } else if (key === 'c1') {
                        vals[key] = -20775;
                    } else if (key === 'c2') {
                        vals[key] = 113;
                    } else if (key === 'speedo') {
                        vals[key] = 1600;
                    } else if (key === 'scale') {
                        vals[key] = 102.4;
                    }
                }
            }
        }
    }

    // 使用参数值
    const c0 = vals.c0;
    const c1 = vals.c1;
    const c2 = vals.c2;
    const sp = vals.speedo;
    const s = vals.scale;
    const mv = vals.cvb_mv;
    
    let result = 0, resultText = '', isSuccess = true, errorText = '';

    // 验证核心参数：Speedo、Scale、CVB 需要任意2个填写了数值
    const coreParams = [sp, s, mv];
    const filledCoreParams = coreParams.filter(param => param !== null && param !== undefined && param > 0);
    
    // 不再显示弹窗警告，而是继续执行，让用户看到结果或空状态
    
    // 向上取整到5的倍数的辅助函数
    function roundUpTo5(value) {
        return Math.ceil(value / 5) * 5;
    }
    
    // 基础校验：必正参数不能为0/负数，不再显示弹窗警告
    // 如果参数不满足条件，将使用默认值或跳过计算

    // 确保只有一个空项需要计算
    if (emptyKeys.length === 0) {
        // 全部参数都提供了，只计算当前频率的结果
        const ratio = sp / s;
        const innerSum = c0 + c1 * ratio + c2 * ratio * ratio;
        const cvbVoltage = innerSum / CVB_BASE;
        
        result = cvbVoltage;
        resultText = `${cvbVoltage.toFixed(2)} mV`;
        
        // 只显示单个结果，不计算所有频率
        isSuccess = true;
    } else if (emptyKeys.length === 1) {
        // 只有一个空项，计算并显示该空项的值
        const emptyKey = emptyKeys[0];
        
        switch (emptyKey) {
            // ✔ 反算Speedo
            case 'speedo': {
                // 计算速度
                const A = c2;
                const B = c1;
                const C = c0 - (mv * CVB_BASE);
                const delta = B * B - 4 * A * C;
                
                if (delta >= 0) {
                    const sqrtDelta = Math.sqrt(delta);
                    const x1 = (-B + sqrtDelta) / (2 * A);
                    const x2 = (-B - sqrtDelta) / (2 * A);
                    const validX = x1 > 0 ? x1 : (x2 > 0 ? x2 : null);
                    
                    if (validX) {
                        const scale = s;
                        result = validX * scale;
                        resultText = `Speedo = ${Math.round(result)}`;
                        
                        // 计算所有频率的对应值
                        calculateAllFrequencies({...vals, speedo: result}, 'speedo');
                    } else {
                        isSuccess = false;
                        errorText = 'Speedo 计算无效!';
                    }
                } else {
                    isSuccess = false;
                    errorText = 'Speedo 计算无解!';
                }
                break;
            }

            // ✔ 反算Scale
            case 'scale': {
                // 计算缩放因子
                const A = c2;
                const B = c1;
                const C = c0 - (mv * CVB_BASE);
                const deltaScale = B * B - 4 * A * C;
                
                if (deltaScale >= 0) {
                    const sqrtDeltaScale = Math.sqrt(deltaScale);
                    const x1Scale = (-B + sqrtDeltaScale) / (2 * A);
                    const x2Scale = (-B - sqrtDeltaScale) / (2 * A);
                    const scaleValidX = x1Scale > 0 ? x1Scale : (x2Scale > 0 ? x2Scale : null);
                    
                    if (scaleValidX) {
                        const speedo = sp;
                        const scale = speedo / scaleValidX;
                        result = scale;
                        resultText = `Scale: ${Math.round(result * 10000) / 10000}`;
                        
                        // 计算所有频率的对应值
                        calculateAllFrequencies({...vals, scale: result}, 'scale');
                    } else {
                        isSuccess = false;
                        errorText = 'Scale 计算无效!';
                    }
                } else {
                    isSuccess = false;
                    errorText = 'Scale 计算无解!';
                }
                break;
            }

            // ✔ 反算CVB
            case 'cvb_mv': {
                // 计算CVB电压
                const ratio = sp / s;
                const innerSum = c0 + c1 * ratio + c2 * ratio * ratio;
                const cvbVoltage = innerSum / CVB_BASE;
                
                result = cvbVoltage * 1000; // 转换为毫伏
                // 向上取整到5的倍数
                result = roundUpTo5(result);
                resultText = `CVB: ${result} mV`;
                
                // 计算所有频率的对应值
                calculateAllFrequencies({...vals, cvb_mv: result}, 'cvb_mv');
                break;
            }

            // ✔ 反算C0
            case 'c0': {
                const ratioC0 = sp / s;
                result = (mv * CVB_BASE) - (c1 * ratioC0 + c2 * ratioC0 * ratioC0);
                resultText = `C0: ${Math.round(result)}`;
                break;
            }

            // ✔ 反算C1
            case 'c1': {
                const ratioC1 = sp / s;
                result = ( (mv * CVB_BASE - c0) / ratioC1 ) - ( c2 * ratioC1 );
                resultText = `C1: ${Math.round(result)}`;
                break;
            }

            // ✔ 反算C2
            case 'c2': {
                const ratioC2 = sp / s;
                const numerator = (mv * CVB_BASE) - c0 - (c1 * ratioC2);
                result = numerator / (ratioC2 * ratioC2);
                resultText = `C2: ${Math.round(result)}`;
                break;
            }
        }
    } else {
        // 有多个空项，使用默认值继续计算
        // 不再显示弹窗警告
        // 默认计算CVB电压
        const ratio = sp / s;
        const innerSum = c0 + c1 * ratio + c2 * ratio * ratio;
        const cvbVoltage = innerSum / CVB_BASE;
        
        result = cvbVoltage * 1000; // 转换为毫伏
        // 向上取整到5的倍数
        result = roundUpTo5(result);
        resultText = `CVB: ${result} mV`;
        
        // 计算所有频率的对应值
        calculateAllFrequencies({...vals, cvb_mv: result}, 'cvb_mv');
        isSuccess = true;
    }
    
    // 更新结果显示
    if (isSuccess) {
        // 使用与cal.html中SOC计算结果完全相同的样式和结构
        resultBox.className = 'w-full px-4 py-2 bg-blue-700/30 rounded-lg text-blue-300 flex items-center justify-start';
        resultBox.innerHTML = '<div class="text-sm font-bold">' + resultText + '</div>';
    } else {
        resultBox.className = 'cvb-control-item cvb-result-box error';
        resultVal.innerText = resultText;
    }
    
    resultBox.classList.remove('hidden');
    resultBox.style.display = 'flex'; // 显示时恢复flex布局
    resultBox.scrollIntoView({ behavior: 'smooth' });
}

// 计算所有频率对应的结果
function calculateAllFrequencies(vals, calculationType) {
    const batchResultBox = document.getElementById('batchResultBox');
    const batchResults = document.getElementById('batchResults');
    const decimal = 10000; // 保留4位小数极致精准
    const CVB_BASE = 1000000; // 高通格式必带 百万分母
    const splitFrequency = 1581000; // 第二列开始的频率 (kHz)
    
    // 确保batchResultBox在计算结果时显示
    batchResultBox.classList.remove('hidden');
    batchResultBox.style.display = 'block';
    
    // 直接使用提供的值，不设置默认值（已在前面验证过至少有2个非空）
    const speedo = vals.speedo;
    const scale = vals.scale;
    const cvb_mv = vals.cvb_mv;
    
    // 获取唯一的频率列表
    const uniqueFrequencies = [...new Set(cvbData.map(item => item.freq))].sort((a, b) => a - b);
    
    // 收集计算结果数据用于绘制图表
    const calculationResults = [];
    
    // 向上取整到5的倍数的辅助函数
    function roundUpTo5(value) {
        return Math.ceil(value / 5) * 5;
    }
    
    // 计算每个频率的结果用于图表
    uniqueFrequencies.forEach(freq => {
        const freqData = cvbData.find(item => item.freq == freq);
        if (freqData) {
            let resultValue = null;
            
            // 根据计算类型进行计算
            if (calculationType === 'cvb_mv') {
                // 计算电压
                const ratio = speedo / scale;
                const innerSum = freqData.c0 + freqData.c1 * ratio + freqData.c2 * ratio * ratio;
                resultValue = (innerSum / CVB_BASE) * 1000; // 转换为毫伏
                // 向上取整到5的倍数
                resultValue = roundUpTo5(resultValue);
            } else if (calculationType === 'scale') {
                // 计算Scale
                const A = freqData.c2;
                const B = freqData.c1;
                const C = freqData.c0 - (cvb_mv * CVB_BASE);
                const delta = B * B - 4 * A * C;
                
                if (delta >= 0) {
                    const sqrtDelta = Math.sqrt(delta);
                    const x1 = (-B + sqrtDelta) / (2 * A);
                    const x2 = (-B - sqrtDelta) / (2 * A);
                    const validX = x1 > 0 ? x1 : (x2 > 0 ? x2 : null);
                    
                    if (validX) {
                        resultValue = speedo / validX;
                    }
                }
            }
            
            calculationResults.push(resultValue);
        } else {
            calculationResults.push(null);
        }
    });
    
    // 分割频率列表
    const lowFrequencies = uniqueFrequencies.filter(freq => freq < splitFrequency);
    const highFrequencies = uniqueFrequencies.filter(freq => freq >= splitFrequency);
    
    let result = '';
    
    // 只显示指定类型的结果，使用items-start确保两列顶部对齐
    result += '<div class="grid grid-cols-2 gap-2 items-start">';
    result += createFrequencyTable(lowFrequencies, vals, calculationType, speedo, scale, cvb_mv);
    result += createFrequencyTable(highFrequencies, vals, calculationType, speedo, scale, cvb_mv);
    result += '</div>';
    
    // 显示结果，包裹在与cal.js相同的背景容器中
    batchResults.innerHTML = '<div class="w-full p-4 rounded-xl bg-gray-700/40">' + result + '</div>';
    
    // 显示批量结果
    batchResultBox.className = 'mt-2 max-w-[24rem] mx-auto overflow-x-auto';
    batchResultBox.classList.remove('hidden');
    batchResultBox.scrollIntoView({ behavior: 'smooth' });
    
    // 绘制电压曲线图表
    drawVoltageChart(uniqueFrequencies, calculationResults, calculationType);
}

// 绘制电压曲线图表
function drawVoltageChart(frequencies, calculationResults, calculationType) {
    const ctx = document.getElementById('voltageChart').getContext('2d');
    const chartBox = document.getElementById('chartBox');
    
    // 过滤掉无效数据
    const validData = frequencies.map((freq, index) => {
        return {
            freq: freq,
            value: calculationResults[index]
        };
    }).filter(item => item.value !== null && !isNaN(item.value));
    
    // 准备图表数据
    const chartData = {
        labels: validData.map(item => `${(item.freq / 1000).toFixed(0)} MHz`),
        datasets: [{
            label: calculationType === 'cvb_mv' ? '电压 (mV)' : '缩放比例',
            data: validData.map(item => item.value),
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.2,
            pointBackgroundColor: '#60a5fa',
            pointRadius: 3,
            pointHoverRadius: 5
        }]
    };
    
    // 配置图表
    const chartConfig = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'CPU 频率'
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: calculationType === 'cvb_mv' ? '电压 (mV)' : '缩放比例'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            backgroundColor: 'rgba(30, 41, 59, 0.8)'
        }
    };
    
    // 销毁之前的图表实例（如果存在且有destroy方法）
    if (window.voltageChart && typeof window.voltageChart.destroy === 'function') {
        window.voltageChart.destroy();
    }
    
    // 创建新图表
    window.voltageChart = new Chart(ctx, chartConfig);
    
    // 显示图表
    chartBox.classList.remove('hidden');
    chartBox.style.display = 'block';
    chartBox.scrollIntoView({ behavior: 'smooth' });
}

// 创建频率表格的辅助函数
function createFrequencyTable(frequencies, vals, calculationType, speedo, scale, cvb_mv) {
    const CVB_BASE = 1000000;
    
    if (frequencies.length === 0) {
        return '<table class="w-full text-xs"><tbody><tr><td class="text-center p-4 text-gray-400">无数据</td></tr></tbody></table>';
    }
    
    let table = '<table class="w-full text-xs">';
    table += '<thead>';
    table += '<tr>';
    table += '<th scope="col">CPU</th>';
    table += '<th scope="col">';
    table += calculationType === 'cvb_mv' ? 'mV' : 'Scale';
    table += '</th>';
    table += '</tr>';
    table += '</thead>';
    table += '<tbody>';
    
    // 计算每个频率的结果并添加到表格
    frequencies.forEach(freq => {
        const freqData = cvbData.find(item => item.freq == freq);
        if (freqData) {
            let resultValue = null;
            let resultText = '';
            
            // 向上取整到5的倍数的辅助函数
            function roundUpTo5(value) {
                return Math.ceil(value / 5) * 5;
            }
            
            // 根据计算类型进行计算
            if (calculationType === 'cvb_mv') {
                // 计算电压
                const ratio = speedo / scale;
                const innerSum = freqData.c0 + freqData.c1 * ratio + freqData.c2 * ratio * ratio;
                resultValue = (innerSum / CVB_BASE) * 1000; // 转换为毫伏
                // 向上取整到5的倍数
                resultValue = roundUpTo5(resultValue);
                resultText = `${resultValue}`;
            } else if (calculationType === 'scale') {
                // 计算Scale
                const A = freqData.c2;
                const B = freqData.c1;
                const C = freqData.c0 - (cvb_mv * CVB_BASE);
                const delta = B * B - 4 * A * C;
                
                if (delta >= 0) {
                    const sqrtDelta = Math.sqrt(delta);
                    const x1 = (-B + sqrtDelta) / (2 * A);
                    const x2 = (-B - sqrtDelta) / (2 * A);
                    const validX = x1 > 0 ? x1 : (x2 > 0 ? x2 : null);
                    
                    if (validX) {
                        resultValue = speedo / validX;
                        resultText = `${resultValue.toFixed(4)}`;
                    } else {
                        resultText = '无效';
                    }
                } else {
                    resultText = '无解';
                }
            }
            
            // 添加表格行
            table += '<tr>';
            table += `<td class="text-right whitespace-nowrap p-1 text-gray-300">${(freq / 1000).toFixed(1)}</td>`;
            table += `<td class="text-left whitespace-nowrap p-1 text-blue-300">${resultText}</td>`;
            table += '</tr>';
        }
    });
    
    table += '</tbody>';
    table += '</table>';
    
    return table;
}

// Load data when the page is loaded
window.addEventListener('load', async function() {
    try {
        await loadCVBData();
        // 数据加载完成后自动计算
        calcCVB();
    } catch (error) {
        console.error('Error loading CVB data:', error);
    }
});

// Ensure resultBox and batchResultBox are completely hidden on page load
document.addEventListener('DOMContentLoaded', function() {
    const resultBox = document.getElementById('resultBox');
    resultBox.classList.add('hidden');
    resultBox.style.display = 'none'; // 确保初始状态完全不占据空间
    
    const batchResultBox = document.getElementById('batchResultBox');
    batchResultBox.classList.add('hidden');
    batchResultBox.style.display = 'none'; // 确保初始状态完全不占据空间
    
    // 确保图表容器初始时也被隐藏
    const chartBox = document.getElementById('chartBox');
    chartBox.classList.add('hidden');
    chartBox.style.display = 'none'; // 确保初始状态完全不占据空间
});