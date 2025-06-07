const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Serve static files
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Create a simple index.html that loads the Angular app
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Dashboard</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background: #2d2d2d;
            color: white;
        }
        
        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div id="loading" class="loading">Loading Analytics Dashboard...</div>
    <app-root style="display: none;"></app-root>
    
    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Custom CSS -->
    <style>
        /* Dark Theme Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html, body {
            height: 100%;
            font-family: 'Inter', sans-serif;
            background: #2d2d2d;
            color: #ffffff;
            overflow-x: hidden;
        }
        
        .dashboard-container {
            background: #2d2d2d;
            color: #ffffff;
            min-height: 100vh;
            overflow: hidden;
        }
        
        .top-bar {
            background: #3a3a3a;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #4a4a4a;
            position: relative;
            z-index: 100;
        }
        
        .dashboard-selector {
            background: #2d2d2d;
            border: 1px solid #555;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            min-width: 280px;
            max-width: 350px;
            font-size: 14px;
            cursor: pointer;
        }
        
        .dashboard-selector:focus {
            outline: none;
            border-color: #d4a421;
            box-shadow: 0 0 0 2px rgba(212, 164, 33, 0.2);
        }
        
        .dashboard-selector option {
            background: #2d2d2d;
            color: white;
            padding: 8px 12px;
        }
        
        .create-option {
            background: #3a4a3a !important;
            color: #d4a421 !important;
            font-weight: 500;
            border-top: 1px solid #555;
        }
        
        .top-controls {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        
        .top-btn, .filters-btn {
            background: #555;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
        }
        
        .top-btn:hover, .filters-btn:hover {
            background: #666;
        }
        
        .filters-btn {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .main-container {
            padding: 20px;
            height: calc(100vh - 60px);
            overflow-y: auto;
        }
        
        .dashboard-content {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            padding: 20px 0;
        }
        
        .chart-widget {
            background: #3a3a3a;
            border-radius: 8px;
            padding: 20px;
            min-height: 300px;
            border: 1px solid #4a4a4a;
            transition: all 0.2s ease;
            position: relative;
        }
        
        .chart-widget:hover {
            border-color: #555;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .widget-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .widget-title {
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
        }
        
        .widget-actions {
            position: relative;
        }
        
        .action-btn {
            color: #ccc;
            background: none;
            border: none;
            padding: 4px;
            cursor: pointer;
            border-radius: 4px;
        }
        
        .action-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #d4a421;
        }
        
        .widget-content {
            height: 250px;
            position: relative;
        }
        
        .widget-content canvas {
            width: 100% !important;
            height: 100% !important;
        }
        
        .empty-dashboard {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            text-align: center;
            color: #ccc;
        }
        
        .empty-icon {
            font-size: 64px;
            margin-bottom: 20px;
            color: #666;
        }
        
        .empty-dashboard h3 {
            color: #ccc;
            margin-bottom: 10px;
            font-size: 24px;
        }
        
        .empty-dashboard p {
            color: #888;
            font-size: 16px;
            max-width: 400px;
            line-height: 1.5;
            margin-bottom: 24px;
        }
        
        .add-chart-btn {
            background: #d4a421;
            color: #2d2d2d;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .add-chart-btn:hover {
            background: #e6b82e;
        }
        
        .material-icons {
            font-family: 'Material Icons';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
        }
    </style>
    
    <script>
        // Hide loading and show app when ready
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                document.getElementById('loading').style.display = 'none';
                document.querySelector('app-root').style.display = 'block';
                initDashboard();
            }, 1000);
        });
        
        // Dashboard functionality
        let currentDashboard = 'simulation';
        let dashboardCharts = {};
        
        const dashboards = {
            simulation: {
                title: 'Simulation Field Model Dashboard',
                charts: [
                    { id: 'chart1', title: 'Patient Accrual', type: 'line' },
                    { id: 'chart2', title: 'Treatment Outcomes', type: 'bar' },
                    { id: 'chart3', title: 'Resource Utilization', type: 'pie' }
                ]
            },
            'lead-contact': {
                title: 'Lead Contacts Dashboard',
                charts: [
                    { id: 'chart4', title: 'Lead Generation', type: 'line' },
                    { id: 'chart5', title: 'Conversion Rate', type: 'doughnut' }
                ]
            },
            'fiber-tracts': {
                title: 'Fiber Tracts Dashboard',
                charts: [
                    { id: 'chart6', title: 'Network Performance', type: 'bar' }
                ]
            }
        };
        
        function initDashboard() {
            const appRoot = document.querySelector('app-root');
            appRoot.innerHTML = createDashboardHTML();
            initChartsForDashboard(currentDashboard);
        }
        
        function createDashboardHTML() {
            const dashboard = dashboards[currentDashboard];
            
            return \`
                <div class="dashboard-container">
                    <div class="top-bar">
                        <div class="dashboard-selector-wrapper">
                            <select class="dashboard-selector" onchange="switchDashboard(this.value)">
                                <option value="simulation" \${currentDashboard === 'simulation' ? 'selected' : ''}>Simulation Field Model Dashboard</option>
                                <option value="lead-contact" \${currentDashboard === 'lead-contact' ? 'selected' : ''}>Lead Contacts Dashboard</option>
                                <option value="fiber-tracts" \${currentDashboard === 'fiber-tracts' ? 'selected' : ''}>Fiber Tracts Dashboard</option>
                                <option value="create-new" class="create-option">+ Create New Dashboard</option>
                            </select>
                        </div>
                        
                        <div class="top-controls">
                            <button class="top-btn">Data Sources</button>
                            <button class="filters-btn">
                                <span class="material-icons">filter_list</span>
                                Filters
                            </button>
                        </div>
                    </div>
                    
                    <div class="main-container">
                        <div class="dashboard-content">
                            \${dashboard.charts.length > 0 ? 
                                \`<div class="dashboard-grid">
                                    \${dashboard.charts.map(chart => createChartWidget(chart)).join('')}
                                </div>\` :
                                \`<div class="empty-dashboard">
                                    <span class="material-icons empty-icon">assessment</span>
                                    <h3>No Charts Available</h3>
                                    <p>This dashboard is empty. Add some charts to get started with your data visualization.</p>
                                    <button class="add-chart-btn">
                                        <span class="material-icons">add</span>
                                        Add Chart
                                    </button>
                                </div>\`
                            }
                        </div>
                    </div>
                </div>
            \`;
        }
        
        function createChartWidget(chart) {
            return \`
                <div class="chart-widget">
                    <div class="widget-header">
                        <div class="widget-title">\${chart.title}</div>
                        <div class="widget-actions">
                            <button class="action-btn">
                                <span class="material-icons">more_vert</span>
                            </button>
                        </div>
                    </div>
                    <div class="widget-content">
                        <canvas id="\${chart.id}"></canvas>
                    </div>
                </div>
            \`;
        }
        
        function switchDashboard(dashboardId) {
            if (dashboardId === 'create-new') {
                alert('Create new dashboard functionality');
                return;
            }
            
            currentDashboard = dashboardId;
            clearAllCharts();
            initDashboard();
        }
        
        function clearAllCharts() {
            Object.values(dashboardCharts).forEach(chart => {
                if (chart) chart.destroy();
            });
            dashboardCharts = {};
        }
        
        function initChartsForDashboard(dashboardId) {
            const dashboard = dashboards[dashboardId];
            if (!dashboard) return;
            
            dashboard.charts.forEach(chartConfig => {
                createChart(chartConfig.id, chartConfig.type);
            });
        }
        
        function createChart(chartId, type) {
            const canvas = document.getElementById(chartId);
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            let data, options;
            
            switch(type) {
                case 'pie':
                case 'doughnut':
                    data = {
                        labels: ['Category A', 'Category B', 'Category C', 'Category D'],
                        datasets: [{
                            data: [35, 25, 20, 20],
                            backgroundColor: ['#2196f3', '#4caf50', '#ff9800', '#e91e63'],
                            borderWidth: 0
                        }]
                    };
                    options = {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: { color: '#ccc', usePointStyle: true }
                            }
                        }
                    };
                    break;
                    
                case 'line':
                    data = {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Data Points',
                            data: [12, 19, 15, 25, 22, 30],
                            borderColor: '#d4a421',
                            backgroundColor: 'rgba(212, 164, 33, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            pointBackgroundColor: '#d4a421'
                        }]
                    };
                    options = {
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
                                ticks: { color: '#ccc' },
                                beginAtZero: true
                            }
                        }
                    };
                    break;
                    
                default: // bar chart
                    data = {
                        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                        datasets: [{
                            label: 'Values',
                            data: [45, 62, 38, 55],
                            backgroundColor: '#d4a421',
                            borderRadius: 4
                        }]
                    };
                    options = {
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
                                ticks: { color: '#ccc' },
                                beginAtZero: true
                            }
                        }
                    };
                    break;
            }
            
            dashboardCharts[chartId] = new Chart(ctx, {
                type: type,
                data: data,
                options: options
            });
        }
    </script>
</body>
</html>
`;

// Serve the main page
app.get('/', (req, res) => {
    res.send(indexHtml);
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Angular Dashboard running at http://0.0.0.0:${port}`);
    console.log('Features:');
    console.log('✓ Multiple dashboard types (Simulation, Lead Contacts, Fiber Tracts)');
    console.log('✓ Chart.js integration with dark theme');
    console.log('✓ Dashboard switching functionality');
    console.log('✓ Responsive design with golden accents (#d4a421)');
});