const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const port = 5000;

// Serve static files
app.use(express.static(path.join(__dirname, 'src')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Main route serves the Angular app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// API routes for development
app.get('/api/dashboards', (req, res) => {
    res.json([
        {
            id: 'simulation',
            name: 'Simulation Field Model Dashboard',
            description: 'Simulation data analysis'
        },
        {
            id: 'lead-contact', 
            name: 'Lead Contacts Dashboard',
            description: 'Lead management and contact tracking'
        },
        {
            id: 'fiber-tracts',
            name: 'Fiber Tracts Dashboard', 
            description: 'Fiber network analysis'
        }
    ]);
});

app.get('/api/charts/:dashboardId', (req, res) => {
    const { dashboardId } = req.params;
    
    const chartData = {
        'simulation': [
            {
                id: 'chart1',
                title: 'Patient Accrual',
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Patients',
                        data: [12, 19, 15, 25, 22, 30],
                        borderColor: '#d4a421',
                        backgroundColor: 'rgba(212, 164, 33, 0.1)',
                        borderWidth: 2,
                        fill: true
                    }]
                }
            },
            {
                id: 'chart2', 
                title: 'Treatment Outcomes',
                type: 'bar',
                data: {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    datasets: [{
                        label: 'Success Rate',
                        data: [85, 92, 78, 89],
                        backgroundColor: '#d4a421',
                        borderRadius: 4
                    }]
                }
            },
            {
                id: 'chart3',
                title: 'Resource Utilization', 
                type: 'pie',
                data: {
                    labels: ['ICU', 'General Ward', 'Outpatient', 'Emergency'],
                    datasets: [{
                        data: [30, 45, 15, 10],
                        backgroundColor: ['#2196f3', '#4caf50', '#ff9800', '#e91e63'],
                        borderWidth: 0
                    }]
                }
            }
        ],
        'lead-contact': [
            {
                id: 'chart4',
                title: 'Lead Generation',
                type: 'line', 
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'New Leads',
                        data: [45, 62, 38, 55],
                        borderColor: '#4caf50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 2,
                        fill: true
                    }]
                }
            },
            {
                id: 'chart5',
                title: 'Conversion Rate',
                type: 'doughnut',
                data: {
                    labels: ['Converted', 'In Progress', 'Lost'],
                    datasets: [{
                        data: [65, 25, 10],
                        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                        borderWidth: 0
                    }]
                }
            }
        ],
        'fiber-tracts': [
            {
                id: 'chart6',
                title: 'Network Performance',
                type: 'bar',
                data: {
                    labels: ['Node A', 'Node B', 'Node C', 'Node D'],
                    datasets: [{
                        label: 'Throughput (Mbps)',
                        data: [120, 190, 150, 250],
                        backgroundColor: '#2196f3',
                        borderRadius: 4
                    }]
                }
            }
        ]
    };
    
    res.json(chartData[dashboardId] || []);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Angular Dashboard Server running at http://0.0.0.0:${port}`);
    console.log('🚀 Angular CLI Development Server');
    console.log('✓ Dashboard switching with 3 types');
    console.log('✓ Chart.js integration');
    console.log('✓ Dark theme with golden accents');
    console.log('✓ API endpoints for data');
});