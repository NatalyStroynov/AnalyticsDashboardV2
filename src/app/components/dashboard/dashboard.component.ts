import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartDirective } from '../../directives/chart.directive';

export interface Chart {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: any;
  options: any;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  charts: Chart[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboards: Dashboard[] = [
    {
      id: 'simulation',
      name: 'Simulation Field Model',
      description: 'Medical simulation and field data analysis',
      charts: [
        {
          id: 'chart1',
          title: 'Patient Accrual',
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Patients',
              data: [65, 78, 90, 81, 95, 102],
              borderColor: '#d4a421',
              backgroundColor: 'rgba(212, 164, 33, 0.1)',
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { labels: { color: '#ffffff' } },
              title: { display: true, text: 'Patient Accrual', color: '#ffffff' }
            },
            scales: {
              x: { ticks: { color: '#ffffff' }, grid: { color: '#4a4a4a' } },
              y: { ticks: { color: '#ffffff' }, grid: { color: '#4a4a4a' } }
            }
          }
        }
      ]
    }
  ];

  currentDashboard: Dashboard = this.dashboards[0];
  showCreateModal = false;
  showChartModal = false;
  newDashboardName = '';
  newDashboardDescription = '';
  newChartTitle = '';
  newChartType: 'bar' | 'line' | 'pie' | 'doughnut' = 'bar';

  ngOnInit(): void {
    this.loadDashboard(this.currentDashboard.id);
  }

  loadDashboard(dashboardId: string): void {
    const dashboard = this.dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      this.currentDashboard = dashboard;
    }
  }

  createDashboard(): void {
    if (this.newDashboardName.trim()) {
      const newDashboard: Dashboard = {
        id: `dashboard_${Date.now()}`,
        name: this.newDashboardName.trim(),
        description: this.newDashboardDescription.trim(),
        charts: []
      };
      
      this.dashboards.push(newDashboard);
      this.currentDashboard = newDashboard;
      this.showCreateModal = false;
      this.newDashboardName = '';
      this.newDashboardDescription = '';
    }
  }

  addChart(): void {
    if (this.newChartTitle.trim()) {
      const newChart: Chart = {
        id: `chart_${Date.now()}`,
        title: this.newChartTitle.trim(),
        type: this.newChartType,
        data: this.generateSampleData(this.newChartType),
        options: this.generateChartOptions(this.newChartTitle.trim())
      };
      
      this.currentDashboard.charts.push(newChart);
      this.showChartModal = false;
      this.newChartTitle = '';
      this.newChartType = 'bar';
    }
  }

  private generateSampleData(type: string): any {
    const labels = ['A', 'B', 'C', 'D'];
    const data = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), 
                  Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
    
    return {
      labels,
      datasets: [{
        label: 'Data',
        data,
        backgroundColor: type === 'line' ? 'rgba(212, 164, 33, 0.1)' : 
                        ['#d4a421', '#4CAF50', '#2196F3', '#ff9800'],
        borderColor: '#d4a421'
      }]
    };
  }

  private generateChartOptions(title: string): any {
    return {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#ffffff' } },
        title: { display: true, text: title, color: '#ffffff' }
      },
      scales: {
        x: { ticks: { color: '#ffffff' }, grid: { color: '#4a4a4a' } },
        y: { ticks: { color: '#ffffff' }, grid: { color: '#4a4a4a' } }
      }
    };
  }

  editChart(chartId: string): void {
    console.log(`Editing chart: ${chartId}`);
  }

  duplicateChart(chartId: string): void {
    const chart = this.currentDashboard.charts.find(c => c.id === chartId);
    if (chart) {
      const duplicate: Chart = {
        ...chart,
        id: `chart_${Date.now()}`,
        title: `${chart.title} (Copy)`
      };
      this.currentDashboard.charts.push(duplicate);
    }
  }

  deleteChart(chartId: string): void {
    this.currentDashboard.charts = this.currentDashboard.charts.filter(c => c.id !== chartId);
  }

  exportChart(chartId: string): void {
    console.log(`Exporting chart: ${chartId}`);
  }
}