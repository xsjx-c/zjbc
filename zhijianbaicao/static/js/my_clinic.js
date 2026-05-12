// 我的诊室页面交互逻辑

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    // 初始化标签切换
    initTabSwitching();
    
    // 初始化图表
    initCharts();
    
    // 初始化身体示意图
    initBodyDiagram();
    
    // 初始化时间范围切换
    initTimeRangeSwitching();
    
    // 初始化用药提醒功能
    initMedicationReminders();
});

// 初始化标签切换
function initTabSwitching() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有活动状态
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            const targetTab = this.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
            
            // 如果切换到健康仪表盘，重新绘制图表（模拟实时数据更新）
            if (targetTab === 'dashboard') {
                updateCharts();
            }
        });
    });
}

// 初始化时间范围切换
function initTimeRangeSwitching() {
    const timeBtns = document.querySelectorAll('.time-btn');
    
    timeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除同一组按钮的活动状态
            const parent = this.closest('.chart-controls');
            if (parent) {
                const siblings = parent.querySelectorAll('.time-btn');
                siblings.forEach(b => b.classList.remove('active'));
            }
            
            // 添加当前活动状态
            this.classList.add('active');
            
            // 模拟更新图表数据
            updateCharts();
        });
    });
}

// 初始化图表
function initCharts() {
    // 健康雷达图
    initHealthRadarChart();
    
    // 体质饼图
    initConstitutionPieChart();
    
    // 健康趋势图
    initHealthTrendChart();
    
    // 睡眠质量图
    initSleepChart();
    
    // 体重趋势图
    initWeightChart();
    
    // 舌象分析图
    initTongueChart();
    
    // 排便情况图
    initDefecationChart();
    
    // 体质演化图
    initConstitutionEvolutionChart();
    
    // 症状热力图
    initSymptomHeatmapChart();
    
    // 症状趋势图
    initSymptomTrendChart();
    
    // 治疗执行情况图
    initTreatmentAdherenceChart();
    
    // 用药效果评价图
    initMedicationEffectChart();
    
    // 健康问题概览图
    initProblemsChart();
    
    // 健康问题趋势图
    initProblemsTrendChart();
}

