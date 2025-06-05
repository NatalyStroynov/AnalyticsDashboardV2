const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 5000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.scss': 'text/css',
  '.ts': 'text/plain'
};

function createDemoHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Dashboard - Architecture Demo</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.2.4/angular-material.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Roboto', sans-serif;
            background: #fafafa;
            color: #424242;
        }
        
        .dashboard-container {
            display: flex;
            height: 100vh;
        }
        
        .sidebar {
            width: 320px;
            background: white;
            border-right: 1px solid #e0e0e0;
            padding: 20px;
            overflow-y: auto;
        }
        
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .toolbar {
            background: white;
            border-bottom: 1px solid #e0e0e0;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            padding: 20px;
            flex: 1;
            overflow-y: auto;
        }
        
        .chart-widget {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 20px;
            min-height: 300px;
            transition: box-shadow 0.2s ease;
        }
        
        .chart-widget:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        
        .widget-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .widget-title {
            font-size: 18px;
            font-weight: 500;
            color: #1976d2;
        }
        
        .chart-container {
            position: relative;
            height: 200px;
        }
        
        .filter-section {
            margin-bottom: 24px;
        }
        
        .filter-title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 12px;
            color: #424242;
        }
        
        .filter-item {
            background: #f5f5f5;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 8px;
        }
        
        .btn {
            background: #1976d2;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .btn:hover {
            background: #1565c0;
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
        <h3>📊 Angular 17 Analytics Dashboard Architecture Demo</h3>
        <p>Демонстрация архитектуры панели аналитики с настраиваемыми графиками, фильтрами и масштабируемой структурой.</p>
    </div>

    <div class="dashboard-container">
        <!-- Filters Sidebar -->
        <div class="sidebar">
            <div class="filter-section">
                <div class="filter-title">
                    <span class="material-icons">filter_list</span>
                    Фильтры
                </div>
                
                <div class="architecture-info">
                    <h4>FiltersPanel Component</h4>
                    <div class="code-structure">
                        ✓ Dynamic filter creation<br>
                        ✓ Multiple filter types (text, number, date, range)<br>
                        ✓ Real-time filter application<br>
                        ✓ Filter state management with signals
                    </div>
                </div>
                
                <div class="filter-item">
                    <strong>Gender</strong><br>
                    <small>Type: Select | Operator: Equals | Value: Female</small>
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
            <!-- Toolbar -->
            <div class="toolbar">
                <div>
                    <button class="btn">
                        <span class="material-icons">dashboard</span>
                        Default Dashboard
                    </button>
                </div>
                
                <div class="architecture-info" style="flex: 1; margin: 0 20px;">
                    <h4>DashboardSelector Component</h4>
                    <div class="code-structure">
                        ✓ Multiple dashboard support<br>
                        ✓ Dashboard creation/selection<br>
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
                        <h4>ChartWidget Component</h4>
                        <div class="code-structure">
                            ✓ Chart.js integration<br>
                            ✓ Dynamic data loading<br>
                            ✓ Filter-aware rendering<br>
                            ✓ Drag & drop support
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
                        <h4>Chart Configuration</h4>
                        <div class="code-structure">
                            ✓ Multiple chart types (bar, line, pie, doughnut)<br>
                            ✓ Axis configuration<br>
                            ✓ Aggregation options (count, sum, avg, min, max)<br>
                            ✓ Real-time preview
                        </div>
                    </div>
                </div>

                <!-- Architecture Overview -->
                <div class="chart-widget">
                    <div class="widget-header">
                        <div class="widget-title">
                            <span class="material-icons">architecture</span>
                            Архитектура системы
                        </div>
                    </div>
                    <div class="architecture-info">
                        <h4>Core Services</h4>
                        <div class="code-structure">
                            📊 DashboardService - State management<br>
                            📈 DataService - Data fetching & aggregation<br>
                            🔧 Angular 17 Signals - Reactive state<br>
                            🎨 Angular Material - UI components
                        </div>
                        
                        <h4 style="margin-top: 16px;">Component Structure</h4>
                        <div class="code-structure">
                            🏠 DashboardPage (container)<br>
                            ├── 📊 DashboardSelector<br>
                            ├── 🔍 FiltersPanel<br>
                            ├── 📈 ChartWidget[]<br>
                            └── ⚙️ ChartConfig (modal)
                        </div>
                        
                        <h4 style="margin-top: 16px;">Key Features</h4>
                        <div class="code-structure">
                            ✓ Standalone components (Angular 17)<br>
                            ✓ Signal-based reactive state<br>
                            ✓ Drag & drop widget reordering<br>
                            ✓ Real-time filter application<br>
                            ✓ Configurable chart types & aggregations<br>
                            ✓ Scalable data service architecture
                        </div>
                    </div>
                </div>

                <!-- Data Flow Demo -->
                <div class="chart-widget">
                    <div class="widget-header">
                        <div class="widget-title">
                            <span class="material-icons">timeline</span>
                            Поток данных
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart3"></canvas>
                    </div>
                    <div class="architecture-info">
                        <h4>Data Flow</h4>
                        <div class="code-structure">
                            1. Filters applied → DashboardService<br>
                            2. Service updates filters signal<br>
                            3. ChartWidgets react to filter changes<br>
                            4. DataService aggregates filtered data<br>
                            5. Charts re-render with new data
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Модальные окна -->
    <!-- Модальное окно добавления графика -->
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

    <!-- Модальное окно добавления фильтра -->
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

    <!-- Уведомления -->
    <div id="notification" class="notification"></div>

    <script>
        // Sample chart data and initialization
        function initCharts() {
            // Chart 1 - Bar Chart
            const ctx1 = document.getElementById('chart1').getContext('2d');
            new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
                    datasets: [{
                        label: 'Пользователи',
                        data: [120, 190, 300, 250, 180],
                        backgroundColor: 'rgba(25, 118, 210, 0.5)',
                        borderColor: 'rgba(25, 118, 210, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            // Chart 2 - Pie Chart
            const ctx2 = document.getElementById('chart2').getContext('2d');
            new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: ['Мужчины', 'Женщины'],
                    datasets: [{
                        data: [45, 55],
                        backgroundColor: [
                            'rgba(25, 118, 210, 0.8)',
                            'rgba(0, 150, 136, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });

            // Chart 3 - Line Chart
            const ctx3 = document.getElementById('chart3').getContext('2d');
            new Chart(ctx3, {
                type: 'line',
                data: {
                    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
                    datasets: [{
                        label: 'Активность',
                        data: [65, 59, 80, 81, 56, 55],
                        borderColor: 'rgba(255, 152, 0, 1)',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }

        // Initialize charts when page loads
        document.addEventListener('DOMContentLoaded', initCharts);

        // Global variables
        var charts = {};
        var chartCounter = 3;

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
            showNotification('График создан!');
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
            if (type === 'bar') return 'bar_chart';
            if (type === 'line') return 'show_chart';
            if (type === 'pie') return 'pie_chart';
            if (type === 'doughnut') return 'donut_small';
            return 'insert_chart';
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
            if (field === 'age') return 'Возраст';
            if (field === 'gender') return 'Пол';
            if (field === 'region') return 'Регион';
            if (field === 'status') return 'Статус';
            if (field === 'date') return 'Дата';
            return field;
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

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(createDemoHTML());
    return;
  }

  let filePath = path.join(__dirname, req.url);
  
  // Security check
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Dashboard demo server running at http://0.0.0.0:${port}`);
});