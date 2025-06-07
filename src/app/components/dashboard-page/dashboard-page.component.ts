import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardSelectorComponent } from '../dashboard-selector/dashboard-selector.component';
import { ChartWidgetComponent } from '../chart-widget/chart-widget.component';
import { FiltersPanelComponent } from '../filters-panel/filters-panel.component';
import { DashboardService } from '../../services/dashboard.service';
import { ChartWidget } from '../../types/chart.types';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DashboardSelectorComponent,
    ChartWidgetComponent,
    FiltersPanelComponent
  ],
  template: `
    <div class="dashboard-container">
      <div class="top-bar">
        <app-dashboard-selector></app-dashboard-selector>
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
          @if (hasWidgets()) {
            <div class="dashboard-grid">
              @for (widget of widgets(); track widget.id) {
                <app-chart-widget 
                  [widget]="widget"
                  [filters]="filters()"
                  (edit)="editWidget(widget)"
                  (delete)="onWidgetDelete(widget.id)"
                  (duplicate)="onWidgetDuplicate(widget)">
                </app-chart-widget>
              }
            </div>
          } @else {
            <div class="empty-dashboard">
              <span class="material-icons empty-icon">assessment</span>
              <h3>No Charts Available</h3>
              <p>This dashboard is empty. Add some charts to get started with your data visualization.</p>
              <button class="add-chart-btn" (click)="addNewWidget()">
                <span class="material-icons">add</span>
                Add Chart
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
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
  `]
})
export class DashboardPageComponent implements OnInit {
  private readonly dashboardService = new DashboardService();

  readonly currentDashboard = this.dashboardService.currentDashboard;
  readonly loading = this.dashboardService.loading;
  readonly filters = this.dashboardService.filters;

  readonly widgets = computed(() => this.currentDashboard()?.widgets || []);
  readonly hasWidgets = computed(() => this.widgets().length > 0);

  ngOnInit(): void {
    // Initialize dashboard service
  }

  addNewWidget(): void {
    const newWidget: ChartWidget = {
      id: this.generateId(),
      title: 'New Chart',
      description: 'Chart description',
      type: 'bar',
      config: {
        dataSource: 'default',
        xAxis: { field: 'category', type: 'string' },
        yAxis: { field: 'value', type: 'number' },
        aggregation: 'sum'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.dashboardService.addWidget(newWidget);
  }

  editWidget(widget: ChartWidget): void {
    console.log('Editing widget:', widget);
  }

  onWidgetDelete(widgetId: string): void {
    this.dashboardService.removeWidget(widgetId);
  }

  onWidgetDuplicate(widget: ChartWidget): void {
    const duplicatedWidget: ChartWidget = {
      ...widget,
      id: this.generateId(),
      title: `${widget.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.dashboardService.addWidget(duplicatedWidget);
  }

  private generateId(): string {
    return `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}