// 健康雷达图
function initHealthRadarChart() {
    const ctx = document.getElementById('healthRadarChart').getContext('2d');
    
    window.healthRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['阴阳平衡', '气血水平', '心', '肝', '脾', '肺', '肾'],
            datasets: [
                {
                    label: '当前状态',
                    data: [75, 85, 80, 70, 75, 85, 80],
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: '#3b82f6',
                    borderWidth: 3,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: '理想状态',
                    data: [100, 100, 100, 100, 100, 100, 100],
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    pointLabels: {
                        font: {
                            size: 12
                        },
                        color: '#475569'
                    },
                    ticks: {
                        stepSize: 20,
                        color: '#94a3b8',
                        font: {
                            size: 10
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// 体质饼图
function initConstitutionPieChart() {
    const ctx = document.getElementById('constitutionPieChart').getContext('2d');
    
    const constitutionData = {
        labels: ['气虚质', '痰湿质', '平和质', '气郁质', '阴虚质'],
        datasets: [{
            data: [40, 30, 15, 10, 5],
            backgroundColor: [
                '#f59e0b',  // 气虚质
                '#10b981',  // 痰湿质
                '#3b82f6',  // 平和质
                '#ef4444',  // 气郁质
                '#8b5cf6'   // 阴虚质
            ],
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 10
        }]
    };
    
    window.constitutionPieChart = new Chart(ctx, {
        type: 'pie',
        data: constitutionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        }
    });
    
    // 生成自定义图例
    generateConstitutionLegend(constitutionData);
}

// 生成体质饼图图例
function generateConstitutionLegend(data) {
    const legendContainer = document.getElementById('constitutionLegend');
    legendContainer.innerHTML = '';
    
    data.labels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const colorSpan = document.createElement('span');
        colorSpan.className = 'legend-color';
        colorSpan.style.backgroundColor = data.datasets[0].backgroundColor[index];
        
        const textSpan = document.createElement('span');
        textSpan.textContent = `${label}: ${data.datasets[0].data[index]}%`;
        
        legendItem.appendChild(colorSpan);
        legendItem.appendChild(textSpan);
        legendContainer.appendChild(legendItem);
    });
}

// 健康趋势图
function initHealthTrendChart() {
    const ctx = document.getElementById('healthTrendChart').getContext('2d');
    
    // 生成最近7天的数据
    const dates = [];
    const scores = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        scores.push(75 + Math.random() * 15); // 模拟健康评分
    }
    
    window.healthTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '健康评分',
                data: scores,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 70,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// 睡眠质量图
function initSleepChart() {
    const ctx = document.getElementById('sleepChart').getContext('2d');
    
    const dates = [];
    const sleepQuality = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        sleepQuality.push(6 + Math.random() * 4); // 模拟睡眠质量评分
    }
    
    window.sleepChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: '睡眠质量',
                data: sleepQuality,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// 体重趋势图
function initWeightChart() {
    const ctx = document.getElementById('weightChart').getContext('2d');
    
    const dates = [];
    const weight = [];
    const bmi = [];
    const today = new Date();
    
    let baseWeight = 68;
    let baseBMI = 22;
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        
        const weightChange = (Math.random() - 0.5) * 2;
        baseWeight += weightChange;
        weight.push(parseFloat(baseWeight.toFixed(1)));
        
        const bmiChange = (Math.random() - 0.5) * 0.5;
        baseBMI += bmiChange;
        bmi.push(parseFloat(baseBMI.toFixed(1)));
    }
    
    window.weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '体重 (kg)',
                data: weight,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: 'BMI',
                data: bmi,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: false,
                    min: 65,
                    max: 72,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: false,
                    min: 20,
                    max: 25,
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        maxTicksLimit: 7
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// 舌象分析图
function initTongueChart() {
    const ctx = document.getElementById('tongueChart').getContext('2d');
    
    window.tongueChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['舌色淡红', '苔色白', '苔质薄', '舌体胖大', '齿痕'],
            datasets: [{
                label: '当前舌象',
                data: [75, 60, 55, 80, 70],
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: '#ef4444',
                borderWidth: 3,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#fff',
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// 排便情况图
function initDefecationChart() {
    const ctx = document.getElementById('defecationChart').getContext('2d');
    
    const dates = [];
    const regularity = [];
    const consistency = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        regularity.push(5 + Math.random() * 5); // 规律性评分
        consistency.push(4 + Math.random() * 4); // 性状评分
    }
    
    window.defecationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: '规律性',
                data: regularity,
                backgroundColor: '#3b82f6',
                borderRadius: 6
            }, {
                label: '性状',
                data: consistency,
                backgroundColor: '#10b981',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// 体质演化图
function initConstitutionEvolutionChart() {
    const ctx = document.getElementById('constitutionEvolutionChart').getContext('2d');
    
    window.constitutionEvolutionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: [{
                label: '气虚质',
                data: [60, 55, 50, 45, 42, 40],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                tension: 0.4
            }, {
                label: '痰湿质',
                data: [45, 42, 38, 35, 32, 30],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                tension: 0.4
            }, {
                label: '平和质',
                data: [10, 15, 20, 25, 28, 30],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 70,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// 症状热力图
function initSymptomHeatmapChart() {
    // 使用折线图模拟热力图效果
    const ctx = document.getElementById('symptomHeatmapChart').getContext('2d');
    
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const symptomIntensity = months.map(() => Math.floor(Math.random() * 5));
    
    window.symptomHeatmapChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: '症状强度',
                data: symptomIntensity,
                backgroundColor: symptomIntensity.map(value => {
                    const colors = [
                        'rgba(229, 231, 235, 0.8)', // 0
                        'rgba(254, 226, 226, 0.8)', // 1
                        'rgba(252, 165, 165, 0.8)', // 2
                        'rgba(239, 68, 68, 0.8)',    // 3
                        'rgba(185, 28, 28, 0.8)'     // 4
                    ];
                    return colors[value];
                }),
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        stepSize: 1
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// 症状趋势图
function initSymptomTrendChart() {
    const ctx = document.getElementById('symptomTrendChart').getContext('2d');
    
    const dates = [];
    const symptoms = {
        '头痛': [],
        '疲劳': [],
        '胃胀': []
    };
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        
        symptoms['头痛'].push(Math.floor(Math.random() * 6));
        symptoms['疲劳'].push(Math.floor(Math.random() * 6));
        symptoms['胃胀'].push(Math.floor(Math.random() * 6));
    }
    
    window.symptomTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '头痛',
                data: symptoms['头痛'],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                tension: 0.4
            }, {
                label: '疲劳',
                data: symptoms['疲劳'],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                tension: 0.4
            }, {
                label: '胃胀',
                data: symptoms['胃胀'],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// 治疗执行情况图
function initTreatmentAdherenceChart() {
    const ctx = document.getElementById('treatmentAdherenceChart').getContext('2d');
    
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const adherence = days.map(() => Math.floor(Math.random() * 100));
    
    window.treatmentAdherenceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: '执行率 (%)',
                data: adherence,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// 用药效果评价图
function initMedicationEffectChart() {
    const ctx = document.getElementById('medicationEffectChart').getContext('2d');
    
    window.medicationEffectChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['睡眠改善', '疲劳缓解', '情绪稳定', '食欲增加', '排便正常'],
            datasets: [{
                label: '用药前',
                data: [3, 2, 3, 4, 3],
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: '#ef4444',
                borderWidth: 3,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#fff',
                pointRadius: 6
            }, {
                label: '用药后',
                data: [8, 7, 7, 8, 8],
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3b82f6',
                borderWidth: 3,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// 健康问题概览图
function initProblemsChart() {
    const ctx = document.getElementById('problemsChart').getContext('2d');
    
    window.problemsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['睡眠问题', '饮食不规律', '缺乏运动', '情绪波动', '其他'],
            datasets: [{
                data: [40, 30, 15, 10, 5],
                backgroundColor: [
                    '#ef4444',  // 高危问题 - 红色
                    '#f59e0b',  // 中等风险 - 橙色
                    '#3b82f6',  // 低风险 - 蓝色
                    '#6b7280',  // 低风险 - 灰色
                    '#10b981'   // 低风险 - 绿色
                ],
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        }
    });
}

// 健康问题趋势图
function initProblemsTrendChart() {
    const ctx = document.getElementById('problemsTrendChart').getContext('2d');
    
    // 生成最近7天的数据
    const dates = [];
    const sleepProblems = [];
    const dietProblems = [];
    const exerciseProblems = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        sleepProblems.push(65 + Math.random() * 20);
        dietProblems.push(55 + Math.random() * 25);
        exerciseProblems.push(40 + Math.random() * 30);
    }
    
    window.problemsTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '睡眠问题',
                data: sleepProblems,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                tension: 0.4
            }, {
                label: '饮食不规律',
                data: dietProblems,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                tension: 0.4
            }, {
                label: '缺乏运动',
                data: exerciseProblems,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// 初始化身体示意图
function initBodyDiagram() {
    const bodyDiagram = document.querySelector('.body-diagram');
    if (!bodyDiagram) return;
    
    // 模拟身体部位不适标记
    const painPoints = [
        { x: 40, y: 30, text: '肩颈痛' },
        { x: 60, y: 70, text: '腰痛' },
        { x: 35, y: 60, text: '膝盖痛' }
    ];
    
    painPoints.forEach(point => {
        const marker = document.createElement('div');
        marker.className = 'symptom-marker';
        marker.style.left = `${point.x}%`;
        marker.style.top = `${point.y}%`;
        marker.title = point.text;
        bodyDiagram.appendChild(marker);
    });
}

// 初始化用药提醒功能
function initMedicationReminders() {
    const reminderBtns = document.querySelectorAll('.btn-reminder');
    
    reminderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === '完成') {
                this.textContent = '已完成';
                this.style.backgroundColor = '#10b981';
                this.disabled = true;
                this.parentElement.classList.add('completed');
            }
        });
    });
}

// 更新图表（模拟实时数据）
function updateCharts() {
    // 模拟更新健康雷达图
    if (window.healthRadarChart) {
        window.healthRadarChart.data.datasets[0].data = [
            70 + Math.random() * 15,
            80 + Math.random() * 15,
            75 + Math.random() * 15,
            65 + Math.random() * 15,
            70 + Math.random() * 15,
            80 + Math.random() * 15,
            75 + Math.random() * 15
        ];
        window.healthRadarChart.update();
    }
    
    // 模拟更新健康趋势图
    if (window.healthTrendChart) {
        window.healthTrendChart.data.datasets[0].data = window.healthTrendChart.data.datasets[0].data.map(() => 70 + Math.random() * 30);
        window.healthTrendChart.update();
    }
    
    // 模拟更新健康问题概览图
    if (window.problemsChart) {
        window.problemsChart.data.datasets[0].data = [
            35 + Math.random() * 10,
            25 + Math.random() * 10,
            15 + Math.random() * 5,
            10 + Math.random() * 5,
            5 + Math.random() * 5
        ];
        window.problemsChart.update();
    }
    
    // 模拟更新健康问题趋势图
    if (window.problemsTrendChart) {
        window.problemsTrendChart.data.datasets[0].data = window.problemsTrendChart.data.datasets[0].data.map(() => 60 + Math.random() * 25);
        window.problemsTrendChart.data.datasets[1].data = window.problemsTrendChart.data.datasets[1].data.map(() => 50 + Math.random() * 30);
        window.problemsTrendChart.data.datasets[2].data = window.problemsTrendChart.data.datasets[2].data.map(() => 35 + Math.random() * 35);
        window.problemsTrendChart.update();
    }
}

// 运行诊断功能
function runDiagnostics() {
    // 显示加载状态
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '诊断中...';
    btn.disabled = true;
    
    // 模拟诊断过程
    setTimeout(() => {
        // 更新图表数据
        updateCharts();
        
        // 显示诊断结果
        showNotification('诊断完成！已更新健康问题分析。');
        
        // 恢复按钮状态
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1500);
}

// 刷新诊断结果
function refreshDiagnostics() {
    // 显示加载状态
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '刷新中...';
    btn.disabled = true;
    
    // 模拟刷新过程
    setTimeout(() => {
        // 更新图表数据
        updateCharts();
        
        // 显示刷新结果
        showNotification('诊断结果已刷新！');
        
        // 恢复按钮状态
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1000);
}

// 模拟生成健康报告
function generateHealthReport() {
    alert('健康报告已生成，您可以在健康档案中查看！');
    // 实际实现中，这里可以调用API生成并下载报告
}

// 为增强功能按钮添加事件监听
window.addEventListener('DOMContentLoaded', function() {
    const generateReportBtn = document.querySelector('.feature-card:nth-child(1) .btn-primary');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateHealthReport);
    }
    
    // 在线咨询按钮
    const onlineConsultBtn = document.querySelector('.feature-card:nth-child(2) .btn-primary');
    if (onlineConsultBtn) {
        onlineConsultBtn.addEventListener('click', function() {
            alert('正在为您连接中医医生，请稍候...');
        });
    }
    
    // 查看档案按钮
    const viewRecordsBtn = document.querySelector('.feature-card:nth-child(3) .btn-primary');
    if (viewRecordsBtn) {
        viewRecordsBtn.addEventListener('click', function() {
            alert('正在加载您的健康档案...');
        });
    }
    
    // 初始化预诊报告功能
    initPreDiagnosisReports();
});

// 初始化预诊报告功能
function initPreDiagnosisReports() {
    // 获取报告列表
    getPreDiagnosisReports();
    
    // 刷新报告按钮事件
    const refreshReportsBtn = document.getElementById('refreshReports');
    if (refreshReportsBtn) {
        refreshReportsBtn.addEventListener('click', getPreDiagnosisReports);
    }
    
    // 返回列表按钮事件
    const backToReportsBtn = document.getElementById('backToReports');
    if (backToReportsBtn) {
        backToReportsBtn.addEventListener('click', function() {
            document.getElementById('reportsList').style.display = 'block';
            document.getElementById('reportDetail').style.display = 'none';
        });
    }
}

// 获取预诊报告
async function getPreDiagnosisReports() {
    // 显示加载状态
    const reportsList = document.getElementById('reportsList');
    reportsList.innerHTML = `
        <div style="text-align: center; padding: 50px 0; color: #3b82f6;">
            <div style="display: flex; justify-content: center; margin-bottom: 20px;">
                <div style="width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <p style="font-size: 18px; margin-bottom: 10px;">正在加载报告...</p>
            <p style="color: #6b7280;">AI正在分析您的健康数据，预计需要2-3秒</p>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </div>
    `;
    
    try {
        // 模拟延迟以展示加载效果
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await fetch('/api/get_reports');
        const result = await response.json();
        
        if (result.success) {
            displayReports(result.reports);
        }
    } catch (error) {
        console.error('获取预诊报告失败:', error);
        reportsList.innerHTML = `
            <div class="no-reports">
                <p>加载报告失败，请稍后重试</p>
                <button class="btn btn-primary" onclick="getPreDiagnosisReports()">重新加载</button>
            </div>
        `;
    }
}

// 显示报告列表
function displayReports(reports) {
    const reportsList = document.getElementById('reportsList');
    
    if (reports.length === 0) {
        reportsList.innerHTML = `
            <div class="no-reports">
                <p>暂无预诊报告</p>
                <button class="btn btn-primary" onclick="window.location.href='/voice'">去AI预诊</button>
            </div>
        `;
        return;
    }
    
    // 按时间倒序排序报告
    const sortedReports = reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let reportsHTML = '<div class="reports-grid">';
    
    sortedReports.forEach(report => {
        reportsHTML += `
            <div class="report-card" onclick="viewReportDetail(${report.id})">
                <div class="report-card-header">
                    <h4>中医健康评估报告</h4>
                    <span class="report-date">${report.date}</span>
                </div>
                <div class="report-card-content">
                    <p class="report-patient">姓名：${report.patientInfo.name || '陈先生'}</p>
                    <p class="report-gender">性别：${report.patientInfo.gender || '男'}</p>
                    <p class="report-age">年龄：${report.patientInfo.age || '21岁'}</p>
                    <p class="report-main-complaint">主诉：${report.patientInfo.mainComplaint || '未记录'}</p>
                </div>
                <div class="report-card-footer">
                    <span class="report-status">已完成</span>
                    <button class="btn btn-small" onclick="event.stopPropagation(); viewReportDetail(${report.id})">查看详情</button>
                </div>
            </div>
        `;
    });
    
    reportsHTML += '</div>';
    reportsList.innerHTML = reportsHTML;
}

// 查看报告详情
async function viewReportDetail(reportId) {
    try {
        const response = await fetch(`/api/get_reports`);
        const result = await response.json();
        
        if (result.success) {
            const report = result.reports.find(r => r.id === reportId);
            if (report) {
                displayReportDetail(report);
            }
        }
    } catch (error) {
        console.error('获取报告详情失败:', error);
    }
}

// 显示报告详情
function displayReportDetail(report) {
    const reportDetail = document.getElementById('reportDetail');
    const reportDetailContent = document.getElementById('reportDetailContent');
    
    // 更新报告详情标题
    document.getElementById('reportDetailTitle').textContent = `${report.date} - 中医健康评估报告`;
    
    // 设置报告内容
    reportDetailContent.innerHTML = report.content;
    
    // 显示报告详情，隐藏报告列表
    document.getElementById('reportsList').style.display = 'none';
    reportDetail.style.display = 'block';
}

// 响应式处理
window.addEventListener('resize', function() {
    // 延迟更新图表，避免频繁重绘
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        if (window.healthRadarChart) window.healthRadarChart.resize();
        if (window.constitutionPieChart) window.constitutionPieChart.resize();
        if (window.healthTrendChart) window.healthTrendChart.resize();
        if (window.sleepChart) window.sleepChart.resize();
        if (window.weightChart) window.weightChart.resize();
        if (window.tongueChart) window.tongueChart.resize();
        if (window.defecationChart) window.defecationChart.resize();
        if (window.constitutionEvolutionChart) window.constitutionEvolutionChart.resize();
        if (window.symptomHeatmapChart) window.symptomHeatmapChart.resize();
        if (window.symptomTrendChart) window.symptomTrendChart.resize();
        if (window.treatmentAdherenceChart) window.treatmentAdherenceChart.resize();
        if (window.medicationEffectChart) window.medicationEffectChart.resize();
        if (window.problemsChart) window.problemsChart.resize();
        if (window.problemsTrendChart) window.problemsTrendChart.resize();
    }, 200);
});

// 健康记录功能
window.addEventListener('DOMContentLoaded', function() {
    // 初始化健康记录标签页切换
    initHealthRecordTabs();
    
    // 初始化条件显示功能
    initConditionalDisplay();
    
    // 初始化舌象照片上传预览
    initTonguePhotoUpload();
});

// 初始化健康记录标签页切换
function initHealthRecordTabs() {
    const recordTabBtns = document.querySelectorAll('.record-tab-btn');
    
    recordTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取当前标签页
            const targetTab = this.getAttribute('data-record-tab');
            
            // 获取父容器，找到同组的其他标签页按钮和内容
            const recordTabs = this.closest('.record-tabs');
            if (recordTabs) {
                // 移除同组按钮的活动状态
                const allBtns = recordTabs.querySelectorAll('.record-tab-btn');
                allBtns.forEach(b => b.classList.remove('active'));
                
                // 添加当前按钮的活动状态
                this.classList.add('active');
                
                // 找到标签页的父容器
                const parentContainer = recordTabs.parentElement;
                
                // 在父容器中找到所有相关的内容区域
                const allContents = parentContainer.querySelectorAll('.record-tab-content');
                
                // 移除所有内容的活动状态
                allContents.forEach(content => content.classList.remove('active'));
                
                // 添加目标内容的活动状态
                const targetContent = parentContainer.querySelector(`#${targetTab}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            }
        });
    });
}

// 初始化条件显示功能
function initConditionalDisplay() {
    // 运动情况条件显示
    const exerciseDoneRadios = document.querySelectorAll('input[name="exerciseDone"]');
    exerciseDoneRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const exerciseDetail = this.closest('.exercise-input').querySelector('.exercise-detail');
            if (this.value === '是') {
                exerciseDetail.style.display = 'block';
            } else {
                exerciseDetail.style.display = 'none';
            }
        });
    });
    
    // 中医养生功条件显示
    const qigongDoneRadios = document.querySelectorAll('input[name="qigongDone"]');
    qigongDoneRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const qigongDetail = this.closest('.exercise-input').querySelector('.exercise-detail');
            if (this.value === '是') {
                qigongDetail.style.display = 'block';
            } else {
                qigongDetail.style.display = 'none';
            }
        });
    });
    
    // 中药/中成药条件显示
    const medicationDoneRadios = document.querySelectorAll('input[name="medicationDone"]');
    medicationDoneRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const medicationDetail = this.closest('.medication-item').querySelector('.medication-detail');
            if (this.value === '是') {
                medicationDetail.style.display = 'block';
            } else {
                medicationDetail.style.display = 'none';
            }
        });
    });
    
    // 针灸/推拿等治疗条件显示
    const acupunctureDoneRadios = document.querySelectorAll('input[name="acupunctureDone"]');
    acupunctureDoneRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const acupunctureDetail = this.closest('.medication-item').querySelector('.medication-detail');
            if (this.value === '是') {
                acupunctureDetail.style.display = 'block';
            } else {
                acupunctureDetail.style.display = 'none';
            }
        });
    });
    
    // 天气变化有无不适条件显示
    const weatherChangeRadios = document.querySelectorAll('input[name="weatherChangeReaction"]');
    weatherChangeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const weatherReactionDetail = this.closest('.weather-item').querySelector('.weather-reaction-detail');
            if (this.value === '有') {
                weatherReactionDetail.style.display = 'block';
            } else {
                weatherReactionDetail.style.display = 'none';
            }
        });
    });
}

// 初始化舌象照片上传预览
function initTonguePhotoUpload() {
    const tonguePhotoInput = document.getElementById('tonguePhoto');
    if (tonguePhotoInput) {
        tonguePhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                const input = this; // 保存当前input元素的引用
                reader.onload = function(event) {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.className = 'tongue-photo-preview';
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                    img.style.borderRadius = '6px';
                    
                    // 替换现有内容
                    const container = input.closest('.tongue-photo-section').querySelector('.tongue-photo-container');
                    container.innerHTML = '';
                    container.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// 保存健康记录
function saveHealthRecord() {
    // 收集所有表单数据
    const now = new Date();
    const healthRecord = {
        timestamp: now.toISOString(),
        date: now.toISOString().split('T')[0],
        
        // 身体外在表现
        external: {
            tongue: {
                photo: null, // 实际应用中应上传到服务器并保存URL
                color: document.querySelector('input[name="tongueColor"]:checked')?.value,
                shape: Array.from(document.querySelectorAll('input[name="tongueShape"]:checked')).map(cb => cb.value),
                coatingColor: document.querySelector('input[name="coatingColor"]:checked')?.value,
                coatingTexture: Array.from(document.querySelectorAll('input[name="coatingTexture"]:checked')).map(cb => cb.value)
            },
            faceColor: document.querySelector('input[name="faceColor"]:checked')?.value,
            mentalState: document.querySelector('input[name="mentalState"]:checked')?.value
        },
        
        // 生理感受与症状
        physiological: {
            sleep: {
                sleepTime: document.querySelector('input[name="sleepTime"]')?.value,
                wakeTime: document.querySelector('input[name="wakeTime"]')?.value,
                difficulty: document.querySelector('input[name="sleepDifficulty"]:checked')?.value,
                quality: document.querySelector('input[name="sleepQuality"]:checked')?.value
            },
            appetite: document.querySelector('input[name="appetite"]:checked')?.value,
            bowel: {
                frequency: document.querySelector('input[name="bowelFrequency"]:checked')?.value,
                consistency: document.querySelector('input[name="bowelConsistency"]:checked')?.value,
                feeling: Array.from(document.querySelectorAll('input[name="bowelFeeling"]:checked')).map(cb => cb.value)
            },
            urine: {
                color: document.querySelector('input[name="urineColor"]:checked')?.value,
                feeling: document.querySelector('input[name="urineFeeling"]:checked')?.value
            },
            pain: {
                location: Array.from(document.querySelectorAll('input[name="painLocation"]:checked')).map(cb => cb.value),
                nature: Array.from(document.querySelectorAll('input[name="painNature"]:checked')).map(cb => cb.value),
                intensity: document.querySelector('input[name="painIntensity"]:checked')?.value
            }
        },
        
        // 情绪与女性专属
        emotion: {
            joy: document.querySelector('input[name="emotionJoy"]')?.value,
            calm: document.querySelector('input[name="emotionCalm"]')?.value,
            anger: document.querySelector('input[name="emotionAnger"]')?.value,
            anxiety: document.querySelector('input[name="emotionAnxiety"]')?.value,
            worry: document.querySelector('input[name="emotionWorry"]')?.value,
            sadness: document.querySelector('input[name="emotionSadness"]')?.value
        },
        
        // 女性专属（如果需要）
        women: {
            menstruation: {
                start: document.querySelector('input[name="menstruationStart"]')?.value,
                end: document.querySelector('input[name="menstruationEnd"]')?.value,
                amount: document.querySelector('input[name="menstruationAmount"]:checked')?.value,
                color: document.querySelector('input[name="menstruationColor"]:checked')?.value,
                texture: document.querySelector('input[name="menstruationTexture"]:checked')?.value,
                symptoms: Array.from(document.querySelectorAll('input[name="menstruationSymptom"]:checked')).map(cb => cb.value)
            },
            leucorrhea: {
                amount: document.querySelector('input[name="leucorrheaAmount"]:checked')?.value,
                color: document.querySelector('input[name="leucorrheaColor"]:checked')?.value,
                texture: document.querySelector('input[name="leucorrheaTexture"]:checked')?.value,
                smell: document.querySelector('input[name="leucorrheaSmell"]:checked')?.value
            }
        },
        
        // 生活方式与调理执行
        lifestyle: {
            diet: {
                cold: document.querySelector('input[name="dietCold"]:checked')?.value,
                spicy: document.querySelector('input[name="dietSpicy"]:checked')?.value,
                alcohol: document.querySelector('input[name="dietAlcohol"]:checked')?.value
            },
            exercise: {
                done: document.querySelector('input[name="exerciseDone"]:checked')?.value,
                type: document.querySelector('select[name="exerciseType"]')?.value,
                duration: document.querySelector('input[name="exerciseDuration"]')?.value
            },
            qigong: {
                done: document.querySelector('input[name="qigongDone"]:checked')?.value,
                type: document.querySelector('select[name="qigongType"]')?.value,
                duration: document.querySelector('input[name="qigongDuration"]')?.value
            },
            selfCare: Array.from(document.querySelectorAll('input[name="selfCare"]:checked')).map(cb => cb.value),
            selfCareDetail: document.querySelector('textarea[name="selfCareDetail"]')?.value,
            medication: {
                done: document.querySelector('input[name="medicationDone"]:checked')?.value,
                name: document.querySelector('input[name="medicationName"]')?.value,
                dose: document.querySelector('input[name="medicationDose"]')?.value
            },
            acupuncture: {
                done: document.querySelector('input[name="acupunctureDone"]:checked')?.value,
                type: document.querySelector('input[name="acupunctureType"]')?.value
            }
        },
        
        // 环境与关键事件
        environment: {
            weatherSensitivity: document.querySelector('input[name="weatherSensitivity"]:checked')?.value,
            weatherChangeReaction: document.querySelector('input[name="weatherChangeReaction"]:checked')?.value,
            weatherChangeDetail: document.querySelector('textarea[name="weatherChangeDetail"]')?.value,
            majorEvent: document.querySelector('textarea[name="majorEvent"]')?.value
        }
    };
    
    // 保存到本地存储（实际应用中应发送到服务器）
    saveRecordToLocalStorage(healthRecord);
    
    // 显示成功提示
    showNotification('健康记录保存成功！');
}

// 保存记录到本地存储
function saveRecordToLocalStorage(record) {
    // 获取现有记录
    let records = JSON.parse(localStorage.getItem('healthRecords')) || [];
    
    // 添加新记录
    records.push(record);
    
    // 只保留最近365天的记录
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    records = records.filter(r => new Date(r.timestamp) >= oneYearAgo);
    
    // 保存回本地存储
    localStorage.setItem('healthRecords', JSON.stringify(records));
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 2秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// 初始化健康记录相关功能
window.addEventListener('DOMContentLoaded', function() {
    // 初始化记录日期过滤器，默认为今天
    const recordDateFilter = document.getElementById('recordDateFilter');
    if (recordDateFilter) {
        const today = new Date().toISOString().split('T')[0];
        recordDateFilter.value = today;
    }
});

// 切换记录查看视图
function toggleRecordView() {
    const recordViewSection = document.getElementById('recordViewSection');
    const healthRecordContent = document.querySelector('.health-record-content');
    
    if (recordViewSection.style.display === 'none') {
        // 显示记录查看区域，隐藏记录输入区域
        recordViewSection.style.display = 'block';
        healthRecordContent.style.display = 'none';
        
        // 加载当天的记录
        loadHealthRecords();
    } else {
        // 显示记录输入区域，隐藏记录查看区域
        recordViewSection.style.display = 'none';
        healthRecordContent.style.display = 'block';
    }
}

// 加载健康记录
function loadHealthRecords() {
    const recordDateFilter = document.getElementById('recordDateFilter');
    const selectedDate = recordDateFilter.value;
    
    // 从本地存储获取所有记录
    const allRecords = JSON.parse(localStorage.getItem('healthRecords')) || [];
    
    // 过滤出选中日期的记录
    const filteredRecords = allRecords.filter(record => {
        // 使用本地时间来获取记录日期，避免UTC转换导致的日期偏移
        const recordDate = new Date(record.timestamp);
        const year = recordDate.getFullYear();
        const month = String(recordDate.getMonth() + 1).padStart(2, '0');
        const day = String(recordDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate === selectedDate;
    });
    
    // 按时间倒序排序
    filteredRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // 显示记录
    displayRecords(filteredRecords);
}

// 显示记录列表
function displayRecords(records) {
    const recordList = document.getElementById('recordList');
    
    if (records.length === 0) {
        recordList.innerHTML = '<div class="no-records">暂无记录</div>';
        return;
    }
    
    let html = '';
    
    records.forEach(record => {
        // 获取本地日期，避免UTC转换导致的日期偏移
        const localDate = new Date(record.timestamp);
        const recordDisplayDate = localDate.toLocaleDateString('zh-CN');
        
        html += `
            <div class="record-item">
                <div class="record-header">
                    <span class="record-date">${recordDisplayDate}</span>
                    <span class="record-time">${localDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="record-content">
        `;
        
        // 身体外在表现
        if (record.external) {
            html += `
                <div class="record-section">
                    <div class="record-section-title">身体外在表现</div>
                    <div class="record-section-content">
                        ${record.external.mentalState ? `<p>精神状态：${record.external.mentalState}</p>` : ''}
                        ${record.external.faceColor ? `<p>面部气色：${record.external.faceColor}</p>` : ''}
                        ${record.external.tongue ? `
                            <p>舌象：
                                ${record.external.tongue.color ? `色 ${record.external.tongue.color}，` : ''}
                                ${record.external.tongue.shape && record.external.tongue.shape.length > 0 ? `形 ${record.external.tongue.shape.join('、')}，` : ''}
                                ${record.external.tongue.coatingColor ? `苔色 ${record.external.tongue.coatingColor}，` : ''}
                                ${record.external.tongue.coatingTexture && record.external.tongue.coatingTexture.length > 0 ? `苔质 ${record.external.tongue.coatingTexture.join('、')}` : ''}
                            </p>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        // 生理感受与症状
        if (record.physiological) {
            html += `
                <div class="record-section">
                    <div class="record-section-title">生理感受与症状</div>
                    <div class="record-section-content">
                        ${record.physiological.appetite ? `<p>食欲：${record.physiological.appetite}</p>` : ''}
                        ${record.physiological.sleep ? `
                            <p>睡眠：
                                ${record.physiological.sleep.sleepTime ? `入睡 ${record.physiological.sleep.sleepTime}，` : ''}
                                ${record.physiological.sleep.wakeTime ? `起床 ${record.physiological.sleep.wakeTime}，` : ''}
                                ${record.physiological.sleep.difficulty ? `入睡${record.physiological.sleep.difficulty}，` : ''}
                                ${record.physiological.sleep.quality ? `质量 ${record.physiological.sleep.quality}` : ''}
                            </p>
                        ` : ''}
                        ${record.physiological.bowel ? `
                            <p>大便：
                                ${record.physiological.bowel.frequency ? `${record.physiological.bowel.frequency}，` : ''}
                                ${record.physiological.bowel.consistency ? `${record.physiological.bowel.consistency}，` : ''}
                                ${record.physiological.bowel.feeling && record.physiological.bowel.feeling.length > 0 ? `感受 ${record.physiological.bowel.feeling.join('、')}` : ''}
                            </p>
                        ` : ''}
                        ${record.physiological.urine ? `
                            <p>小便：
                                ${record.physiological.urine.color ? `${record.physiological.urine.color}，` : ''}
                                ${record.physiological.urine.feeling ? `${record.physiological.urine.feeling}` : ''}
                            </p>
                        ` : ''}
                        ${record.physiological.pain && (record.physiological.pain.location || record.physiological.pain.nature || record.physiological.pain.intensity) ? `
                            <p>身体不适：
                                ${record.physiological.pain.location && record.physiological.pain.location.length > 0 ? `部位 ${record.physiological.pain.location.join('、')}，` : ''}
                                ${record.physiological.pain.nature && record.physiological.pain.nature.length > 0 ? `性质 ${record.physiological.pain.nature.join('、')}，` : ''}
                                ${record.physiological.pain.intensity ? `强度 ${record.physiological.pain.intensity}` : ''}
                            </p>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        // 情绪状态
        if (record.emotion) {
            const emotions = [];
            if (record.emotion.joy && record.emotion.joy > 0) emotions.push(`愉悦 ${record.emotion.joy}分`);
            if (record.emotion.calm && record.emotion.calm > 0) emotions.push(`平静 ${record.emotion.calm}分`);
            if (record.emotion.anger && record.emotion.anger > 0) emotions.push(`烦躁 ${record.emotion.anger}分`);
            if (record.emotion.anxiety && record.emotion.anxiety > 0) emotions.push(`焦虑 ${record.emotion.anxiety}分`);
            if (record.emotion.worry && record.emotion.worry > 0) emotions.push(`思虑 ${record.emotion.worry}分`);
            if (record.emotion.sadness && record.emotion.sadness > 0) emotions.push(`悲伤 ${record.emotion.sadness}分`);
            
            if (emotions.length > 0) {
                html += `
                    <div class="record-section">
                        <div class="record-section-title">情绪状态</div>
                        <div class="record-section-content">
                            <p>${emotions.join('，')}</p>
                        </div>
                    </div>
                `;
            }
        }
        
        // 生活方式
        if (record.lifestyle) {
            const lifestyleItems = [];
            if (record.lifestyle.diet) {
                if (record.lifestyle.diet.cold) lifestyleItems.push(`生冷：${record.lifestyle.diet.cold}`);
                if (record.lifestyle.diet.spicy) lifestyleItems.push(`辛辣：${record.lifestyle.diet.spicy}`);
                if (record.lifestyle.diet.alcohol) lifestyleItems.push(`饮酒/咖啡：${record.lifestyle.diet.alcohol}`);
            }
            if (record.lifestyle.exercise && record.lifestyle.exercise.done === '是') {
                lifestyleItems.push(`运动：${record.lifestyle.exercise.type || '其他'} ${record.lifestyle.exercise.duration || 0}分钟`);
            }
            if (record.lifestyle.qigong && record.lifestyle.qigong.done === '是') {
                lifestyleItems.push(`养生功：${record.lifestyle.qigong.type || '其他'} ${record.lifestyle.qigong.duration || 0}分钟`);
            }
            if (record.lifestyle.selfCare && record.lifestyle.selfCare.length > 0) {
                lifestyleItems.push(`自我保健：${record.lifestyle.selfCare.join('、')}`);
            }
            if (record.lifestyle.medication && record.lifestyle.medication.done === '是') {
                lifestyleItems.push(`服药：${record.lifestyle.medication.name || '药物'} ${record.lifestyle.medication.dose || ''}`);
            }
            
            if (lifestyleItems.length > 0) {
                html += `
                    <div class="record-section">
                        <div class="record-section-title">生活方式</div>
                        <div class="record-section-content">
                            <p>${lifestyleItems.join('，')}</p>
                        </div>
                    </div>
                `;
            }
        }
        
        // 环境与关键事件
        if (record.environment) {
            const environmentItems = [];
            if (record.environment.weatherSensitivity) {
                environmentItems.push(`天气敏感：${record.environment.weatherSensitivity}`);
            }
            if (record.environment.weatherChangeReaction) {
                environmentItems.push(`天气变化反应：${record.environment.weatherChangeReaction}`);
            }
            if (record.environment.majorEvent) {
                environmentItems.push(`重大事件：${record.environment.majorEvent}`);
            }
            
            if (environmentItems.length > 0) {
                html += `
                    <div class="record-section">
                        <div class="record-section-title">环境与事件</div>
                        <div class="record-section-content">
                            <p>${environmentItems.join('，')}</p>
                        </div>
                    </div>
                `;
            }
        }
        
        html += `
                </div>
            </div>
        `;
    });
    
    recordList.innerHTML = html;
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);