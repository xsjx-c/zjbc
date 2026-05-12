// 订单汇总页面交互逻辑

// 全局变量
let herbList = []; // 药材清单数组

// 药材价格数据库（每克价格）
const herbPrices = {
    '陈皮': 0.007,
    '当归': 0.050,
    '熟地黄': 0.0115,
    '红枣': 0.004,
    '白芍': 0.040,
    '川芎': 0.01425,
    '黄芪': 0.0565,
    '肉桂': 0.0105,
    '枸杞': 0.056,
    '八角': 0.033,
    '甘草': 0.01525,
    '党参': 0.045
};

// 模拟方剂数据库（实际应用中应从服务器获取）
const formulas = {
    '麻黄汤': [
        { name: '麻黄', amount: 10 },
        { name: '桂枝', amount: 6 },
        { name: '杏仁', amount: 9 },
        { name: '甘草', amount: 3 }
    ],
    '桂枝汤': [
        { name: '桂枝', amount: 9 },
        { name: '芍药', amount: 9 },
        { name: '甘草', amount: 6 },
        { name: '生姜', amount: 9 },
        { name: '大枣', amount: 12 }
    ],
    '银翘散': [
        { name: '金银花', amount: 15 },
        { name: '连翘', amount: 15 },
        { name: '薄荷', amount: 6 },
        { name: '竹叶', amount: 4 },
        { name: '甘草', amount: 5 }
    ]
};

// DOM 元素
const herbTableBody = document.getElementById('herb-table-body');
const totalWeightElement = document.getElementById('total-weight');
const totalAmountElement = document.getElementById('total-amount');

