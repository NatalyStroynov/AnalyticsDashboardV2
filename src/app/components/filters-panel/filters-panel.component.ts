import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

import { DashboardService } from '../../services/dashboard.service';
import { DataService } from '../../services/data.service';
import { Filter, FilterType, FilterOperator } from '../../types/filter.types';

@Component({
  selector: 'app-filters-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSliderModule,
    MatListModule,
    MatExpansionModule
  ],
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss']
})
export class FiltersPanelComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly dataService = inject(DataService);

  readonly currentDashboard = this.dashboardService.currentDashboard;
  readonly appliedFilters = signal<Filter[]>([]);

  readonly availableFields = signal<string[]>([]);
  readonly showAddFilter = signal(false);
  readonly newFilterField = signal('');
  readonly newFilterType = signal<FilterType>('text');
  readonly newFilterOperator = signal<FilterOperator>('eq');

  readonly filterTypes: FilterType[] = ['text', 'number', 'date', 'select', 'boolean', 'range'];
  readonly filterOperators: FilterOperator[] = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'contains'];

  constructor() {
    // Load available fields when dashboard changes
    effect(() => {
      const dashboard = this.currentDashboard();
      if (dashboard) {
        this.loadAvailableFields();
        this.appliedFilters.set([...dashboard.filters]);
      }
    });

    // Update dashboard filters when applied filters change
    effect(() => {
      const filters = this.appliedFilters();
      this.dashboardService.updateFilters(filters);
    });
  }

  private loadAvailableFields(): void {
    // In a real implementation, this would load from the data source
    this.dataService.getDataSourceFields('default').subscribe({
      next: (fields) => this.availableFields.set(fields),
      error: (error) => console.error('Failed to load fields:', error)
    });
  }

  addFilter(): void {
    this.showAddFilter.set(true);
    this.resetNewFilterForm();
  }

  onCreateFilter(): void {
    const field = this.newFilterField().trim();
    if (!field) return;

    const newFilter: Filter = {
      id: this.generateId(),
      field: field,
      label: this.formatFieldLabel(field),
      type: this.newFilterType(),
      operator: this.newFilterOperator(),
      value: this.getDefaultValue(this.newFilterType()),
      enabled: true
    };

    this.appliedFilters.update(filters => [...filters, newFilter]);
    this.showAddFilter.set(false);
  }

  onCancelAddFilter(): void {
    this.showAddFilter.set(false);
    this.resetNewFilterForm();
  }

  updateFilter(filterId: string, updates: Partial<Filter>): void {
    this.appliedFilters.update(filters =>
      filters.map(filter =>
        filter.id === filterId ? { ...filter, ...updates } : filter
      )
    );
  }

  removeFilter(filterId: string): void {
    this.appliedFilters.update(filters =>
      filters.filter(filter => filter.id !== filterId)
    );
  }

  toggleFilter(filterId: string): void {
    this.appliedFilters.update(filters =>
      filters.map(filter =>
        filter.id === filterId 
          ? { ...filter, enabled: !filter.enabled }
          : filter
      )
    );
  }

  clearAllFilters(): void {
    this.appliedFilters.set([]);
  }

  onFilterValueChange(filterId: string, value: any): void {
    this.updateFilter(filterId, { value });
  }

  onFilterOperatorChange(filterId: string, operator: FilterOperator): void {
    this.updateFilter(filterId, { operator });
  }

  getOperatorsForType(type: FilterType): FilterOperator[] {
    switch (type) {
      case 'text':
        return ['eq', 'ne', 'contains'];
      case 'number':
        return ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'];
      case 'date':
        return ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'];
      case 'select':
      case 'multi-select':
        return ['eq', 'ne', 'in'];
      case 'boolean':
        return ['eq', 'ne'];
      case 'range':
        return ['between'];
      default:
        return ['eq', 'ne'];
    }
  }

  getOperatorLabel(operator: FilterOperator): string {
    const labels: Record<FilterOperator, string> = {
      'eq': 'Equals',
      'ne': 'Not Equals',
      'gt': 'Greater Than',
      'gte': 'Greater Than or Equal',
      'lt': 'Less Than',
      'lte': 'Less Than or Equal',
      'in': 'In',
      'contains': 'Contains',
      'between': 'Between'
    };
    return labels[operator] || operator;
  }

  private resetNewFilterForm(): void {
    this.newFilterField.set('');
    this.newFilterType.set('text');
    this.newFilterOperator.set('eq');
  }

  private formatFieldLabel(field: string): string {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getDefaultValue(type: FilterType): any {
    switch (type) {
      case 'text':
        return '';
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'date':
        return new Date().toISOString().split('T')[0];
      case 'select':
      case 'multi-select':
        return [];
      case 'range':
        return [0, 100];
      default:
        return '';
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  trackFilter(index: number, filter: Filter): string {
    return filter.id;
  }
}
