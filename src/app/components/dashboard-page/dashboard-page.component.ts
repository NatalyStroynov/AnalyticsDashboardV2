import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardSelectorComponent } from '../dashboard-selector/dashboard-selector.component';
import { FiltersPanelComponent } from '../filters-panel/filters-panel.component';
import { ChartWidgetComponent } from '../chart-widget/chart-widget.component';
import { ChartConfigComponent } from '../chart-config/chart-config.component';
import { ChartWidget, ChartType } from '../../types/chart.types';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    DragDropModule,
    DashboardSelectorComponent,
    FiltersPanelComponent,
    ChartWidgetComponent,
    ChartConfigComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly currentDashboard = this.dashboardService.currentDashboard;
  readonly loading = this.dashboardService.loading;
  readonly filters = this.dashboardService.filters;

  readonly sidenavOpened = signal(true);
  readonly showChartConfig = signal(false);
  readonly selectedWidget = signal<ChartWidget | null>(null);

  readonly widgets = computed(() => this.currentDashboard()?.widgets || []);
  readonly hasWidgets = computed(() => this.widgets().length > 0);

  toggleSidenav(): void {
    this.sidenavOpened.update(opened => !opened);
  }

  onWidgetDrop(event: CdkDragDrop<ChartWidget[]>): void {
    const widgets = [...this.widgets()];
    moveItemInArray(widgets, event.previousIndex, event.currentIndex);
    
    const widgetIds = widgets.map(w => w.id);
    this.dashboardService.reorderWidgets(widgetIds);
  }

  addNewWidget(): void {
    const newWidget: ChartWidget = {
      id: this.generateId(),
      title: 'New Chart',
      type: 'bar',
      config: {
        dataSource: 'default',
        xAxis: { field: '', type: 'string' },
        yAxis: { field: '', type: 'number' },
        aggregation: 'count'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.dashboardService.addWidget(newWidget);
    this.editWidget(newWidget);
  }

  editWidget(widget: ChartWidget): void {
    this.selectedWidget.set(widget);
    this.showChartConfig.set(true);
  }

  onWidgetConfigSave(updatedWidget: ChartWidget): void {
    this.dashboardService.updateWidget(updatedWidget.id, updatedWidget);
    this.closeChartConfig();
  }

  onWidgetConfigCancel(): void {
    this.closeChartConfig();
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

  private closeChartConfig(): void {
    this.showChartConfig.set(false);
    this.selectedWidget.set(null);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
