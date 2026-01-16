// Cal (Calculator) Script for EMC and GPU DVFS

// 页面加载完成后，为所有输入框添加事件监听器，实现实时计算
window.onload = function() {
    // 获取所有输入框
    const inputs = document.querySelectorAll('input');
    
    // 为每个输入框添加事件监听器
    inputs.forEach(input => {
        input.addEventListener('input', calculateAllVoltages);
    });
    
    // 页面加载时自动计算一次
    calculateAllVoltages();
};

// Memory DVB DVFS Tables (from pcv.hpp and pcv_mariko.cpp)
const EmcDvbTableDefault = [
    { freq: 204000, volts: [637, 637, 637] },    // 204000 Hz
    { freq: 408000, volts: [637, 637, 637] },    // 408000 Hz
    { freq: 800000, volts: [637, 637, 637] },    // 800000 Hz
    { freq: 1065600, volts: [637, 637, 637] },   // 1065600 Hz
    { freq: 1331200, volts: [650, 637, 637] },   // 1331200 Hz
    { freq: 1600000, volts: [675, 650, 637] },   // 1600000 Hz
];

const EmcClkOSLimit = 1600000; // 从代码中推断的默认限制

// Helper function to calculate DVB voltage with shift
function calculateDvbVolt(zero, one, two, voltAdd) {
    // 添加电压最小值限制，确保电压不会过低
    const minVolt = 600;
    return [
        Math.max(Math.min(zero + voltAdd, 1050), minVolt),
        Math.max(Math.min(one + voltAdd, 1025), minVolt),
        Math.max(Math.min(two + voltAdd, 1000), minVolt),
        Math.max(Math.min(two + voltAdd, 1000), minVolt) // 为bracket 3添加第四个元素（使用与bracket 2相同的值）
    ];
}

// 合并计算GPU和内存电压的函数
function calculateAllVoltages() {
    // 显示结果部分
    document.getElementById('result-section').classList.remove('hidden');
    // 先计算内存电压，这样currentSocVoltage变量会被正确设置
    calculateMemVoltages();
    // 然后计算GPU电压
    calculateVoltages();
}

// 用于存储当前内存电压值的全局变量
let currentSocVoltage = 0;

function calculateMemVoltages() {
    // 清除之前的内存结果
    document.getElementById('mem_result').innerHTML = '';
    
    // Get input values with defaults
    let userInputFreq = parseInt(document.getElementById('mem_emcMaxClock').value) || 2133000;
    const emcDvbShift = parseInt(document.getElementById('mem_emcDvbShift').value) || 0;
    
    // 获取当前SOC Speedo值，用于确定对应的bracket
    const speedo = parseInt(document.getElementById('soc_speedo').value) || parseInt(document.getElementById('speedo').value) || 1600;
    
    // 如果输入值小于100000，自动乘以1000转换为Hz
    if (userInputFreq < 100000) {
        userInputFreq *= 1000;
    }

    // Calculate voltage offset
    const voltAdd = 25 * emcDvbShift;

    // Determine the appropriate voltage configuration based on user input
    let selectedVolts = [725, 700, 675]; // Default to 2131200 Hz voltages
    
    // Find the appropriate voltage configuration for the user's frequency
    if (userInputFreq >= 3200000) {
        selectedVolts = calculateDvbVolt(800, 800, 775, voltAdd);
    } else if (userInputFreq >= 2931200) {
        selectedVolts = calculateDvbVolt(800, 775, 750, voltAdd);
    } else if (userInputFreq >= 2665600) {
        selectedVolts = calculateDvbVolt(775, 750, 725, voltAdd);
    } else if (userInputFreq >= 2400000) {
        selectedVolts = calculateDvbVolt(750, 725, 700, voltAdd);
    } else if (userInputFreq >= 2131200) {
        selectedVolts = calculateDvbVolt(725, 700, 675, voltAdd);
    }
    
    // 使用GPU Speedo值计算对应的bracket
    const currentBracket = getSpeedoBracket(speedo);
    
    // 只显示当前bracket的电压值
    const bracketVoltage = selectedVolts[currentBracket];
    
    // 存储当前内存电压值
    currentSocVoltage = bracketVoltage;
    
    // 不显示内存结果，仅作为后台计算
    
    // 返回计算出的内存电压值
    return bracketVoltage;
}

