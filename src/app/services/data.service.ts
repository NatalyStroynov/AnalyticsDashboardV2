import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { ChartData } from '../types/chart.types';
import { Filter, AppliedFilter } from '../types/filter.types';

export interface DataPoint {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly dataCache = signal<Map<string, DataPoint[]>>(new Map());

  constructor() {
    this.initializeDataSources();
  }

  private initializeDataSources(): void {
    // Initialize with empty data - real implementation would connect to APIs
    const cache = new Map<string, DataPoint[]>();
    this.dataCache.set(cache);
  }

  getDataSource(sourceId: string): Observable<DataPoint[]> {
    return new Observable(observer => {
      const cached = this.dataCache().get(sourceId);
      if (cached) {
        observer.next(cached);
        observer.complete();
        return;
      }

      // Simulate API call with empty data
      observer.next([]);
      observer.complete();
    });
  }

  getFilteredData(
    sourceId: string,
    filters: AppliedFilter[]
  ): Observable<DataPoint[]> {
    return this.getDataSource(sourceId).pipe(
      map(data => this.applyFilters(data, filters))
    );
  }

  getAggregatedData(
    sourceId: string,
    xField: string,
    yField: string,
    aggregationType: string,
    filters: AppliedFilter[] = [],
    groupBy: string[] = []
  ): Observable<ChartData> {
    return this.getFilteredData(sourceId, filters).pipe(
      map(data => this.aggregateData(data, xField, yField, aggregationType, groupBy))
    );
  }

  getFieldOptions(sourceId: string, field: string): Observable<any[]> {
    return this.getDataSource(sourceId).pipe(
      map(data => {
        if (data.length === 0) return [];
        
        const uniqueValues = [...new Set(data.map(item => item[field]))];
        return uniqueValues.filter(value => value !== null && value !== undefined);
      })
    );
  }

  getDataSourceFields(sourceId: string): Observable<string[]> {
    return this.getDataSource(sourceId).pipe(
      map(data => {
        if (data.length === 0) return [];
        return Object.keys(data[0] || {});
      })
    );
  }

  private applyFilters(data: DataPoint[], filters: AppliedFilter[]): DataPoint[] {
    return data.filter(item => {
      return filters.every(filter => {
        const value = item[filter.field];
        const filterValue = filter.value;

        switch (filter.operator) {
          case 'eq':
            return value === filterValue;
          case 'ne':
            return value !== filterValue;
          case 'gt':
            return value > filterValue;
          case 'gte':
            return value >= filterValue;
          case 'lt':
            return value < filterValue;
          case 'lte':
            return value <= filterValue;
          case 'in':
            return Array.isArray(filterValue) && filterValue.includes(value);
          case 'contains':
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'between':
            return Array.isArray(filterValue) && 
                   value >= filterValue[0] && value <= filterValue[1];
          default:
            return true;
        }
      });
    });
  }

  private aggregateData(
    data: DataPoint[],
    xField: string,
    yField: string,
    aggregationType: string,
    groupBy: string[] = []
  ): ChartData {
    if (data.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'No Data',
          data: [],
          backgroundColor: 'rgba(156, 163, 175, 0.5)',
          borderColor: 'rgba(156, 163, 175, 1)'
        }]
      };
    }

    const grouped = this.groupData(data, xField, groupBy);
    const labels = Object.keys(grouped);
    
    if (groupBy.length === 0) {
      // Single dataset
      const values = labels.map(label => {
        const groupData = grouped[label];
        return this.calculateAggregation(groupData, yField, aggregationType);
      });

      return {
        labels,
        datasets: [{
          label: yField,
          data: values,
          backgroundColor: 'rgba(25, 118, 210, 0.5)',
          borderColor: 'rgba(25, 118, 210, 1)',
          borderWidth: 1
        }]
      };
    }

    // Multiple datasets grouped by additional fields
    const allGroupValues = new Set<string>();
    Object.values(grouped).forEach(group => {
      group.forEach(item => {
        groupBy.forEach(field => {
          allGroupValues.add(String(item[field]));
        });
      });
    });

    const groupValueArray = Array.from(allGroupValues);
    const colors = this.generateColors(groupValueArray.length);

    const datasets = groupValueArray.map((groupValue, index) => {
      const values = labels.map(label => {
        const groupData = grouped[label].filter(item => 
          groupBy.some(field => String(item[field]) === groupValue)
        );
        return this.calculateAggregation(groupData, yField, aggregationType);
      });

      return {
        label: groupValue,
        data: values,
        backgroundColor: colors[index].background,
        borderColor: colors[index].border,
        borderWidth: 1
      };
    });

    return { labels, datasets };
  }

  private groupData(data: DataPoint[], groupField: string, additionalGroups: string[] = []): { [key: string]: DataPoint[] } {
    return data.reduce((groups, item) => {
      const key = String(item[groupField]);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as { [key: string]: DataPoint[] });
  }

  private calculateAggregation(data: DataPoint[], field: string, type: string): number {
    if (data.length === 0) return 0;

    const values = data.map(item => Number(item[field])).filter(val => !isNaN(val));

    switch (type) {
      case 'count':
        return data.length;
      case 'distinct_count':
        return new Set(data.map(item => item[field])).size;
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      case 'avg':
        return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
      case 'min':
        return values.length > 0 ? Math.min(...values) : 0;
      case 'max':
        return values.length > 0 ? Math.max(...values) : 0;
      default:
        return 0;
    }
  }

  private generateColors(count: number): { background: string; border: string }[] {
    const baseColors = [
      { r: 25, g: 118, b: 210 },   // Blue
      { r: 0, g: 150, b: 136 },    // Teal
      { r: 255, g: 152, b: 0 },    // Orange
      { r: 156, g: 39, b: 176 },   // Purple
      { r: 244, g: 67, b: 54 },    // Red
      { r: 76, g: 175, b: 80 },    // Green
      { r: 255, g: 193, b: 7 },    // Amber
      { r: 96, g: 125, b: 139 }    // Blue Grey
    ];

    return Array.from({ length: count }, (_, index) => {
      const color = baseColors[index % baseColors.length];
      return {
        background: `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`,
        border: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`
      };
    });
  }
}