// 初始化页面
function init() {
    updateOrderSummary();
    setupEventListeners();
    
    // 检查URL参数中是否有药材数据
    const urlParams = new URLSearchParams(window.location.search);
    const herbsParam = urlParams.get('herbs');
    
    if (herbsParam) {
        try {
            // 解码并解析药材数据
            const herbs = JSON.parse(decodeURIComponent(herbsParam));
            
            // 将药材添加到订单汇总
            if (Array.isArray(herbs) && herbs.length > 0) {
                addHerbsToOrder(herbs);
            }
        } catch (error) {
            console.error('解析药材数据失败:', error);
        }
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 清空清单按钮
    document.getElementById('clear-list-btn').addEventListener('click', clearHerbList);

    // 生成订单按钮
    document.getElementById('generate-order-btn').addEventListener('click', generateOrder);
}

// 清空药材清单
function clearHerbList() {
    if (confirm('确定要清空所有药材吗？')) {
        herbList = [];
        updateHerbTable();
        updateOrderSummary();
        showNotification('已清空所有药材');
    }
}

// 从药材清单中移除项目
function removeHerbFromList(index) {
    herbList.splice(index, 1);
    updateHerbTable();
    updateOrderSummary();
    showNotification('已移除选定药材');
}

// 生成订单
function generateOrder() {
    if (herbList.length === 0) {
        showNotification('药材清单为空，无法生成订单');
        return;
    }

    // 生成订单
    showNotification('订单生成成功！');
    
    // 调用打印功能
    printOrder();
    
    // 可以选择是否清空列表
    if (confirm('订单已生成，是否清空药材清单？')) {
        clearHerbList();
    }
}

// 打印订单
function printOrder() {
    if (herbList.length === 0) {
        return;
    }
    
    // 计算总重量和总金额
    const totalWeight = herbList.reduce((sum, herb) => sum + herb.amount, 0);
    const totalAmount = herbList.reduce((sum, herb) => sum + herb.subtotal, 0);
    
    // 创建打印内容
    const printContent = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>订单打印</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .print-header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 10px;
                }
                .print-title {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .print-subtitle {
                    font-size: 16px;
                    color: #666;
                }
                .order-info {
                    margin-bottom: 20px;
                }
                .order-date {
                    text-align: right;
                    font-size: 14px;
                    color: #666;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: center;
                }
                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .order-summary {
                    margin-top: 20px;
                    border-top: 2px solid #333;
                    padding-top: 10px;
                    text-align: right;
                }
                .summary-item {
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                .total-amount {
                    font-size: 18px;
                    font-weight: bold;
                    color: #e53935;
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-header">
                <h1 class="print-title">智鉴百草 - 订单汇总</h1>
                <p class="print-subtitle">智能订单汇总系统</p>
            </div>
            
            <div class="order-info">
                <div class="order-date">
                    <p>订单日期：${new Date().toLocaleString()}</p>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>药材名称</th>
                        <th>重量(g)</th>
                        <th>单价(元/g)</th>
                        <th>小计(元)</th>
                    </tr>
                </thead>
                <tbody>
                    ${herbList.map(herb => `
                        <tr>
                            <td>${herb.name}</td>
                            <td>${herb.amount.toFixed(2)}</td>
                            <td>${herb.price.toFixed(4)}</td>
                            <td>${herb.subtotal.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="order-summary">
                <div class="summary-item">
                    <strong>总重量：</strong>${totalWeight.toFixed(2)} g
                </div>
                <div class="summary-item total-amount">
                    <strong>总金额：</strong>¥ ${totalAmount.toFixed(2)}
                </div>
            </div>
        </body>
        </html>
    `;
    
    // 创建打印窗口
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // 等待内容加载完成后打印
    printWindow.onload = function() {
        printWindow.print();
        // 打印后关闭窗口
        printWindow.onafterprint = function() {
            printWindow.close();
        };
    };
}

// 更新药材表格
function updateHerbTable() {
    herbTableBody.innerHTML = '';

    if (herbList.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 4;
        emptyCell.className = 'empty-message';
        emptyCell.textContent = '暂无药材';
        emptyRow.appendChild(emptyCell);
        herbTableBody.appendChild(emptyRow);
        return;
    }

    herbList.forEach((herb, index) => {
        const row = document.createElement('tr');
        
        // 药材名称
        const nameCell = document.createElement('td');
        nameCell.textContent = herb.name;
        row.appendChild(nameCell);
        
        // 重量 - 突出显示克重
        const amountCell = document.createElement('td');
        amountCell.textContent = herb.amount.toFixed(1);
        amountCell.classList.add('weight-highlight'); // 添加高亮类
        row.appendChild(amountCell);
        
        // 单价
        const priceCell = document.createElement('td');
        priceCell.textContent = herb.price.toFixed(2);
        row.appendChild(priceCell);
        
        // 小计
        const subtotalCell = document.createElement('td');
        subtotalCell.textContent = herb.subtotal.toFixed(2);
        row.appendChild(subtotalCell);
        
        // 操作按钮
        const actionCell = document.createElement('td');
        
        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', () => removeHerbFromList(index));
        actionCell.appendChild(deleteBtn);
        
        row.appendChild(actionCell);
        
        herbTableBody.appendChild(row);
    });
}

// 更新订单汇总
function updateOrderSummary() {
    const totalWeight = herbList.reduce((sum, herb) => sum + herb.amount, 0);
    const totalAmount = herbList.reduce((sum, herb) => sum + herb.subtotal, 0);
    
    totalWeightElement.textContent = totalWeight.toFixed(2) + ' g';
    totalAmountElement.textContent = '¥ ' + totalAmount.toFixed(2);
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
        background-color: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
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

// 添加药材到订单汇总（可从外部调用）
// 此函数允许其他页面（如药方智验页面）将识别到的药材添加到订单汇总中
// @param {Array} herbs - 要添加的药材数组，每个元素包含name和amount属性
window.addHerbsToOrder = function(herbs) {
    if (!Array.isArray(herbs) || herbs.length === 0) {
        showNotification('没有可添加的药材数据');
        return;
    }
    
    // 将药材添加到清单
    herbs.forEach(herb => {
        // 查找药材价格，如果没有找到则使用默认价格
        const price = herbPrices[herb.name] || 0.05;
        
        // 创建药材对象
        const herbItem = {
            name: herb.name,
            amount: parseFloat(herb.amount) || 1.0, // 确保重量为数字
            price: price,
            subtotal: (parseFloat(herb.amount) || 1.0) * price
        };
        
        // 添加到药材列表
        herbList.push(herbItem);
    });
    
    // 更新表格和汇总信息
    updateHerbTable();
    updateOrderSummary();
    
    // 显示成功通知
    showNotification(`已成功添加${herbs.length}种药材到订单汇总`);
};

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);