// GPU DVFS Tables (converted from Python)
const gpu_dvfs_table_0 = [
    [ 480000, 0, 0, 0, 0, 0 ],    // 76800 Hz
    [ 480000, 0, 0, 0, 0, 0 ],    // 153600 Hz
    [ 480000, 0, 0, 0, 0, 0 ],    // 230400 Hz
    [ 738712, -7304, -552, 119, -3750, -2 ],    // 307200 Hz
    [ 758712, -7304, -552, 119, -3750, -2 ],    // 384000 Hz
    [ 778712, -7304, -552, 119, -3750, -2 ],    // 460800 Hz
    [ 798712, -7304, -552, 119, -3750, -2 ],    // 537600 Hz
    [ 818712, -7304, -552, 119, -3750, -2 ],    // 614400 Hz
    [ 838712, -7304, -552, 119, -3750, -2 ],    // 691200 Hz
    [ 880210, -7955, -584, 0, -2849, 39 ],    // 768000 Hz
    [ 926398, -8892, -602, -60, -384, -93 ],    // 844800 Hz
    [ 970060, -10108, -614, -179, 1508, -13 ],    // 921600 Hz
    [ 1065665, -16075, -497, -179, 3213, 9 ],    // 998400 Hz
    [ 1132576, -16093, -648, 0, 1077, 40 ],    // 1075200 Hz
    [ 1180029, -14534, -830, 0, 1469, 110 ],    // 1152000 Hz
    [ 1248293, -16383, -859, 0, 3722, 313 ],    // 1228800 Hz
    [ 1286399, -17475, -867, 0, 3681, 559 ]    // 1267200 Hz
];

const gpu_dvfs_table_1 = [
    [ 480000, 0, 0, 0, 0, 0 ],    // 76800 Hz
    [ 480000, 0, 0, 0, 0, 0 ],    // 153600 Hz
    [ 480000, 0, 0, 0, 0, 0 ],    // 230400 Hz
    [ 738712, -7304, -552, 119, -3750, -2 ],    // 307200 Hz
    [ 758712, -7304, -552, 119, -3750, -2 ],    // 384000 Hz
    [ 778712, -7304, -552, 119, -3750, -2 ],    // 460800 Hz
    [ 798712, -7304, -552, 119, -3750, -2 ],    // 537600 Hz
    [ 818712, -7304, -552, 119, -3750, -2 ],    // 614400 Hz
    [ 838712, -7304, -552, 119, -3750, -2 ],    // 691200 Hz
    [ 880210, -7955, -584, 0, -2849, 39 ],    // 768000 Hz
    [ 926398, -8892, -602, -60, -384, -93 ],    // 844800 Hz
    [ 970060, -10108, -614, -179, 1508, -13 ],    // 921600 Hz
    [ 1065665, -16075, -497, -179, 3213, 9 ],    // 998400 Hz
    [ 1132576, -16093, -648, 0, 1077, 40 ],    // 1075200 Hz
    [ 1180029, -14534, -830, 0, 1469, 110 ],    // 1152000 Hz
    [ 1248293, -16383, -859, 0, 3722, 313 ],    // 1228800 Hz
    [ 1286399, -17475, -867, 0, 3681, 559 ]    // 1267200 Hz
];

const gpu_dvfs_table_2 = [
    [ 480000, 0, 0, 0, 0, 0 ],    // 76800 Hz
    [ 480000, 0, 0, 0, 0, 0 ],    // 153600 Hz
    [ 480000, 0, 0, 0, 0, 0 ],    // 230400 Hz
    [ 738712, -7304, -552, 119, -3750, -2 ],    // 307200 Hz
    [ 758712, -7304, -552, 119, -3750, -2 ],    // 384000 Hz
    [ 778712, -7304, -552, 119, -3750, -2 ],    // 460800 Hz
    [ 798712, -7304, -552, 119, -3750, -2 ],    // 537600 Hz
    [ 818712, -7304, -552, 119, -3750, -2 ],    // 614400 Hz
    [ 838712, -7304, -552, 119, -3750, -2 ],    // 691200 Hz
    [ 880210, -7955, -584, 0, -2849, 39 ],    // 768000 Hz
    [ 926398, -8892, -602, -60, -384, -93 ],    // 844800 Hz
    [ 970060, -10108, -614, -179, 1508, -13 ],    // 921600 Hz
    [ 1060665, -16075, -497, -179, 3213, 9 ],    // 998400 Hz
    [ 1061475, -12688, -648, 0, 1077, 40 ],    // 1075200 Hz
    [ 1094475, -12688, -648, 0, 1077, 40 ],    // 1152000 Hz
    [ 1124475, -12688, -648, 0, 1077, 40 ],    // 1228800 Hz
    [ 1142060, -12688, -648, 0, 1077, 40 ],    // 1267200 Hz
    [ 1163644, -12688, -648, 0, 1077, 40 ],    // 1305600 Hz
    [ 1183644, -12688, -648, 0, 1077, 40 ],    // 1344000 Hz
    [ 1201644, -12688, -648, 0, 1077, 40 ],    // 1382400 Hz
    [ 1217644, -12688, -648, 0, 1077, 40 ],    // 1420800 Hz
    [ 1231644, -12688, -648, 0, 1077, 40 ],    // 1459200 Hz
    [ 1243644, -12688, -648, 0, 1077, 40 ],    // 1497600 Hz
    [ 1253644, -12688, -648, 0, 1077, 40 ]     // 1536000 Hz
];

