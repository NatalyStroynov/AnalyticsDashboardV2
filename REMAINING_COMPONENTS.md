# Remaining Angular Component Files

## Chart Widget Component

### src/app/components/simple-chart-widget/simple-chart-widget.component.ts
```typescript
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Chart, ChartConfiguration } from 'chart.js';
import '../../chart.config';

interface ChartData {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: any;
}

@Component({
  selector: 'app-simple-chart-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <div class="chart-widget">
      <div class="widget-header">
        <div class="widget-title">{{ chartData.title }}</div>
        <div class="widget-actions">
          <button mat-icon-button [matMenuTriggerFor]="menu" class="action-btn">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="onEdit()">
              <mat-icon>edit</mat-icon>
              <span>Edit</span>
            </button>
            <button mat-menu-item (click)="onDuplicate()">
              <mat-icon>content_copy</mat-icon>
              <span>Duplicate</span>
            </button>
            <button mat-menu-item (click)="onDelete()" class="delete-option">
              <mat-icon>delete</mat-icon>
              <span>Delete</span>
            </button>
          </mat-menu>
        </div>
      </div>
      <div class="widget-content">
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `,
  styleUrls: ['./simple-chart-widget.component.scss']
})
export class SimpleChartWidgetComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) chartData!: ChartData;
  @Output() edit = new EventEmitter<ChartData>();
  @Output() delete = new EventEmitter<string>();
  @Output() duplicate = new EventEmitter<ChartData>();

  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private renderChart(): void {
    if (!this.chartCanvas || !this.chartData) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: this.chartData.type as any,
      data: this.chartData.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: this.chartData.type === 'pie' || this.chartData.type === 'doughnut',
            position: 'right',
            labels: {
              color: '#ccc',
              usePointStyle: true
            }
          }
        },
        scales: this.chartData.type !== 'pie' && this.chartData.type !== 'doughnut' ? {
          x: {
            grid: { color: '#4a4a4a' },
            ticks: { color: '#ccc' }
          },
          y: {
            grid: { color: '#4a4a4a' },
            ticks: { color: '#ccc' },
            beginAtZero: true
          }
        } : undefined
      }
    };

    this.chart = new Chart(ctx, config);
  }

  onEdit(): void {
    this.edit.emit(this.chartData);
  }

  onDelete(): void {
    this.delete.emit(this.chartData.id);
  }

  onDuplicate(): void {
    this.duplicate.emit(this.chartData);
  }
}
```

### src/app/components/simple-chart-widget/simple-chart-widget.component.scss
```scss
.chart-widget {
  background: #3a3a3a;
  border-radius: 8px;
  padding: 20px;
  min-height: 300px;
  border: 1px solid #4a4a4a;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: #555;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
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
  width: 32px;
  height: 32px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #d4a421;
  }
}

.widget-content {
  height: 250px;
  position: relative;
  
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}

// Override Material menu styles for dark theme
::ng-deep {
  .mat-mdc-menu-panel {
    background: #3a3a3a !important;
    border: 1px solid #555;
  }
  
  .mat-mdc-menu-item {
    color: white !important;
    
    &:hover {
      background: rgba(212, 164, 33, 0.1) !important;
    }
    
    &.delete-option {
      color: #f44336 !important;
      
      &:hover {
        background: rgba(244, 67, 54, 0.1) !important;
      }
    }
    
    .mat-icon {
      color: inherit;
      margin-right: 12px;
    }
  }
}
```

## Dashboard Layout Component

### src/app/components/dashboard-layout/dashboard-layout.component.ts
```typescript
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SimpleChartWidgetComponent } from '../simple-chart-widget/simple-chart-widget.component';
import { CreateDashboardModalComponent } from '../create-dashboard-modal/create-dashboard-modal.component';
import { NotificationService } from '../../services/notification.service';

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  charts: ChartData[];
}

