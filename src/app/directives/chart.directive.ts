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
    // Delay chart creation to ensure DOM is ready
    setTimeout(() => {
      this.createChart();
    }, 100);
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
    if (!this.chartData) {
      console.warn('ChartDirective: No chart data provided');
      return;
    }

    const ctx = this.elementRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.warn('ChartDirective: Could not get canvas context');
      return;
    }

    // Ensure canvas has proper dimensions
    const canvas = this.elementRef.nativeElement;
    if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) {
      canvas.style.width = '100%';
      canvas.style.height = '220px';
    }

    console.log('Creating chart with data:', this.chartData);
    console.log('Canvas dimensions:', canvas.offsetWidth, 'x', canvas.offsetHeight);

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
      },
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
      }
    };

    if (this.chartType !== 'pie' && this.chartType !== 'doughnut') {
      (defaultOptions as any).scales = {
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
      };
    }

    const config: ChartConfiguration = {
      type: this.chartType as any,
      data: this.chartData,
      options: {
        ...defaultOptions,
        ...this.chartOptions
      }
    };

    this.chart = new Chart(ctx, config);
    
    // Force chart resize after creation
    setTimeout(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
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