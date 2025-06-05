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
                
                <button class="btn">
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
                
                <button class="btn">
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
                        <span class="material-icons">more_vert</span>
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
                        <span class="material-icons">more_vert</span>
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