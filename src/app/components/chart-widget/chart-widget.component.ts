import { Component, Input, Output, EventEmitter, signal, computed, effect, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ChartWidget, ChartData, ChartOptions } from '../../types/chart.types';
import { Filter, AppliedFilter } from '../../types/filter.types';
import { DataService } from '../../services/data.service';

declare const Chart: any;

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.scss']
})
export class ChartWidgetComponent {
  @Input({ required: true }) widget!: ChartWidget;
  @Input() filters: Filter[] = [];
  
  @Output() edit = new EventEmitter<ChartWidget>();
  @Output() delete = new EventEmitter<string>();
  @Output() duplicate = new EventEmitter<ChartWidget>();

  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  private readonly dataService = inject(DataService);
  
  private chart: any = null;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly chartData = signal<ChartData | null>(null);

  readonly hasData = computed(() => {
    const data = this.chartData();
    return data && data.datasets.length > 0 && data.datasets[0].data.length > 0;
  });

  constructor() {
    // Reload chart when widget config or filters change
    effect(() => {
      const widget = this.widget;
      const filters = this.filters;
      if (widget) {
        this.loadChartData();
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadChartData();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private async loadChartData(): Promise<void> {
    if (!this.widget.config.xAxis.field || !this.widget.config.yAxis.field) {
      this.renderEmptyChart('Please configure chart fields');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const appliedFilters = this.convertFiltersToAppliedFilters(this.filters);
      
      const data = await this.dataService.getAggregatedData(
        this.widget.config.dataSource,
        this.widget.config.xAxis.field,
        this.widget.config.yAxis.field,
        this.widget.config.aggregation,
        appliedFilters,
        this.widget.config.groupBy
      ).toPromise();

      if (data) {
        this.chartData.set(data);
        this.renderChart(data);
      } else {
        this.renderEmptyChart('No data available');
      }
    } catch (error) {
      console.error('Failed to load chart data:', error);
      this.error.set('Failed to load chart data');
      this.renderEmptyChart('Error loading data');
    } finally {
      this.loading.set(false);
    }
  }

  private renderChart(data: ChartData): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const options = this.buildChartOptions();

    this.chart = new Chart(ctx, {
      type: this.getChartJsType(this.widget.type),
      data: data,
      options: options
    });
  }

  private renderEmptyChart(message: string): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const emptyData: ChartData = {
      labels: ['No Data'],
      datasets: [{
        label: message,
        data: [0],
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
        borderColor: 'rgba(156, 163, 175, 1)',
        borderWidth: 1
      }]
    };

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: emptyData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: message
          }
        },
        scales: {
          y: {
            display: false
          }
        }
      }
    });
  }

  private buildChartOptions(): ChartOptions {
    const baseOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: !!this.widget.title,
          text: this.widget.title
        }
      }
    };

    // Add scales for non-pie charts
    if (this.widget.type !== 'pie' && this.widget.type !== 'doughnut') {
      baseOptions.scales = {
        x: {
          display: true,
          title: {
            display: !!this.widget.config.xAxis.label,
            text: this.widget.config.xAxis.label || this.widget.config.xAxis.field
          }
        },
        y: {
          display: true,
          title: {
            display: !!this.widget.config.yAxis.label,
            text: this.widget.config.yAxis.label || this.widget.config.yAxis.field
          }
        }
      };
    }

    return baseOptions;
  }

  private getChartJsType(widgetType: string): string {
    const typeMap: Record<string, string> = {
      'bar': 'bar',
      'line': 'line',
      'pie': 'pie',
      'doughnut': 'doughnut',
      'scatter': 'scatter',
      'area': 'line'
    };

    return typeMap[widgetType] || 'bar';
  }

  private convertFiltersToAppliedFilters(filters: Filter[]): AppliedFilter[] {
    return filters
      .filter(f => f.enabled)
      .map(f => ({
        filterId: f.id,
        field: f.field,
        operator: f.operator,
        value: f.value
      }));
  }

  onEdit(): void {
    this.edit.emit(this.widget);
  }

  onDelete(): void {
    this.delete.emit(this.widget.id);
  }

  onDuplicate(): void {
    this.duplicate.emit(this.widget);
  }

  getChartTypeIcon(): string {
    const iconMap: Record<string, string> = {
      'bar': 'bar_chart',
      'line': 'show_chart',
      'pie': 'pie_chart',
      'doughnut': 'donut_small',
      'scatter': 'scatter_plot',
      'area': 'area_chart'
    };

    return iconMap[this.widget.type] || 'insert_chart';
  }
}
