import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart as ChartJS, registerables } from 'chart.js';

import { ChartDirective } from '../../directives/chart.directive';
import { DashboardState, Chart, Dashboard, FilterClause } from '../../store/dashboard.state';
import * as DashboardActions from '../../store/dashboard.actions';
import * as DashboardSelectors from '../../store/dashboard.selectors';

// Register Chart.js components
ChartJS.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Observable state from NgRx store
  dashboards$ = this.store.select(DashboardSelectors.selectAllDashboards);
  currentDashboard$ = this.store.select(DashboardSelectors.selectCurrentDashboard);
  currentDashboardCharts$ = this.store.select(DashboardSelectors.selectCurrentDashboardCharts);
  activeFilters$ = this.store.select(DashboardSelectors.selectActiveFilters);
  loading$ = this.store.select(DashboardSelectors.selectDashboardLoading);
  
  // Local component state for UI
  currentDashboard: Dashboard | null = null;
  dashboards: Dashboard[] = [];
  showDashboardDropdown = false;
  showFiltersPanel = false;
  activeChartMenu: string | null = null;
  showCreateModal = false;
  newDashboardName = '';
  newDashboardDescription = '';
  showEditChartModal = false;
  editingChart: any = { id: '', title: '', type: 'bar' };
  showAddChartModal = false;
  newChartTitle = '';
  newChartType: 'bar' | 'line' | 'pie' | 'doughnut' = 'bar';
  activeFilters: FilterClause[] = [];

  constructor(private store: Store<{ dashboard: DashboardState }>) {}

  ngOnInit(): void {
    // Load dashboards from store
    this.store.dispatch(DashboardActions.loadDashboards());
    
    // Subscribe to current dashboard charts changes
    this.currentDashboardCharts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(charts => {
        if (charts && charts.length > 0) {
          // Wait for DOM to be fully rendered
          setTimeout(() => this.initializeCharts(), 500);
        }
      });

    // Subscribe to current dashboard changes for UI state
    this.currentDashboard$
      .pipe(takeUntil(this.destroy$))
      .subscribe(dashboard => {
        this.currentDashboard = dashboard;
      });

    // Subscribe to dashboards list
    this.dashboards$
      .pipe(takeUntil(this.destroy$))
      .subscribe(dashboards => {
        this.dashboards = dashboards;
      });

    // Subscribe to active filters
    this.activeFilters$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        this.activeFilters = filters;
      });
  }

  ngAfterViewInit(): void {
    // Charts will be initialized through the currentDashboard$ subscription
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeCharts(): void {
    if (!this.currentDashboard || !this.currentDashboard.charts) return;
    
    console.log('Initializing charts for dashboard:', this.currentDashboard.name);
    console.log('Number of charts:', this.currentDashboard.charts.length);
    
    this.currentDashboard.charts.forEach(chart => {
      const canvas = document.getElementById(chart.id) as HTMLCanvasElement;
      console.log(`Looking for canvas with ID: ${chart.id}`);
      
      if (canvas) {
        console.log('Canvas found:', canvas.width, 'x', canvas.height);
        // Ensure canvas is properly sized
        if (canvas.width === 0 || canvas.height === 0) {
          canvas.width = 400;
          canvas.height = 220;
        }
        this.renderChartOnCanvas(canvas, chart);
      } else {
        console.error(`Canvas element not found for chart ID: ${chart.id}`);
        // Try to find it with a different approach
        const allCanvases = document.querySelectorAll('canvas');
        console.log('All canvas elements found:', allCanvases.length);
        allCanvases.forEach((c, index) => {
          console.log(`Canvas ${index}:`, c.id, c.className);
        });
      }
    });
  }

  private initializeChartsFromArray(charts: Chart[]): void {
    charts.forEach(chart => {
      const canvas = document.getElementById(chart.id) as HTMLCanvasElement;
      if (canvas) {
        this.renderChartOnCanvas(canvas, chart);
      }
    });
  }

  private renderChartOnCanvas(canvas: HTMLCanvasElement, chart: Chart): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    const existingChart = (canvas as any).chart;
    if (existingChart) {
      existingChart.destroy();
    }

    console.log('Rendering chart:', chart.title, 'Type:', chart.type);
    console.log('Chart.js available:', typeof ChartJS);
    console.log('Canvas element:', canvas.tagName, canvas.id);
    console.log('Canvas context available:', !!ctx);
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        }
      },
      scales: chart.type !== 'pie' && chart.type !== 'doughnut' ? {
        x: {
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: '#4a4a4a'
          }
        },
        y: {
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: '#4a4a4a'
          }
        }
      } : {}
    };

    // Merge options properly, avoiding conflicts
    const finalOptions = chart.type === 'pie' || chart.type === 'doughnut' 
      ? {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#ffffff'
              }
            }
          }
        }
      : {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#ffffff'
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#ffffff'
              },
              grid: {
                color: '#4a4a4a'
              }
            },
            y: {
              ticks: {
                color: '#ffffff'
              },
              grid: {
                color: '#4a4a4a'
              }
            }
          }
        };

    // Re-register Chart.js components to ensure they're available
    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables);
      
      console.log('Chart.js re-registered successfully');
      
      try {
        // Create deep copy of chart data to avoid readonly issues
        const chartDataCopy = JSON.parse(JSON.stringify(chart.data));
        
        const newChart = new Chart(ctx, {
          type: chart.type as any,
          data: chartDataCopy,
          options: finalOptions
        });
        
        console.log('Chart created successfully for:', chart.title);
        (canvas as any).chart = newChart;
        
      } catch (error: any) {
        console.error('Chart creation failed for', chart.title, ':', error.message);
        
        // Try with absolute minimal config
        try {
          const simpleChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['A'],
              datasets: [{
                data: [1],
                backgroundColor: '#ff0000'
              }]
            }
          });
          console.log('Fallback simple chart created for:', chart.title);
          (canvas as any).chart = simpleChart;
        } catch (fallbackError: any) {
          console.error('Even fallback chart failed:', fallbackError.message);
        }
      }
    }).catch(importError => {
      console.error('Failed to import Chart.js:', importError);
    });
  }

  // Dashboard Management
  toggleDashboardDropdown(): void {
    this.showDashboardDropdown = !this.showDashboardDropdown;
  }

  selectDashboard(dashboardId: string): void {
    this.store.dispatch(DashboardActions.setCurrentDashboard({ id: dashboardId }));
    this.showDashboardDropdown = false;
  }

  loadDashboard(dashboardId: string): void {
    this.store.dispatch(DashboardActions.setCurrentDashboard({ id: dashboardId }));
  }

  showCreateDashboardModal(): void {
    this.showDashboardDropdown = false;
    this.showCreateModal = true;
    this.newDashboardName = '';
    this.newDashboardDescription = '';
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newDashboardName = '';
    this.newDashboardDescription = '';
  }

  createDashboard(): void {
    if (this.newDashboardName.trim()) {
      this.store.dispatch(DashboardActions.createDashboard({
        name: this.newDashboardName.trim(),
        description: this.newDashboardDescription.trim()
      }));
      this.closeCreateModal();
    }
  }

  editDashboard(dashboardId: string): void {
    console.log(`Editing dashboard: ${dashboardId}`);
  }

  deleteDashboard(dashboardId: string): void {
    this.store.dispatch(DashboardActions.deleteDashboard({ id: dashboardId }));
  }

  // Chart Management
  showChartConfigModal(): void {
    this.showAddChartModal = true;
    this.newChartTitle = '';
    this.newChartType = 'bar';
  }

  closeAddChartModal(): void {
    this.showAddChartModal = false;
    this.newChartTitle = '';
    this.newChartType = 'bar';
  }

  addNewChart(): void {
    if (this.newChartTitle.trim() && this.currentDashboard) {
      const chartData = this.generateSampleDataForType(this.newChartType);
      const chartOptions = this.generateChartOptionsForType(this.newChartType);
      
      this.store.dispatch(DashboardActions.addChart({
        dashboardId: this.currentDashboard.id,
        chart: {
          title: this.newChartTitle.trim(),
          type: this.newChartType,
          data: chartData,
          options: chartOptions
        }
      }));
      this.closeAddChartModal();
    }
  }

  toggleChartMenu(chartId: string): void {
    this.activeChartMenu = this.activeChartMenu === chartId ? null : chartId;
  }

  editChart(chartId: string): void {
    this.activeChartMenu = null;
    if (!this.currentDashboard) return;
    
    const chart = this.currentDashboard.charts.find(c => c.id === chartId);
    if (chart) {
      this.editingChart = { ...chart };
      this.showEditChartModal = true;
    }
  }

  closeEditChartModal(): void {
    this.showEditChartModal = false;
    this.editingChart = { id: '', title: '', type: 'bar' };
  }

  saveChartChanges(): void {
    if (this.editingChart.title.trim() && this.currentDashboard) {
      const chartData = this.generateSampleDataForType(this.editingChart.type);
      const chartOptions = this.generateChartOptionsForType(this.editingChart.type);
      
      this.store.dispatch(DashboardActions.updateChart({
        dashboardId: this.currentDashboard.id,
        chartId: this.editingChart.id,
        updates: {
          title: this.editingChart.title.trim(),
          type: this.editingChart.type,
          data: chartData,
          options: chartOptions
        }
      }));
      this.closeEditChartModal();
    }
  }

  private destroyExistingChart(chartId: string): void {
    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
    if (canvas) {
      const existingChart = (canvas as any).chart;
      if (existingChart) {
        existingChart.destroy();
        delete (canvas as any).chart;
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    }
  }

  duplicateChart(chartId: string): void {
    this.activeChartMenu = null;
    if (this.currentDashboard) {
      this.store.dispatch(DashboardActions.duplicateChart({
        dashboardId: this.currentDashboard.id,
        chartId: chartId
      }));
    }
  }

  deleteChart(chartId: string): void {
    this.activeChartMenu = null;
    if (this.currentDashboard) {
      this.store.dispatch(DashboardActions.deleteChart({
        dashboardId: this.currentDashboard.id,
        chartId: chartId
      }));
    }
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
    const newFilter: FilterClause = {
      field: '',
      operator: 'includes',
      value: ''
    };
    this.store.dispatch(DashboardActions.addFilter({ filter: newFilter }));
  }

  removeFilter(index: number): void {
    this.store.dispatch(DashboardActions.removeFilter({ index }));
  }

  applyFilters(): void {
    console.log('Applying filters:', this.activeFilters);
  }

  private generateSampleDataForType(type: string): any {
    const labels = ['A', 'B', 'C', 'D'];
    const data = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), 
                  Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
    
    if (type === 'pie' || type === 'doughnut') {
      return {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#d4a421', '#4CAF50', '#2196F3', '#ff9800'],
          borderWidth: 0
        }]
      };
    }
    
    return {
      labels,
      datasets: [{
        label: 'Data',
        data,
        backgroundColor: type === 'line' ? 'rgba(212, 164, 33, 0.1)' : '#d4a421',
        borderColor: '#d4a421',
        tension: type === 'line' ? 0.1 : undefined
      }]
    };
  }

  private generateChartOptionsForType(type: string): any {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: type === 'pie' || type === 'doughnut',
          position: 'right',
          labels: { 
            color: '#ffffff',
            font: { size: 12 },
            usePointStyle: true
          }
        }
      }
    };

    if (type === 'pie' || type === 'doughnut') {
      return baseOptions;
    }

    return {
      ...baseOptions,
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
    };
  }
}