interface ChartData {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: any;
  position?: { x: number; y: number; width: number; height: number };
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    SimpleChartWidgetComponent
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  readonly dashboards = signal<Dashboard[]>([
    {
      id: 'simulation',
      name: 'Simulation Field Model Dashboard',
      description: 'Simulation data analysis',
      charts: [
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
      ]
    },
    {
      id: 'lead-contact',
      name: 'Lead Contacts Dashboard',
      description: 'Lead management and contact tracking',
      charts: [
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
      ]
    },
    {
      id: 'fiber-tracts',
      name: 'Fiber Tracts Dashboard',
      description: 'Fiber network analysis',
      charts: [
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
    }
  ]);

  readonly selectedDashboard = signal<string>('simulation');
  readonly currentDashboard = computed(() => {
    return this.dashboards().find(d => d.id === this.selectedDashboard()) || this.dashboards()[0];
  });

  ngOnInit() {
    // Initialize with first dashboard
  }

  onDashboardChange(value: string) {
    if (value === 'create-new') {
      this.openCreateDashboardModal();
      return;
    }
    this.selectedDashboard.set(value);
    this.notificationService.show(`Switched to ${this.currentDashboard().name}`);
  }

  openCreateDashboardModal() {
    const dialogRef = this.dialog.open(CreateDashboardModalComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createNewDashboard(result.name, result.description);
      }
    });
  }

  createNewDashboard(name: string, description?: string) {
    const newDashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      name,
      description,
      charts: []
    };

    this.dashboards.update(dashboards => [...dashboards, newDashboard]);
    this.selectedDashboard.set(newDashboard.id);
    this.notificationService.show(`Dashboard "${name}" created successfully`);
  }

  onChartEdit(chart: ChartData) {
    // Handle chart editing
    console.log('Editing chart:', chart);
  }

  onChartDelete(chartId: string) {
    const dashboard = this.currentDashboard();
    if (dashboard) {
      dashboard.charts = dashboard.charts.filter(c => c.id !== chartId);
      this.notificationService.show('Chart deleted');
    }
  }

  onChartDuplicate(chart: ChartData) {
    const dashboard = this.currentDashboard();
    if (dashboard) {
      const duplicatedChart: ChartData = {
        ...chart,
        id: `${chart.id}-copy-${Date.now()}`,
        title: `${chart.title} (Copy)`
      };
      dashboard.charts.push(duplicatedChart);
      this.notificationService.show(`Chart "${chart.title}" duplicated`);
    }
  }
}
```

### src/app/components/dashboard-layout/dashboard-layout.component.html
```html
<div class="dashboard-container">
  <!-- Top Navigation Bar -->
  <div class="top-bar">
    <div class="dashboard-selector-wrapper">
      <mat-form-field appearance="outline" class="dashboard-selector-field">
        <mat-select 
          [value]="selectedDashboard()" 
          (selectionChange)="onDashboardChange($event.value)"
          class="dashboard-selector">
          @for (dashboard of dashboards(); track dashboard.id) {
            <mat-option [value]="dashboard.id">
              {{ dashboard.name }}
            </mat-option>
          }
          <mat-option value="create-new" class="create-option">
            + Create New Dashboard
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    
    <div class="top-controls">
      <button mat-raised-button class="top-btn">Data Sources</button>
      <button mat-raised-button class="filters-btn">
        <mat-icon>filter_list</mat-icon>
        Filters
      </button>
    </div>
  </div>

  <!-- Main Dashboard Content -->
  <div class="main-container">
    <div class="dashboard-content">
      @if (currentDashboard().charts.length > 0) {
        <div class="dashboard-grid">
          @for (chart of currentDashboard().charts; track chart.id) {
            <app-simple-chart-widget 
              [chartData]="chart"
              (edit)="onChartEdit($event)"
              (delete)="onChartDelete($event)"
              (duplicate)="onChartDuplicate($event)">
            </app-simple-chart-widget>
          }
        </div>
      } @else {
        <div class="empty-dashboard">
          <mat-icon class="empty-icon">assessment</mat-icon>
          <h3>No Charts Available</h3>
          <p>This dashboard is empty. Add some charts to get started with your data visualization.</p>
          <button mat-raised-button color="primary" class="add-chart-btn">
            <mat-icon>add</mat-icon>
            Add Chart
          </button>
        </div>
      }
    </div>
  </div>
</div>
```

### src/app/components/dashboard-layout/dashboard-layout.component.scss
```scss
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

.dashboard-selector-wrapper {
  position: relative;
  z-index: 200;
}

.dashboard-selector-field {
  .mat-mdc-form-field-outline {
    color: #555;
  }
  
  .mat-mdc-text-field-wrapper {
    background: #2d2d2d;
  }
  
  .mat-mdc-select-value {
    color: white;
  }
  
  .mat-mdc-select-arrow {
    color: #ccc;
  }
}

.dashboard-selector {
  background: #2d2d2d;
  color: white;
  min-width: 280px;
  max-width: 350px;
  font-size: 14px;
}

.create-option {
  background: #3a4a3a !important;
  color: #d4a421 !important;
  font-weight: 500;
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
  
  &:hover {
    background: #666;
  }
}

.filters-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  
  mat-icon {
    font-size: 16px;
    width: 16px;
    height: 16px;
  }
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
  width: 64px;
  height: 64px;
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
  
  &:hover {
    background: #e6b82e;
  }
}

// Override Angular Material dark theme colors
::ng-deep {
  .mat-mdc-option {
    background: #2d2d2d !important;
    color: white !important;
    
    &.create-option {
      background: #3a4a3a !important;
      color: #d4a421 !important;
    }
    
    &:hover:not(.mdc-list-item--disabled) {
      background: #4a4a4a !important;
    }
  }
  
  .mat-mdc-select-panel {
    background: #2d2d2d !important;
    border: 1px solid #555;
  }
  
  .mat-mdc-form-field {
    .mat-mdc-text-field-wrapper {
      background: #2d2d2d;
    }
    
    .mat-mdc-form-field-outline {
      color: #555;
    }
    
    &.mat-focused .mat-mdc-form-field-outline {
      color: #d4a421;
    }
  }
  
  .mat-mdc-raised-button {
    &.top-btn, &.filters-btn {
      background: #555;
      color: white;
      
      &:hover {
        background: #666;
      }
    }
  }
}
```

## Setup Instructions

1. Create folder: `analytics-dashboard`
2. Copy all files above maintaining the exact directory structure
3. Run:
   ```bash
   cd analytics-dashboard
   npm install
   ng serve
   ```

Your complete Angular CLI dashboard will be ready for GitHub upload and development!