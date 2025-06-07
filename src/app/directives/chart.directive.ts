import { Directive, ElementRef, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Directive({
  selector: '[appChart]',
  standalone: true
})
export class ChartDirective implements OnInit, OnChanges, OnDestroy {
  @Input() chartType: 'bar' | 'line' | 'pie' | 'doughnut' = 'bar';
  @Input() chartData: any = null;
  @Input() chartOptions: any = null;

  private chart: Chart | null = null;

  constructor(private elementRef: ElementRef<HTMLCanvasElement>) {}

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (changes['chartData'] || changes['chartOptions'] || changes['chartType'])) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    if (!this.chartData) return;

    const ctx = this.elementRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: this.chartType as any,
      data: this.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff'
            }
          },
          title: {
            display: true,
            color: '#ffffff'
          }
        },
        scales: this.chartType !== 'pie' && this.chartType !== 'doughnut' ? {
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
        } : {},
        ...this.chartOptions
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) return;

    this.chart.data = this.chartData;
    if (this.chartOptions) {
      this.chart.options = { ...this.chart.options, ...this.chartOptions };
    }
    this.chart.update();
  }
}