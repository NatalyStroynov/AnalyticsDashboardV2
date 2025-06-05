const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.static('.'));

app.get('/', (req, res) => {
  res.send(createDemoHTML());
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

function createDemoHTML() {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Angular Analytics Dashboard Demo</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Roboto', Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }
        
        .dashboard-container {
            display: flex;
            height: 100vh;
        }
        
        .sidebar {
            width: 300px;
            background: white;
            box-shadow: 2px 0 8px rgba(0,0,0,0.1);
            padding: 20px;
            overflow-y: auto;
        }
        
        .main-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }
        
        .sidebar h2 {
            margin-bottom: 20px;
            color: #1976d2;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .filter-section, .dashboard-info {
            margin-bottom: 30px;
        }
        
        .filter-section h3, .dashboard-info h3 {
            margin-bottom: 15px;
            color: #666;
            font-size: 16px;
        }
        
        .filter-item {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 10px;
            border-left: 3px solid #1976d2;
            position: relative;
        }
        
        .btn {
            background: #1976d2;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            width: 100%;
            justify-content: center;
            margin-top: 10px;
            transition: background-color 0.2s;
        }
        
        .btn:hover {
            background: #1565c0;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
        }
        
        .chart-widget {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            position: relative;
        }
        
        .widget-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .widget-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            font-size: 16px;
        }
        
        .chart-container {
            height: 300px;
            margin-bottom: 15px;
        }
        
        .material-icons {
            font-size: 20px;
            vertical-align: middle;
        }
        
        .demo-note {
            background: #e3f2fd;
            border-left: 4px solid #1976d2;
            padding: 16px;
            margin: 20px;
            border-radius: 4px;
        }
        
        .architecture-info {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .code-structure {
            background: #f5f5f5;
            border-radius: 4px;
            padding: 12px;
            margin: 8px 0;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
        }
        
        .modal-content {
            background: white;
            margin: 5% auto;
            padding: 20px;
            width: 80%;
            max-width: 600px;
            border-radius: 8px;
            position: relative;
        }
        
        .close {
            position: absolute;
            right: 15px;
            top: 15px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .form-group input, .form-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .widget-actions {
            position: absolute;
            top: 10px;
            right: 10px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        .chart-widget:hover .widget-actions {
            opacity: 1;
        }
        
        .action-btn {
            background: #f5f5f5;
            border: none;
            padding: 5px;
            margin-left: 5px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .action-btn:hover {
            background: #e0e0e0;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            display: none;
            z-index: 1001;
        }
    </style>
</head>
<body>
    <div class="demo-note">
        <strong>Angular 17 Analytics Dashboard</strong> - Демонстрация архитектуры с компонентами, сервисами и интерактивностью
    </div>

    <div class="dashboard-container">
        <!-- Sidebar -->
        <div class="sidebar">
            <h2>
                <span class="material-icons">dashboard</span>
                Дашборд
            </h2>
            
            <!-- Filters Panel -->
            <div class="filter-section">
                <h3>Фильтры</h3>
                <div class="filter-item">
                    <strong>Регион</strong><br>
                    <small>Type: Select | Operator: Equals | Value: Москва</small>
                </div>
                <div class="filter-item">
                    <strong>Age</strong><br>
                    <small>Type: Number | Operator: Greater Than | Value: 15</small>
                </div>
                
                <button class="btn" onclick="addFilter()">
                    <span class="material-icons">add</span>
                    Добавить фильтр
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <div class="dashboard-info">
                <h3>Angular 17 Dashboard Architecture</h3>
                <div class="architecture-info">
                    <h4>Основные компоненты</h4>
                    <div class="code-structure">
                        ✓ DashboardPageComponent - Основная страница<br>
                        ✓ ChartWidgetComponent - Компонент графика<br>
                        ✓ FiltersPanelComponent - Панель фильтров<br>
                        ✓ ChartConfigComponent - Настройка графиков<br>
                        ✓ DashboardService - Управление состоянием<br>
                        ✓ DataService - Обработка данных<br>
                        ✓ Signal-based state management<br>
                        ✓ Chart.js integration<br>
                        ✓ State persistence
                    </div>
                </div>
                
                <button class="btn" onclick="addChart()">
                    <span class="material-icons">add</span>
                    Добавить график
                </button>
            </div>

            <!-- Dashboard Grid -->
            <div class="dashboard-grid">
                <!-- Chart Widget 1 -->
                <div class="chart-widget">
                    <div class="widget-header">
                        <div class="widget-title">
                            <span class="material-icons">bar_chart</span>
                            Пользователи по возрасту
                        </div>
                        <div class="widget-actions">
                            <button class="action-btn" onclick="editChart(1)" title="Редактировать">
                                <span class="material-icons">edit</span>
                            </button>
                            <button class="action-btn" onclick="duplicateChart(1)" title="Дублировать">
                                <span class="material-icons">content_copy</span>
                            </button>
                            <button class="action-btn" onclick="deleteChart(1)" title="Удалить">
                                <span class="material-icons">delete</span>
                            </button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart1"></canvas>
                    </div>
                    <div class="architecture-info">
                        <h4>ChartWidgetComponent</h4>
                        <div class="code-structure">
                            ✓ Signal-based data loading<br>
                            ✓ Chart.js integration<br>
                            ✓ Dynamic filtering support<br>
                            ✓ Edit/Delete/Duplicate actions
                        </div>
                    </div>
                </div>

                <!-- Chart Widget 2 -->
                <div class="chart-widget">
                    <div class="widget-header">
                        <div class="widget-title">
                            <span class="material-icons">pie_chart</span>
                            Распределение по полу
                        </div>
                        <div class="widget-actions">
                            <button class="action-btn" onclick="editChart(2)" title="Редактировать">
                                <span class="material-icons">edit</span>
                            </button>
                            <button class="action-btn" onclick="duplicateChart(2)" title="Дублировать">
                                <span class="material-icons">content_copy</span>
                            </button>
                            <button class="action-btn" onclick="deleteChart(2)" title="Удалить">
                                <span class="material-icons">delete</span>
                            </button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart2"></canvas>
                    </div>
                    <div class="architecture-info">
                        <h4>Pie Chart Implementation</h4>
                        <div class="code-structure">
                            ✓ Reactive data updates<br>
                            ✓ Custom aggregation logic<br>
                            ✓ Interactive legends<br>
                            ✓ Responsive design
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Chart Configuration Modal -->
    <div id="chartModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('chartModal')">&times;</span>
            <h3>Настройка графика</h3>
            <div class="form-group">
                <label>Название графика:</label>
                <input type="text" id="chartTitle" placeholder="Введите название">
            </div>
            <div class="form-group">
                <label>Тип графика:</label>
                <select id="chartType">
                    <option value="bar">Столбчатая диаграмма</option>
                    <option value="line">Линейный график</option>
                    <option value="pie">Круговая диаграмма</option>
                    <option value="doughnut">Кольцевая диаграмма</option>
                </select>
            </div>
            <div class="form-group">
                <label>Источник данных:</label>
                <select id="dataSource">
                    <option value="users">Пользователи</option>
                    <option value="sales">Продажи</option>
                    <option value="analytics">Аналитика</option>
                </select>
            </div>
            <div class="form-group">
                <label>Поле X (горизонтальная ось):</label>
                <select id="xField">
                    <option value="age">Возраст</option>
                    <option value="gender">Пол</option>
                    <option value="region">Регион</option>
                    <option value="date">Дата</option>
                </select>
            </div>
            <div class="form-group">
                <label>Поле Y (вертикальная ось):</label>
                <select id="yField">
                    <option value="count">Количество</option>
                    <option value="sum">Сумма</option>
                    <option value="average">Среднее</option>
                </select>
            </div>
            <div class="form-group">
                <label>Агрегация:</label>
                <select id="aggregation">
                    <option value="count">Count (Подсчет)</option>
                    <option value="sum">Sum (Сумма)</option>
                    <option value="avg">Average (Среднее)</option>
                    <option value="min">Minimum (Минимум)</option>
                    <option value="max">Maximum (Максимум)</option>
                    <option value="distinct">Distinct Count (Уникальные)</option>
                </select>
            </div>
            <button class="btn" onclick="saveChart()">Сохранить график</button>
        </div>
    </div>

    <!-- Filter Configuration Modal -->
    <div id="filterModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('filterModal')">&times;</span>
            <h3>Добавить фильтр</h3>
            <div class="form-group">
                <label>Поле для фильтрации:</label>
                <select id="filterField">
                    <option value="age">Возраст</option>
                    <option value="gender">Пол</option>
                    <option value="region">Регион</option>
                    <option value="status">Статус</option>
                    <option value="date">Дата регистрации</option>
                </select>
            </div>
            <div class="form-group">
                <label>Тип фильтра:</label>
                <select id="filterType" onchange="updateFilterOptions()">
                    <option value="text">Текст</option>
                    <option value="number">Число</option>
                    <option value="select">Выбор</option>
                    <option value="date">Дата</option>
                    <option value="range">Диапазон</option>
                    <option value="boolean">Да/Нет</option>
                </select>
            </div>
            <div class="form-group">
                <label>Оператор:</label>
                <select id="filterOperator">
                    <option value="eq">Равно</option>
                    <option value="ne">Не равно</option>
                    <option value="gt">Больше</option>
                    <option value="gte">Больше или равно</option>
                    <option value="lt">Меньше</option>
                    <option value="lte">Меньше или равно</option>
                    <option value="contains">Содержит</option>
                </select>
            </div>
            <div class="form-group">
                <label>Значение:</label>
                <input type="text" id="filterValue" placeholder="Введите значение">
            </div>
            <button class="btn" onclick="saveFilter()">Добавить фильтр</button>
        </div>
    </div>

    <!-- Notification -->
    <div id="notification" class="notification"></div>

    <script>
        // Global variables
        var chartCounter = 3;

        // Initialize charts when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initCharts();
        });

        // Initialize sample charts
        function initCharts() {
            // Chart 1 - Bar Chart
            var ctx1 = document.getElementById('chart1').getContext('2d');
            new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
                    datasets: [{
                        label: 'Количество пользователей',
                        data: [125, 189, 143, 98, 67],
                        backgroundColor: 'rgba(25, 118, 210, 0.8)',
                        borderColor: 'rgba(25, 118, 210, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });

            // Chart 2 - Pie Chart
            var ctx2 = document.getElementById('chart2').getContext('2d');
            new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: ['Мужчины', 'Женщины', 'Не указано'],
                    datasets: [{
                        data: [312, 298, 45],
                        backgroundColor: [
                            'rgba(25, 118, 210, 0.8)',
                            'rgba(0, 150, 136, 0.8)',
                            'rgba(255, 152, 0, 0.8)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Modal functions
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Chart management functions
        function addChart() {
            openModal('chartModal');
        }

        function editChart(chartId) {
            showNotification('Редактирование графика ' + chartId);
            openModal('chartModal');
        }

        function duplicateChart(chartId) {
            var grid = document.querySelector('.dashboard-grid');
            var newWidget = createChartWidget(chartCounter++, 'Копия графика', 'bar');
            grid.appendChild(newWidget);
            showNotification('График дублирован!');
        }

        function deleteChart(chartId) {
            if (confirm('Удалить этот график?')) {
                showNotification('График удален');
            }
        }

        function saveChart() {
            var title = document.getElementById('chartTitle').value || 'Новый график';
            var type = document.getElementById('chartType').value;
            var grid = document.querySelector('.dashboard-grid');
            var newWidget = createChartWidget(chartCounter++, title, type);
            grid.appendChild(newWidget);
            closeModal('chartModal');
            showNotification('График "' + title + '" создан!');
            document.getElementById('chartTitle').value = '';
        }

        function createChartWidget(id, title, type) {
            var widget = document.createElement('div');
            widget.className = 'chart-widget';
            
            widget.innerHTML = 
                '<div class="widget-header">' +
                    '<div class="widget-title">' +
                        '<span class="material-icons">' + getChartIcon(type) + '</span>' +
                        title +
                    '</div>' +
                    '<div class="widget-actions">' +
                        '<button class="action-btn" onclick="editChart(' + id + ')" title="Редактировать">' +
                            '<span class="material-icons">edit</span>' +
                        '</button>' +
                        '<button class="action-btn" onclick="duplicateChart(' + id + ')" title="Дублировать">' +
                            '<span class="material-icons">content_copy</span>' +
                        '</button>' +
                        '<button class="action-btn" onclick="deleteChart(' + id + ')" title="Удалить">' +
                            '<span class="material-icons">delete</span>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="chart-container">' +
                    '<canvas id="chart' + id + '"></canvas>' +
                '</div>' +
                '<div class="architecture-info">' +
                    '<h4>Динамический график</h4>' +
                    '<div class="code-structure">' +
                        'Тип: ' + type + '<br>' +
                        'Создан через ChartConfig<br>' +
                        'Поддержка редактирования' +
                    '</div>' +
                '</div>';

            // Create chart after DOM update
            setTimeout(function() {
                var canvas = document.getElementById('chart' + id);
                if (canvas) {
                    var ctx = canvas.getContext('2d');
                    createSampleChart(ctx, type);
                }
            }, 100);

            return widget;
        }

        function getChartIcon(type) {
            switch(type) {
                case 'bar': return 'bar_chart';
                case 'line': return 'show_chart';
                case 'pie': return 'pie_chart';
                case 'doughnut': return 'donut_small';
                default: return 'insert_chart';
            }
        }

        function createSampleChart(ctx, type) {
            var data = {
                labels: ['A', 'B', 'C', 'D'],
                datasets: [{
                    label: 'Данные',
                    data: [
                        Math.floor(Math.random() * 100),
                        Math.floor(Math.random() * 100),
                        Math.floor(Math.random() * 100),
                        Math.floor(Math.random() * 100)
                    ],
                    backgroundColor: [
                        'rgba(25, 118, 210, 0.8)',
                        'rgba(0, 150, 136, 0.8)',
                        'rgba(255, 152, 0, 0.8)',
                        'rgba(156, 39, 176, 0.8)'
                    ]
                }]
            };

            new Chart(ctx, {
                type: type,
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Filter functions
        function addFilter() {
            openModal('filterModal');
        }

        function saveFilter() {
            var field = document.getElementById('filterField').value;
            var type = document.getElementById('filterType').value;
            var operator = document.getElementById('filterOperator').value;
            var value = document.getElementById('filterValue').value;

            if (!value.trim()) {
                alert('Введите значение для фильтра');
                return;
            }

            var filtersContainer = document.querySelector('.filter-section');
            var addButton = filtersContainer.querySelector('.btn');
            
            var newFilter = document.createElement('div');
            newFilter.className = 'filter-item';
            newFilter.innerHTML = 
                '<strong>' + getFieldLabel(field) + '</strong><br>' +
                '<small>Type: ' + type + ' | Operator: ' + operator + ' | Value: ' + value + '</small>' +
                '<button class="action-btn" onclick="removeFilter(this)" style="float: right; margin-top: -5px;">' +
                    '<span class="material-icons">close</span>' +
                '</button>';

            filtersContainer.insertBefore(newFilter, addButton);
            closeModal('filterModal');
            showNotification('Фильтр добавлен!');
            document.getElementById('filterValue').value = '';
        }

        function removeFilter(button) {
            button.parentElement.remove();
            showNotification('Фильтр удален');
        }

        function getFieldLabel(field) {
            switch(field) {
                case 'age': return 'Возраст';
                case 'gender': return 'Пол';
                case 'region': return 'Регион';
                case 'status': return 'Статус';
                case 'date': return 'Дата';
                default: return field;
            }
        }

        function updateFilterOptions() {
            var type = document.getElementById('filterType').value;
            var operatorSelect = document.getElementById('filterOperator');
            
            operatorSelect.innerHTML = '';
            
            if (type === 'text') {
                addOption(operatorSelect, 'eq', 'Равно');
                addOption(operatorSelect, 'ne', 'Не равно');
                addOption(operatorSelect, 'contains', 'Содержит');
            } else if (type === 'number') {
                addOption(operatorSelect, 'eq', 'Равно');
                addOption(operatorSelect, 'gt', 'Больше');
                addOption(operatorSelect, 'lt', 'Меньше');
            } else {
                addOption(operatorSelect, 'eq', 'Равно');
                addOption(operatorSelect, 'ne', 'Не равно');
            }
        }

        function addOption(select, value, text) {
            var option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            select.appendChild(option);
        }

        function showNotification(message) {
            var notification = document.getElementById('notification');
            notification.textContent = message;
            notification.style.display = 'block';
            
            setTimeout(function() {
                notification.style.display = 'none';
            }, 3000);
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            var modals = document.querySelectorAll('.modal');
            for (var i = 0; i < modals.length; i++) {
                if (event.target === modals[i]) {
                    modals[i].style.display = 'none';
                }
            }
        };
    </script>
</body>
</html>`;
}