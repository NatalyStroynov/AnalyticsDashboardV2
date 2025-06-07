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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #2d2d2d;
            color: #ffffff;
            overflow: hidden;
        }
        
        .top-bar {
            background: #3a3a3a;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #4a4a4a;
        }
        
        .dashboard-selector {
            background: #2d2d2d;
            border: 1px solid #555;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            min-width: 250px;
        }
        
        .top-controls {
            display: flex;
            gap: 10px;
        }
        
        .top-btn {
            background: #d4a421;
            border: 1px solid #d4a421;
            color: #2d2d2d;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 13px;
            cursor: pointer;
            font-weight: 500;
        }
        
        .top-btn:hover {
            background: #e6b82e;
        }
        
        .filters-btn {
            background: #4a4a4a;
            border: 1px solid #555;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 13px;
            cursor: pointer;
        }
        
        .filters-btn:hover {
            background: #555;
        }
        
        .main-container {
            display: flex;
            height: calc(100vh - 57px);
        }
        
        .dashboard-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #2d2d2d;
        }
        
        .filters-panel {
            width: 320px;
            background: #3a3a3a;
            border-left: 1px solid #4a4a4a;
            padding: 20px;
            overflow-y: auto;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        
        .filters-panel.open {
            transform: translateX(0);
        }
        
        .filters-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #4a4a4a;
        }
        
        .filters-title {
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
        }
        
        .close-filters {
            background: none;
            border: none;
            color: #ccc;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
            gap: 20px;
            padding-bottom: 20px;
        }
        
        .chart-widget {
            background: #3a3a3a;
            border-radius: 8px;
            padding: 20px;
            border: 1px solid #4a4a4a;
            position: relative;
        }
        
        .widget-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .widget-title {
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
        }
        
        .widget-actions {
            display: flex;
            gap: 8px;
        }
        
        .action-btn {
            background: none;
            border: none;
            color: #ccc;
            font-size: 18px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
        }
        
        .action-btn:hover {
            color: #fff;
            background: #4a4a4a;
        }
        
        .chart-container {
            height: 300px;
            margin-bottom: 10px;
        }
        
        .filter-item {
            background: #4a4a4a;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
            border: 1px solid #555;
        }
        
        .filter-field {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .filter-field-name {
            font-weight: 500;
            color: #ffffff;
        }
        
        .filter-remove {
            background: none;
            border: none;
            color: #ccc;
            cursor: pointer;
            font-size: 16px;
        }
        
        .filter-details {
            font-size: 12px;
            color: #bbb;
        }
        
        .add-filter-btn {
            background: none;
            border: 1px solid #d4a421;
            color: #d4a421;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            font-size: 13px;
            margin-top: 10px;
        }
        
        .add-filter-btn:hover {
            background: #d4a421;
            color: #2d2d2d;
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 1000;
        }
        
        .modal-content {
            background: #3a3a3a;
            margin: 5% auto;
            padding: 25px;
            width: 90%;
            max-width: 500px;
            border-radius: 8px;
            border: 1px solid #4a4a4a;
            color: white;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #4a4a4a;
        }
        
        .modal-title {
            font-size: 18px;
            font-weight: 600;
        }
        
        .close {
            background: none;
            border: none;
            color: #ccc;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
        }
        
        .form-group {
            margin-bottom: 18px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #ffffff;
            font-size: 14px;
        }
        
        .form-group input, .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #555;
            border-radius: 4px;
            background: #2d2d2d;
            color: white;
            font-size: 14px;
        }
        
        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #d4a421;
        }
        
        .btn-primary {
            background: #d4a421;
            border: none;
            color: #2d2d2d;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            width: 100%;
            margin-top: 10px;
        }
        
        .btn-primary:hover {
            background: #e6b82e;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #d4a421;
            color: #2d2d2d;
            padding: 12px 20px;
            border-radius: 4px;
            display: none;
            z-index: 1001;
            font-weight: 500;
        }
        
        .add-chart-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #d4a421;
            border: none;
            color: #2d2d2d;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .add-chart-btn:hover {
            background: #e6b82e;
            transform: scale(1.05);
        }
        
        canvas {
            filter: brightness(1.1);
        }
        
        /* Dark theme chart styling */
        .chart-widget .chart-container canvas {
            background: transparent;
        }
    </style>
