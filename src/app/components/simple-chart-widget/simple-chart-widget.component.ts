import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Chart, ChartConfiguration } from 'chart.js';

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