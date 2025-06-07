export interface Chart {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: any;
  options: any;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  charts: Chart[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterClause {
  field: string;
  operator: 'includes' | 'equals' | 'greater' | 'less';
  value: string;
}

export interface DashboardState {
  dashboards: Dashboard[];
  currentDashboardId: string | null;
  activeFilters: FilterClause[];
  loading: boolean;
  error: string | null;
}

export const initialState: DashboardState = {
  dashboards: [],
  currentDashboardId: null,
  activeFilters: [
    { field: 'Gender', operator: 'includes', value: 'Male, Female' },
    { field: 'Age', operator: 'greater', value: '15' }
  ],
  loading: false,
  error: null
};