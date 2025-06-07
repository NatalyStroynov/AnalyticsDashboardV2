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

export interface FilterClause {
  field: string;
  operator: 'includes' | 'equals' | 'greater' | 'less';
  value: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  dashboards: Dashboard[] = [
    {
      id: 'simulation',
      name: 'Simulation Field Model Dashboard',
      description: 'Medical simulation and field data analysis',
      charts: [
        {
          id: 'patient-accrual',
          title: 'Patient Accrual',
          type: 'line',
          data: {
            labels: ['May-2023', 'Jun-2023', 'Jul-2023', 'Aug-2023', 'Sep-2023', 'Oct-2023', 'Nov-2023', 'Dec-2023', 'Jan-2024', 'Feb-2024', 'Mar-2024', 'Apr-2024'],
            datasets: [{
              label: 'Patients',
              data: [1, 0, 0, 1, 0, 0, 0, 0, 3, 0, 2, 0],
              borderColor: '#d4a421',
              backgroundColor: 'rgba(212, 164, 33, 0.1)',
              tension: 0.1,
              pointBackgroundColor: '#d4a421',
              pointBorderColor: '#d4a421',
              pointRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: false }
            },
            scales: {
              x: { 
                ticks: { 
                  color: '#888888',
                  font: { size: 11 }
                }, 
                grid: { color: '#404040' },
                border: { color: '#404040' }
              },
              y: { 
                ticks: { 
                  color: '#888888',
                  font: { size: 11 }
                }, 
                grid: { color: '#404040' },
                border: { color: '#404040' }
              }
            }
          }
        },
        {
          id: 'patient-gender',
          title: 'Patient Gender',
          type: 'pie',
          data: {
            labels: ['Male', 'Female'],
            datasets: [{
              data: [42.86, 57.14],
              backgroundColor: ['#9c4dcc', '#f8bbd9'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                display: true,
                position: 'right',
                labels: { 
                  color: '#ffffff',
                  font: { size: 12 },
                  usePointStyle: true
                }
              }
            }
          }
        },
        {
          id: 'patient-age',
          title: 'Patient Age',
          type: 'bar',
          data: {
            labels: ['80-85', '85-90', '90-95', '95-100', '100-105', '105-110', '110-115', '115+'],
            datasets: [{
              label: 'Patients',
              data: [1, 0, 3, 0, 0, 0, 1, 1],
              backgroundColor: '#d4a421',
              borderWidth: 0
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
                ticks: { 
                  color: '#888888',
                  font: { size: 11 }
                }, 
                grid: { color: '#404040' },
                border: { color: '#404040' }
              },
              y: { 
                ticks: { 
                  color: '#888888',
                  font: { size: 11 }
                }, 
                grid: { color: '#404040' },
                border: { color: '#404040' }
              }
            }
          }
        },
        {
          id: 'lead-model',
          title: 'Lead Model',
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
                display: true,
                position: 'right',
                labels: { 
                  color: '#ffffff',
                  font: { size: 12 },
                  usePointStyle: true
                }
              }
            }
          }
        },
        {
          id: 'disease',
          title: 'Disease',
          type: 'bar',
          data: {
            labels: ['Category 1', 'Category 2'],
            datasets: [{
              label: 'Count',
              data: [2, 0],
              backgroundColor: '#d4a421',
              borderWidth: 0
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
                ticks: { 
                  color: '#888888',
                  font: { size: 11 }
                }, 
                grid: { color: '#404040' },
                border: { color: '#404040' }
              },
              y: { 
                ticks: { 
                  color: '#888888',
                  font: { size: 11 }
                }, 
                grid: { color: '#404040' },
                border: { color: '#404040' }
              }
            }
          }
        },
        {
          id: 'ipg-type',
          title: 'IPG Type',
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
                display: true,
                position: 'right',
                labels: { 
                  color: '#ffffff',
                  font: { size: 12 },
                  usePointStyle: true
                }
              }
            }
          }
        }
      ]
    },
    {
      id: 'lead-contacts',
      name: 'Lead Contacts Dashboard',
      description: 'Lead generation and contact management',
      charts: []
    },
    {
      id: 'fiber-tracts',
      name: 'Fiber Tracts Dashboard',
      description: 'Network fiber and tract analysis',
      charts: []
    }
  ];

  currentDashboard: Dashboard = this.dashboards[0];
  showDashboardDropdown = false;
  showFiltersPanel = false;
  activeChartMenu: string | null = null;
  activeFilters: FilterClause[] = [
    { field: 'Gender', operator: 'includes', value: 'Male, Female' },
    { field: 'Age', operator: 'greater', value: '15' }
  ];

  ngOnInit(): void {
    this.loadDashboard(this.currentDashboard.id);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initializeCharts(), 100);
  }

  private initializeCharts(): void {
    this.currentDashboard.charts.forEach(chart => {
      const canvas = document.getElementById(chart.id) as HTMLCanvasElement;
      if (canvas) {
        this.renderChartOnCanvas(canvas, chart);
      }
    });
  }

  private renderChartOnCanvas(canvas: HTMLCanvasElement, chart: Chart): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables);
      
      new Chart(ctx, {
        type: chart.type as any,
        data: chart.data,
        options: chart.options
      });
    });
  }

  // Dashboard Management
  toggleDashboardDropdown(): void {
    this.showDashboardDropdown = !this.showDashboardDropdown;
  }

  selectDashboard(dashboardId: string): void {
    this.loadDashboard(dashboardId);
    this.showDashboardDropdown = false;
  }

  loadDashboard(dashboardId: string): void {
    const dashboard = this.dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      this.currentDashboard = dashboard;
      setTimeout(() => this.initializeCharts(), 100);
    }
  }

  showCreateDashboardModal(): void {
    this.showDashboardDropdown = false;
    console.log('Create dashboard modal');
  }

  editDashboard(dashboardId: string): void {
    console.log(`Editing dashboard: ${dashboardId}`);
  }

  deleteDashboard(dashboardId: string): void {
    if (this.dashboards.length > 1) {
      this.dashboards = this.dashboards.filter(d => d.id !== dashboardId);
      if (this.currentDashboard.id === dashboardId) {
        this.currentDashboard = this.dashboards[0];
        this.loadDashboard(this.currentDashboard.id);
      }
    }
  }

  // Chart Management
  showChartConfigModal(): void {
    console.log('Chart configuration modal');
  }

  toggleChartMenu(chartId: string): void {
    this.activeChartMenu = this.activeChartMenu === chartId ? null : chartId;
  }

  editChart(chartId: string): void {
    this.activeChartMenu = null;
    console.log(`Editing chart: ${chartId}`);
  }

  duplicateChart(chartId: string): void {
    this.activeChartMenu = null;
    const chart = this.currentDashboard.charts.find(c => c.id === chartId);
    if (chart) {
      const duplicate: Chart = {
        ...chart,
        id: `chart_${Date.now()}`,
        title: `${chart.title} (Copy)`
      };
      this.currentDashboard.charts.push(duplicate);
      setTimeout(() => this.initializeCharts(), 100);
    }
  }

  deleteChart(chartId: string): void {
    this.activeChartMenu = null;
    this.currentDashboard.charts = this.currentDashboard.charts.filter(c => c.id !== chartId);
  }

  exportChart(chartId: string): void {
    this.activeChartMenu = null;
    console.log(`Exporting chart: ${chartId}`);
  }

  // Data Sources
  showDataSources(): void {
    console.log('Showing data sources');
  }

  // Filters Management
  toggleFiltersPanel(): void {
    this.showFiltersPanel = !this.showFiltersPanel;
  }

  addNewFilter(): void {
    this.activeFilters.push({
      field: '',
      operator: 'includes',
      value: ''
    });
  }

  removeFilter(index: number): void {
    this.activeFilters.splice(index, 1);
  }

  applyFilters(): void {
    console.log('Applying filters:', this.activeFilters);
  }
}