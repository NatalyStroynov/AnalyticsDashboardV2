import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartWidget } from '../../types/chart.types';
import { Filter } from '../../types/filter.types';

declare var Chart: any;

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-widget">
      <div class="widget-header">
        <div class="widget-title">{{ widget.title }}</div>
        <div class="widget-actions">
          <button class="action-btn" (click)="toggleMenu()">
            <span class="material-icons">more_vert</span>
          </button>
          @if (showMenu()) {
            <div class="action-menu">
              <button class="menu-item" (click)="onEdit()">
                <span class="material-icons">edit</span>
                Edit
              </button>
              <button class="menu-item" (click)="onDuplicate()">
                <span class="material-icons">content_copy</span>
                Duplicate
              </button>
              <button class="menu-item delete-option" (click)="onDelete()">
                <span class="material-icons">delete</span>
                Delete
              </button>
            </div>
          }
        </div>
      </div>
      <div class="widget-content">
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `,
  styles: [`
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
      width: 32px;
      height: 32px;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #d4a421;
    }

    .action-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: #3a3a3a;
      border: 1px solid #555;
      border-radius: 4px;
      padding: 4px 0;
      z-index: 1000;
      min-width: 120px;
    }

    .menu-item {
      width: 100%;
      background: none;
      border: none;
      color: white;
      padding: 8px 12px;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .menu-item:hover {
      background: rgba(212, 164, 33, 0.1);
    }

    .delete-option {
      color: #f44336;
    }

    .delete-option:hover {
      background: rgba(244, 67, 54, 0.1);
    }

    .widget-content {
      height: 250px;
      position: relative;
    }

    .widget-content canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .material-icons {
      font-family: 'Material Icons';
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class ChartWidgetComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) widget!: ChartWidget;
  @Input() filters: Filter[] = [];

  @Output() edit = new EventEmitter<ChartWidget>();
  @Output() delete = new EventEmitter<string>();
  @Output() duplicate = new EventEmitter<ChartWidget>();

  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: any = null;
  readonly showMenu = signal(false);

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private renderChart(): void {
    if (!this.chartCanvas || !this.widget) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Sample data based on widget type
    const data = this.getSampleData();
    const options = this.getChartOptions();

    this.chart = new Chart(ctx, {
      type: this.widget.type,
      data: data,
      options: options
    });
  }

  private getSampleData() {
    switch (this.widget.type) {
      case 'pie':
      case 'doughnut':
        return {
          labels: ['Category A', 'Category B', 'Category C', 'Category D'],
          datasets: [{
            data: [35, 25, 20, 20],
            backgroundColor: ['#2196f3', '#4caf50', '#ff9800', '#e91e63'],
            borderWidth: 0
          }]
        };
      case 'line':
        return {
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
      default: // bar chart
        return {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [{
            label: 'Values',
            data: [45, 62, 38, 55],
            backgroundColor: '#d4a421',
            borderRadius: 4
          }]
        };
    }
  }

  private getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: this.widget.type === 'pie' || this.widget.type === 'doughnut',
          position: 'right',
          labels: { color: '#ccc', usePointStyle: true }
        }
      },
      scales: this.widget.type !== 'pie' && this.widget.type !== 'doughnut' ? {
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
    };
  }

  toggleMenu(): void {
    this.showMenu.set(!this.showMenu());
  }

  onEdit(): void {
    this.showMenu.set(false);
    this.edit.emit(this.widget);
  }

  onDelete(): void {
    this.showMenu.set(false);
    this.delete.emit(this.widget.id);
  }

  onDuplicate(): void {
    this.showMenu.set(false);
    this.duplicate.emit(this.widget);
  }
}