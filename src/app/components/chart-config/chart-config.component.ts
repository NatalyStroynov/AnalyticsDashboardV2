import { Component, Input, Output, EventEmitter, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ChartWidget, ChartType, AggregationType } from '../../types/chart.types';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-chart-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTabsModule,
    MatSlideToggleModule
  ],
  templateUrl: './chart-config.component.html',
  styleUrls: ['./chart-config.component.scss']
})
export class ChartConfigComponent {
  @Input({ required: true }) widget!: ChartWidget;
  @Output() save = new EventEmitter<ChartWidget>();
  @Output() cancel = new EventEmitter<void>();

  private readonly dataService = inject(DataService);

  // Form state
  readonly formWidget = signal<ChartWidget>({ ...this.widget });
  readonly availableFields = signal<string[]>([]);
  readonly fieldTypes = signal<Map<string, string>>(new Map());

  // Chart configuration options
  readonly chartTypes: { value: ChartType; label: string; icon: string }[] = [
    { value: 'bar', label: 'Bar Chart', icon: 'bar_chart' },
    { value: 'line', label: 'Line Chart', icon: 'show_chart' },
    { value: 'pie', label: 'Pie Chart', icon: 'pie_chart' },
    { value: 'doughnut', label: 'Doughnut Chart', icon: 'donut_small' },
    { value: 'scatter', label: 'Scatter Plot', icon: 'scatter_plot' },
    { value: 'area', label: 'Area Chart', icon: 'area_chart' }
  ];

  readonly aggregationTypes: { value: AggregationType; label: string }[] = [
    { value: 'count', label: 'Count' },
    { value: 'distinct_count', label: 'Distinct Count' },
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' }
  ];

  readonly dataSourceOptions = [
    { value: 'default', label: 'Default Dataset' }
  ];

  constructor() {
    // Initialize form with widget data
    effect(() => {
      this.formWidget.set({ ...this.widget });
    });

    // Load available fields when data source changes
    effect(() => {
      const widget = this.formWidget();
      if (widget.config.dataSource) {
        this.loadAvailableFields(widget.config.dataSource);
      }
    });
  }

  private loadAvailableFields(dataSource: string): void {
    this.dataService.getDataSourceFields(dataSource).subscribe({
      next: (fields) => {
        this.availableFields.set(fields);
        // In a real implementation, you would also load field types
        const typeMap = new Map<string, string>();
        fields.forEach(field => {
          // Mock field type detection - in real app, this would come from schema
          typeMap.set(field, this.inferFieldType(field));
        });
        this.fieldTypes.set(typeMap);
      },
      error: (error) => {
        console.error('Failed to load fields:', error);
        this.availableFields.set([]);
      }
    });
  }

  private inferFieldType(fieldName: string): string {
    // Simple heuristic for field type inference
    const lowerField = fieldName.toLowerCase();
    if (lowerField.includes('date') || lowerField.includes('time')) return 'date';
    if (lowerField.includes('count') || lowerField.includes('amount') || lowerField.includes('value')) return 'number';
    if (lowerField.includes('id') || lowerField.includes('key')) return 'string';
    return 'string';
  }

  onChartTypeChange(type: ChartType): void {
    this.formWidget.update(widget => ({
      ...widget,
      type,
      updatedAt: new Date()
    }));
  }

  onDataSourceChange(dataSource: string): void {
    this.formWidget.update(widget => ({
      ...widget,
      config: {
        ...widget.config,
        dataSource,
        xAxis: { field: '', type: 'string' },
        yAxis: { field: '', type: 'number' }
      },
      updatedAt: new Date()
    }));
  }

  onXAxisChange(field: string): void {
    const fieldType = this.fieldTypes().get(field) || 'string';
    this.formWidget.update(widget => ({
      ...widget,
      config: {
        ...widget.config,
        xAxis: { field, type: fieldType as any }
      },
      updatedAt: new Date()
    }));
  }

  onYAxisChange(field: string): void {
    const fieldType = this.fieldTypes().get(field) || 'number';
    this.formWidget.update(widget => ({
      ...widget,
      config: {
        ...widget.config,
        yAxis: { field, type: fieldType as any }
      },
      updatedAt: new Date()
    }));
  }

  onAggregationChange(aggregation: AggregationType): void {
    this.formWidget.update(widget => ({
      ...widget,
      config: {
        ...widget.config,
        aggregation
      },
      updatedAt: new Date()
    }));
  }

  onTitleChange(title: string): void {
    this.formWidget.update(widget => ({
      ...widget,
      title,
      updatedAt: new Date()
    }));
  }

  onDescriptionChange(description: string): void {
    this.formWidget.update(widget => ({
      ...widget,
      description,
      updatedAt: new Date()
    }));
  }

  onXAxisLabelChange(label: string): void {
    this.formWidget.update(widget => ({
      ...widget,
      config: {
        ...widget.config,
        xAxis: {
          ...widget.config.xAxis,
          label
        }
      },
      updatedAt: new Date()
    }));
  }

  onYAxisLabelChange(label: string): void {
    this.formWidget.update(widget => ({
      ...widget,
      config: {
        ...widget.config,
        yAxis: {
          ...widget.config.yAxis,
          label
        }
      },
      updatedAt: new Date()
    }));
  }

  isConfigurationValid(): boolean {
    const widget = this.formWidget();
    return !!(
      widget.title.trim() &&
      widget.config.dataSource &&
      widget.config.xAxis.field &&
      widget.config.yAxis.field &&
      widget.config.aggregation
    );
  }

  onSave(): void {
    if (this.isConfigurationValid()) {
      this.save.emit(this.formWidget());
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  trackChartType(index: number, item: any): string {
    return item.value;
  }

  trackAggregationType(index: number, item: any): string {
    return item.value;
  }

  trackField(index: number, field: string): string {
    return field;
  }
}