const gpu_freq_table = [76800, 153600, 230400, 307200, 384000, 460800, 537600, 614400, 691200, 768000, 844800, 921600, 998400, 1075200, 1152000, 1228800, 1267200, 1305600, 1344000, 1382400, 1420800, 1459200, 1497600, 1536000];

// Helper functions - Exact match to Python implementation
function round_closest(value, scale) {
    if (value > 0) {
        return Math.floor((value + Math.floor(scale / 2)) / scale);
    } else {
        return Math.floor((value - Math.floor(scale / 2)) / scale);
    }
}

function round5(number) {
    return Math.ceil(number / 5.0) * 5;
}

// 根据用户需求实现GPU Vmin自动计算：按25位一档取整，以1600speedo+2400MHz内存时610mV为基准
// 从 new.html 转换而来的算法
const ramBrackets = [
    [2133, 2200, 2266, 2300, 2366, 2400, 2433, 2466, 2533, 2566, 2600, 2633, 2700, 2733, 2766, 2833, 2866, 2900, 2933, 3033, 3066, 3100],
    [2300, 2366, 2433, 2466, 2533, 2566, 2633, 2700, 2733, 2800, 2833, 2900, 2933, 2966, 3033, 3066, 3100, 3133, 3166, 3200, 3233, 3266],
    [2433, 2466, 2533, 2600, 2666, 2733, 2766, 2800, 2833, 2866, 2933, 2966, 3033, 3066, 3100, 3133, 3166, 3200, 3233, 3300, 3333, 3366],
    [2500, 2533, 2600, 2633, 2666, 2733, 2800, 2866, 2900, 2966, 3033, 3100, 3166, 3200, 3233, 3266, 3300, 3333, 3366, 3400, 3400, 3400]
];

const gpuDvfsArray = [590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770, 780, 790, 800];



function calculateAutoGpuVmin() {
    // 获取内存频率
    const mem_freq_mhz = parseInt(document.getElementById('mem_emcMaxClock').value) || 2133;
    
    // 获取GPU Speedo值
    let speedo = parseInt(document.getElementById('speedo').value) || 1600;
    
    const voltage_offset = parseInt(document.getElementById('offset').value) || 0;
    
    // 计算bracket - 使用与vmin.html完全相同的逻辑
    const bracket = getSpeedoBracket(speedo);
    
    // 获取对应的GPU电压 - 使用与vmin.html完全相同的逻辑
    let vmin = getGpuVoltage(mem_freq_mhz, bracket);
    
    // 应用用户电压偏移
    vmin += voltage_offset;
    
    // 确保结果是5的倍数
    vmin = Math.ceil(vmin / 5) * 5;
    
    // 更新SOC最低电压卡片
    updateSocVminCard(vmin, mem_freq_mhz, bracket);
    
    return vmin;
}

// 更新SOC最低电压显示卡片
function updateSocVminCard(vmin, mem_freq_mhz, bracket) {
    // 使用计算出的内存电压值作为SOC电压
    const soc_voltage = currentSocVoltage;
    
    // 更新电压值
    document.getElementById('soc_vmin_value').textContent = soc_voltage;
    
    // 显示卡片
    document.getElementById('soc_vmin_card').classList.remove('hidden');
}

// 从vmin.html复制的函数 - 确保完全相同的计算逻辑
function getSpeedoBracket(speedo) {
    if (speedo <= 1625) return 0;
    if (speedo <= 1690) return 1;
    if (speedo <= 1754) return 2;
    return 3;
}

function getGpuVoltage(freq, bracket) {
    if (freq < 1601) {
        return 0;
    }

    for (let i = 0; i < 22; i++) {
        if (freq <= ramBrackets[bracket][i]) {
            return gpuDvfsArray[i];
        }
    }

    return 800;
}