</head>
<body>
    <!-- Top Navigation Bar -->
    <div class="top-bar">
        <select class="dashboard-selector" onchange="switchDashboard(this.value)">
            <option value="simulation">Simulation Field Model Dashboard</option>
            <option value="lead-contact">Lead Contacts Dashboard</option>
            <option value="fiber-tracts">Fiber Tracts Dashboard</option>
        </select>
        
        <div class="top-controls">
            <button class="top-btn" onclick="openDataSources()">Data Sources</button>
            <button class="filters-btn" onclick="toggleFilters()">
                <span class="material-icons" style="font-size: 16px; margin-right: 4px;">filter_list</span>
                Filters
            </button>
        </div>
    </div>

    <!-- Main Container -->
    <div class="main-container">
        <!-- Dashboard Content -->
        <div class="dashboard-content">
            <div class="dashboard-grid">
                <!-- Patient Accrual Chart -->
                <div class="chart-widget">
                    <div class="widget-header">
                        <div class="widget-title">Patient Accrual</div>
                        <div class="widget-actions">
                            <button class="action-btn" onclick="editChart(1)" title="More options">
                                <span class="material-icons">more_vert</span>
                            </button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart1"></canvas>
                    </div>
                </div>

                <!-- Patient Gender Chart -->
                <div class="chart-widget">
                    <div class="widget-header">
                        <div class="widget-title">Patient Gender</div>
                        <div class="widget-actions">
                            <button class="action-btn" onclick="editChart(2)" title="More options">
                                <span class="material-icons">more_vert</span>
                            </button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart2"></canvas>
                    </div>
                </div>

                <!-- Patient Age Chart -->
                <div class="chart-widget">
                    <div class="widget-header">
                        <div class="widget-title">Patient Age</div>
                        <div class="widget-actions">
                            <button class="action-btn" onclick="editChart(3)" title="More options">
                                <span class="material-icons">more_vert</span>
                            </button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart3"></canvas>
                    </div>
                </div>

                <!-- Lead Model Chart -->
                <div class="chart-widget">
                    <div class="widget-header">
                        <div class="widget-title">Lead Model</div>
                        <div class="widget-actions">
                            <button class="action-btn" onclick="editChart(4)" title="More options">
                                <span class="material-icons">more_vert</span>
                            </button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart4"></canvas>
                    </div>
                </div>

                <!-- Disease Chart -->
                <div class="chart-widget">
                    <div class="widget-header">
                        <div class="widget-title">Disease</div>
                        <div class="widget-actions">
                            <button class="action-btn" onclick="editChart(5)" title="More options">
                                <span class="material-icons">more_vert</span>
                            </button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart5"></canvas>
                    </div>
                </div>

                <!-- IPG Type Chart -->
                <div class="chart-widget">
                    <div class="widget-header">
                        <div class="widget-title">IPG Type</div>
                        <div class="widget-actions">
                            <button class="action-btn" onclick="editChart(6)" title="More options">
                                <span class="material-icons">more_vert</span>
                            </button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart6"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters Panel -->
        <div class="filters-panel" id="filtersPanel">
            <div class="filters-header">
                <div class="filters-title">FILTERS</div>
                <button class="close-filters" onclick="toggleFilters()">&times;</button>
            </div>
            
            <div class="filter-item">
                <div class="filter-field">
                    <span class="filter-field-name">Gender</span>
                    <button class="filter-remove" onclick="removeFilter(this)">×</button>
                </div>
                <div class="filter-details">Includes... • 2 items selected</div>
            </div>
            
            <div class="filter-item">
                <div class="filter-field">
                    <span class="filter-field-name">Age</span>
                    <button class="filter-remove" onclick="removeFilter(this)">×</button>
                </div>
                <div class="filter-details">≥ • 18</div>
            </div>
            
            <button class="add-filter-btn" onclick="addFilter()">+ Add New Clause</button>
        </div>
    </div>

    <!-- Floating Add Button -->
    <button class="add-chart-btn" onclick="addChart()" title="Add Chart">
        <span class="material-icons">add</span>
    </button>

    <!-- Chart Configuration Modal -->
    <div id="chartModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">Chart Configuration</div>
                <button class="close" onclick="closeModal('chartModal')">&times;</button>
            </div>
            <div class="form-group">
                <label>Chart Title:</label>
                <input type="text" id="chartTitle" placeholder="Enter chart title">
            </div>
            <div class="form-group">
                <label>Chart Type:</label>
                <select id="chartType">
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="doughnut">Doughnut Chart</option>
                </select>
            </div>
            <div class="form-group">
                <label>Data Source:</label>
                <select id="dataSource">
                    <option value="patients">Patients</option>
                    <option value="treatments">Treatments</option>
                    <option value="devices">Devices</option>
                </select>
            </div>
            <div class="form-group">
                <label>X Field (horizontal axis):</label>
                <select id="xField">
                    <option value="age">Age</option>
                    <option value="gender">Gender</option>
                    <option value="disease">Disease</option>
                    <option value="date">Date</option>
                </select>
            </div>
            <div class="form-group">
                <label>Y Field (vertical axis):</label>
                <select id="yField">
                    <option value="count">Count</option>
                    <option value="sum">Sum</option>
                    <option value="average">Average</option>
                </select>
            </div>
            <div class="form-group">
                <label>Aggregation:</label>
                <select id="aggregation">
                    <option value="count">Count</option>
                    <option value="sum">Sum</option>
                    <option value="avg">Average</option>
                    <option value="min">Minimum</option>
                    <option value="max">Maximum</option>
                    <option value="distinct">Distinct Count</option>
                </select>
            </div>
            <button class="btn-primary" onclick="saveChart()">Save Chart</button>
        </div>
    </div>

    <!-- Filter Configuration Modal -->
    <div id="filterModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">Add Filter</div>
                <button class="close" onclick="closeModal('filterModal')">&times;</button>
            </div>
            <div class="form-group">
                <label>Filter Field:</label>
                <select id="filterField">
                    <option value="age">Age</option>
                    <option value="gender">Gender</option>
                    <option value="disease">Disease</option>
                    <option value="status">Status</option>
                    <option value="date">Date</option>
                </select>
            </div>
            <div class="form-group">
                <label>Filter Type:</label>
                <select id="filterType" onchange="updateFilterOptions()">
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                    <option value="date">Date</option>
                    <option value="range">Range</option>
                    <option value="boolean">Boolean</option>
                </select>
            </div>
            <div class="form-group">
                <label>Operator:</label>
                <select id="filterOperator">
                    <option value="eq">Equals</option>
                    <option value="ne">Not Equals</option>
                    <option value="gt">Greater Than</option>
                    <option value="gte">Greater Than or Equal</option>
                    <option value="lt">Less Than</option>
                    <option value="lte">Less Than or Equal</option>
                    <option value="contains">Contains</option>
                </select>
            </div>
            <div class="form-group">
                <label>Value:</label>
                <input type="text" id="filterValue" placeholder="Enter value">
            </div>
            <button class="btn-primary" onclick="saveFilter()">Add Filter</button>
        </div>
    </div>

    <!-- Notification -->
    <div id="notification" class="notification"></div>

    <script>
        // Global variables
        var chartCounter = 7;
        var currentDashboard = 'simulation';
        var dashboardCharts = {};

        // Dashboard configurations
        var dashboards = {
            'simulation': {
                title: 'Simulation Field Model Dashboard',
                charts: ['Patient Accrual', 'Patient Gender', 'Patient Age', 'Lead Model', 'Disease', 'IPG Type']
            },
            'lead-contact': {
                title: 'Lead Contacts Dashboard',
                charts: ['Contact Volume', 'Response Rate', 'Lead Quality', 'Conversion Rate']
            },
            'fiber-tracts': {
                title: 'Fiber Tracts Dashboard',
                charts: ['Tract Density', 'Connection Strength', 'Pathway Analysis', 'Region Activity']
            }
        };

        // Initialize charts when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initDashboard('simulation');
        });

        // Dashboard switching function
        function switchDashboard(dashboardId) {
            currentDashboard = dashboardId;
            clearAllCharts();
            initDashboard(dashboardId);
            showNotification('Switched to ' + dashboards[dashboardId].title);
        }

        // Initialize dashboard
        function initDashboard(dashboardId) {
            currentDashboard = dashboardId;
            clearDashboardGrid();
            createDashboardWidgets(dashboardId);
            setTimeout(function() {
                initChartsForDashboard(dashboardId);
            }, 100);
        }

        // Clear dashboard grid
        function clearDashboardGrid() {
            var grid = document.querySelector('.dashboard-grid');
            grid.innerHTML = '';
        }

        // Create dashboard widgets
        function createDashboardWidgets(dashboardId) {
            var config = dashboards[dashboardId];
            var grid = document.querySelector('.dashboard-grid');
            
            config.charts.forEach(function(chartTitle, index) {
                var widget = document.createElement('div');
                widget.className = 'chart-widget';
                widget.innerHTML = 
                    '<div class="widget-header">' +
                        '<div class="widget-title">' + chartTitle + '</div>' +
                        '<div class="widget-actions">' +
                            '<button class="action-btn" onclick="editChart(' + (index + 1) + ')" title="More options">' +
                                '<span class="material-icons">more_vert</span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="chart-container">' +
                        '<canvas id="chart' + (index + 1) + '"></canvas>' +
                    '</div>';
                
                grid.appendChild(widget);
            });
        }

        // Clear all chart instances
        function clearAllCharts() {
            Object.keys(dashboardCharts).forEach(function(key) {
                if (dashboardCharts[key]) {
                    dashboardCharts[key].destroy();
                    delete dashboardCharts[key];
                }
            });
        }

        // Initialize charts for specific dashboard
        function initChartsForDashboard(dashboardId) {
            switch(dashboardId) {
                case 'simulation':
                    initSimulationCharts();
                    break;
                case 'lead-contact':
                    initLeadContactCharts();
                    break;
                case 'fiber-tracts':
                    initFiberTractsCharts();
                    break;
            }
        }

        // Initialize simulation dashboard charts
        function initSimulationCharts() {
            // Chart 1 - Patient Accrual (Line Chart)
            var ctx1 = document.getElementById('chart1').getContext('2d');
            dashboardCharts['chart1'] = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['May-2023', 'Jun-2023', 'Jul-2023', 'Aug-2023', 'Sep-2023', 'Oct-2023', 'Nov-2023', 'Dec-2023', 'Jan-2024', 'Feb-2024', 'Mar-2024', 'Apr-2024'],
                    datasets: [{
                        label: 'Patients',
                        data: [1, 0, 0, 0, 1, 3, 1, 0, 1, 0, 2, 0],
                        borderColor: '#d4a421',
                        backgroundColor: 'rgba(212, 164, 33, 0.1)',
                        borderWidth: 2,
                        pointBackgroundColor: '#d4a421',
                        pointBorderColor: '#d4a421',
                        pointRadius: 4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc', maxTicksLimit: 6 }
                        },
                        y: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc', beginAtZero: true, max: 4 }
                        }
                    }
                }
            });

            // Chart 2 - Patient Gender (Pie Chart)
            var ctx2 = document.getElementById('chart2').getContext('2d');
            dashboardCharts['chart2'] = new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: ['Male', 'Female'],
                    datasets: [{
                        data: [57.14, 42.86],
                        backgroundColor: ['#c77dff', '#f9e79f'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { color: '#ccc', usePointStyle: true }
                        }
                    }
                }
            });

            // Chart 3 - Patient Age (Bar Chart)
            var ctx3 = document.getElementById('chart3').getContext('2d');
            dashboardCharts['chart3'] = new Chart(ctx3, {
                type: 'bar',
                data: {
                    labels: ['60-65', '65-70', '70-75', '75-80', '80-85', '85-90', '90-95', '95-100', '100-105', '105-110', '110-115', '115+'],
                    datasets: [{
                        label: 'Patients',
                        data: [1, 0, 3, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                        backgroundColor: '#d4a421',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc', maxTicksLimit: 8 }
                        },
                        y: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc', beginAtZero: true, max: 4 }
                        }
                    }
                }
            });

            // Chart 4 - Lead Model (Pie Chart)
            var ctx4 = document.getElementById('chart4').getContext('2d');
            dashboardCharts['chart4'] = new Chart(ctx4, {
                type: 'pie',
                data: {
                    labels: ['DB-2201', 'DB-2202'],
                    datasets: [{
                        data: [75, 25],
                        backgroundColor: ['#e91e63', '#4caf50'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { color: '#ccc', usePointStyle: true }
                        }
                    }
                }
            });

            // Chart 5 - Disease (Bar Chart)
            var ctx5 = document.getElementById('chart5').getContext('2d');
            dashboardCharts['chart5'] = new Chart(ctx5, {
                type: 'bar',
                data: {
                    labels: ['Disease A', 'Disease B', 'Disease C'],
                    datasets: [{
                        label: 'Cases',
                        data: [2, 1, 3],
                        backgroundColor: '#d4a421',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc' }
                        },
                        y: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc', beginAtZero: true, max: 4 }
                        }
                    }
                }
            });

            // Chart 6 - IPG Type (Pie Chart)
            var ctx6 = document.getElementById('chart6').getContext('2d');
            dashboardCharts['chart6'] = new Chart(ctx6, {
                type: 'pie',
                data: {
                    labels: ['Type A', 'Type B', 'Type C'],
                    datasets: [{
                        data: [40, 35, 25],
                        backgroundColor: ['#2196f3', '#ff9800', '#4caf50'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { color: '#ccc', usePointStyle: true }
                        }
                    }
                }
            });
        }

        // Initialize Lead Contacts dashboard charts
        function initLeadContactCharts() {
            // Chart 1 - Contact Volume (Bar Chart)
            var ctx1 = document.getElementById('chart1').getContext('2d');
            dashboardCharts['chart1'] = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Contacts',
                        data: [45, 52, 38, 67, 73, 89],
                        backgroundColor: '#d4a421',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc' }
                        },
                        y: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc', beginAtZero: true }
                        }
                    }
                }
            });

            // Chart 2 - Response Rate (Line Chart)
            var ctx2 = document.getElementById('chart2').getContext('2d');
            dashboardCharts['chart2'] = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Response Rate %',
                        data: [65, 72, 68, 78],
                        borderColor: '#4caf50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 2,
                        pointBackgroundColor: '#4caf50',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc' }
                        },
                        y: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc', beginAtZero: true, max: 100 }
                        }
                    }
                }
            });

            // Chart 3 - Lead Quality (Doughnut Chart)
            var ctx3 = document.getElementById('chart3').getContext('2d');
            dashboardCharts['chart3'] = new Chart(ctx3, {
                type: 'doughnut',
                data: {
                    labels: ['High Quality', 'Medium Quality', 'Low Quality'],
                    datasets: [{
                        data: [45, 35, 20],
                        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { color: '#ccc', usePointStyle: true }
                        }
                    }
                }
            });

            // Chart 4 - Conversion Rate (Area Chart)
            var ctx4 = document.getElementById('chart4').getContext('2d');
            dashboardCharts['chart4'] = new Chart(ctx4, {
                type: 'line',
                data: {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    datasets: [{
                        label: 'Conversion Rate',
                        data: [12, 18, 15, 22],
                        borderColor: '#e91e63',
                        backgroundColor: 'rgba(233, 30, 99, 0.2)',
                        borderWidth: 2,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc' }
                        },
                        y: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc', beginAtZero: true }
                        }
                    }
                }
            });
        }

        // Initialize Fiber Tracts dashboard charts
        function initFiberTractsCharts() {
            // Chart 1 - Tract Density (Heatmap-style Bar Chart)
            var ctx1 = document.getElementById('chart1').getContext('2d');
            dashboardCharts['chart1'] = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['Region A', 'Region B', 'Region C', 'Region D', 'Region E'],
                    datasets: [{
                        label: 'Density',
                        data: [85, 92, 78, 96, 88],
                        backgroundColor: ['#1e88e5', '#43a047', '#fb8c00', '#e53935', '#8e24aa'],
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc' }
                        },
                        y: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc', beginAtZero: true, max: 100 }
                        }
                    }
                }
            });

            // Chart 2 - Connection Strength (Radar Chart)
            var ctx2 = document.getElementById('chart2').getContext('2d');
            dashboardCharts['chart2'] = new Chart(ctx2, {
                type: 'radar',
                data: {
                    labels: ['Frontal', 'Parietal', 'Temporal', 'Occipital', 'Cerebellar'],
                    datasets: [{
                        label: 'Strength',
                        data: [80, 90, 75, 85, 70],
                        borderColor: '#d4a421',
                        backgroundColor: 'rgba(212, 164, 33, 0.2)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        r: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc', beginAtZero: true, max: 100 },
                            pointLabels: { color: '#ccc' }
                        }
                    }
                }
            });

            // Chart 3 - Pathway Analysis (Scatter Plot)
            var ctx3 = document.getElementById('chart3').getContext('2d');
            dashboardCharts['chart3'] = new Chart(ctx3, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Pathways',
                        data: [
                            {x: 10, y: 20}, {x: 15, y: 30}, {x: 25, y: 45},
                            {x: 30, y: 50}, {x: 40, y: 65}, {x: 50, y: 70}
                        ],
                        backgroundColor: '#ff5722',
                        borderColor: '#ff5722'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc' }
                        },
                        y: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc' }
                        }
                    }
                }
            });

            // Chart 4 - Region Activity (Line Chart)
            var ctx4 = document.getElementById('chart4').getContext('2d');
            dashboardCharts['chart4'] = new Chart(ctx4, {
                type: 'line',
                data: {
                    labels: ['0ms', '100ms', '200ms', '300ms', '400ms', '500ms'],
                    datasets: [{
                        label: 'Activity Level',
                        data: [20, 45, 78, 92, 65, 34],
                        borderColor: '#9c27b0',
                        backgroundColor: 'rgba(156, 39, 176, 0.1)',
                        borderWidth: 2,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc' }
                        },
                        y: {
                            grid: { color: '#4a4a4a' },
                            ticks: { color: '#ccc', beginAtZero: true }
                        }
                    }
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
            showNotification('Editing chart ' + chartId);
            openModal('chartModal');
        }

        function duplicateChart(chartId) {
            var grid = document.querySelector('.dashboard-grid');
            var newWidget = createChartWidget(chartCounter++, 'Chart Copy', 'bar');
            grid.appendChild(newWidget);
            showNotification('Chart duplicated!');
        }

        function deleteChart(chartId) {
            if (confirm('Delete this chart?')) {
                showNotification('Chart deleted');
            }
        }

        function saveChart() {
            var title = document.getElementById('chartTitle').value || 'New Chart';
            var type = document.getElementById('chartType').value;
            var grid = document.querySelector('.dashboard-grid');
            var newWidget = createChartWidget(chartCounter++, title, type);
            grid.appendChild(newWidget);
            closeModal('chartModal');
            showNotification('Chart "' + title + '" created!');
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
                    '<h4>Dynamic Chart</h4>' +
                    '<div class="code-structure">' +
                        'Type: ' + type + '<br>' +
                        'Created via ChartConfig<br>' +
                        'Supports editing operations' +
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
                    label: 'Data',
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
                alert('Please enter a filter value');
                return;
            }

            var filtersContainer = document.getElementById('filtersPanel');
            var addButton = filtersContainer.querySelector('.add-filter-btn');
            
            var newFilter = document.createElement('div');
            newFilter.className = 'filter-item';
            newFilter.innerHTML = 
                '<div class="filter-field">' +
                    '<span class="filter-field-name">' + getFieldLabel(field) + '</span>' +
                    '<button class="filter-remove" onclick="removeFilter(this)">×</button>' +
                '</div>' +
                '<div class="filter-details">' + operator + ' • ' + value + '</div>';

            filtersContainer.insertBefore(newFilter, addButton);
            closeModal('filterModal');
            showNotification('Filter added!');
            document.getElementById('filterValue').value = '';
        }

        function removeFilter(button) {
            button.closest('.filter-item').remove();
            showNotification('Filter removed');
        }

        // New functions for the dark theme layout
        function toggleFilters() {
            var panel = document.getElementById('filtersPanel');
            panel.classList.toggle('open');
        }

        function openDataSources() {
            showNotification('Data Sources panel opened');
        }

        function getFieldLabel(field) {
            switch(field) {
                case 'age': return 'Age';
                case 'gender': return 'Gender';
                case 'region': return 'Region';
                case 'status': return 'Status';
                case 'date': return 'Date';
                default: return field;
            }
        }

        function updateFilterOptions() {
            var type = document.getElementById('filterType').value;
            var operatorSelect = document.getElementById('filterOperator');
            
            operatorSelect.innerHTML = '';
            
            if (type === 'text') {
                addOption(operatorSelect, 'eq', 'Equals');
                addOption(operatorSelect, 'ne', 'Not Equals');
                addOption(operatorSelect, 'contains', 'Contains');
            } else if (type === 'number') {
                addOption(operatorSelect, 'eq', 'Equals');
                addOption(operatorSelect, 'gt', 'Greater Than');
                addOption(operatorSelect, 'lt', 'Less Than');
            } else {
                addOption(operatorSelect, 'eq', 'Equals');
                addOption(operatorSelect, 'ne', 'Not Equals');
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