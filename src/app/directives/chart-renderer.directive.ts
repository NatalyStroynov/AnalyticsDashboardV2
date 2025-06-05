import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ChartData, ChartOptions } from '../types/chart.types';

declare const Chart: any;

@Directive({
  selector: '[appChartRenderer]',
  standalone: true
})
export class ChartRendererDirective implements OnInit, OnChanges, OnDestroy {
  @Input() chartType: string = 'bar';
  @Input() chartData: ChartData | null = null;
  @Input() chartOptions: ChartOptions | null = null;

  private chart: any = null;

  constructor(private elementRef: ElementRef<HTMLCanvasElement>) {}

  ngOnInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartOptions'] || changes['chartType']) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private renderChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartData) {
      return;
    }

    const ctx = this.elementRef.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    const defaultOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    };

    const options = { ...defaultOptions, ...this.chartOptions };

    this.chart = new Chart(ctx, {
      type: this.chartType,
      data: this.chartData,
      options: options
    });
  }
}
