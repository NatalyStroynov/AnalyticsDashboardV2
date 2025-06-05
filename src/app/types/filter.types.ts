export type FilterType = 'text' | 'number' | 'date' | 'select' | 'multi-select' | 'boolean' | 'range';

export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'between';

export interface Filter {
  id: string;
  field: string;
  label: string;
  type: FilterType;
  operator: FilterOperator;
  value: any;
  options?: FilterOption[];
  enabled: boolean;
  required?: boolean;
}

export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterState {
  filters: Filter[];
  appliedFilters: AppliedFilter[];
}

export interface AppliedFilter {
  filterId: string;
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface FilterConfig {
  field: string;
  label: string;
  type: FilterType;
  operator: FilterOperator;
  defaultValue?: any;
  options?: FilterOption[];
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}