function calculateVoltages() {
    // 清除之前的结果
    document.getElementById('gpu_result').innerHTML = '';
    
    // Get input values with defaults
    const speedo = parseInt(document.getElementById('speedo').value) || 1600;
    const table = parseInt(document.getElementById('table').value) || 2;
    const offset = parseInt(document.getElementById('offset').value) || 0;
    
    // 如果没有手动输入vmin值，则自动计算
    let vmin = parseInt(document.getElementById('vmin').value);
    if (isNaN(vmin)) {
        vmin = calculateAutoGpuVmin();
    } else {
        // 获取内存频率和bracket信息
        const mem_freq_mhz = parseInt(document.getElementById('mem_emcMaxClock').value) || 2133;
        const bracket = getSpeedoBracket(speedo);
        
        // 更新SOC最低电压卡片
        updateSocVminCard(vmin, mem_freq_mhz, bracket);
    }

    // Select the appropriate table
    let gpu_dvfs_table;
    if (table === 0) {
        gpu_dvfs_table = JSON.parse(JSON.stringify(gpu_dvfs_table_0));
    } else if (table === 1) {
        gpu_dvfs_table = JSON.parse(JSON.stringify(gpu_dvfs_table_1));
    } else {
        gpu_dvfs_table = JSON.parse(JSON.stringify(gpu_dvfs_table_2));
    }

    // Determine the number of entries
    const num_entries = (table === 2) ? 24 : 17;

    // Apply offset
    for (let i = 0; i < num_entries; i++) {
        gpu_dvfs_table[i][0] -= offset * 1000;
    }

    // Calculate the split point for two columns
    const split_point = Math.ceil(num_entries / 2);

    // Calculate voltages for all entries first
    const entries = [];
    const temp = 60;
    
    for (let entry = 0; entry < num_entries; entry++) {
        const freq = gpu_freq_table[entry] / 1000;
        const c0 = gpu_dvfs_table[entry][0];
        const c1 = gpu_dvfs_table[entry][1];
        const c2 = gpu_dvfs_table[entry][2];
        const c3 = gpu_dvfs_table[entry][3];
        const c4 = gpu_dvfs_table[entry][4];
        const c5 = gpu_dvfs_table[entry][5];
        
        let mv = round_closest(c2 * speedo, 100);
        mv = round_closest((mv + c1) * speedo, 100);
        mv += c0;
        
        let mvt = round_closest(c3 * speedo, 100);
        mvt += c4;
        mvt += round_closest(c5 * temp, 10);
        mvt *= temp;
        mvt = round_closest(mvt, 10);
        
        let final_volt = Math.ceil((mv + mvt) / 1000);
        
        // 对所有频率范围应用Vmin限制
        final_volt = Math.max(final_volt, vmin);

        // 补偿
        if (entry == 11 && speedo >= 1775) { //921
            final_volt += 5;
        }
        if (entry == 12 && speedo >= 1775) { //998.4
            final_volt += 15;
        }
        if (entry == 13 && speedo >= 1775) { //1075.2
            final_volt += 5;
        }
        if (entry == 22 && speedo >= 1700) { //1497.6
            final_volt += 15;
        }
        if (entry == 23 && speedo >= 1700) { //1536.0
            final_volt += 50;
        }
        if (entry == 23 && speedo >= 1800) { //1536.0
            final_volt += 50;
        }
        
        // 确保结果是5的倍数
        final_volt = round5(final_volt);
        
        entries.push({ freq, final_volt });
    }

    // Create two-column layout for GPU results, using items-start to ensure top alignment
    let result = '<div class="grid grid-cols-2 gap-2 items-start">';
    
    // First column
    result += '<table class="w-full text-xs">';
    result += '<thead>';
    result += '<tr>';
    result += '<th scope="col">GPU</th>';
    result += '<th scope="col">mV</th>';
    result += '</tr>';
    result += '</thead>';
    result += '<tbody>';
    
    for (let i = 0; i < split_point; i++) {
        const entry = entries[i];
        result += '<tr>';
        result += `<td>${entry.freq.toFixed(1)}</td>`;
        result += `<td>${entry.final_volt}</td>`;
        result += '</tr>';
    }
    
    result += '</tbody>';
    result += '</table>';
    
    // Second column
    result += '<table class="w-full text-xs">';
    result += '<thead>';
    result += '<tr>';
    result += '<th scope="col">GPU</th>';
    result += '<th scope="col">mV</th>';
    result += '</tr>';
    result += '</thead>';
    result += '<tbody>';
    
    for (let i = split_point; i < entries.length; i++) {
        const entry = entries[i];
        result += '<tr>';
        result += `<td>${entry.freq.toFixed(1)}</td>`;
        result += `<td>${entry.final_volt}</td>`;
        result += '</tr>';
    }
    
    result += '</tbody>';
    result += '</table>';
    
    result += '</div>';
    
    // Display GPU result with same style as SOC voltage card
    document.getElementById('gpu_result').innerHTML = '<div class="w-full p-4 rounded-xl bg-gray-700/40">' + result + '</div>';
    // Action buttons section not needed for this implementation
}