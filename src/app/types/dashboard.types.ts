import { ChartWidget } from './chart.types';
import { Filter } from './filter.types';

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: ChartWidget[];
  filters: Filter[];
  layout?: DashboardLayout;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  widgets: WidgetPosition[];
}

export interface WidgetPosition {
  widgetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DashboardCreateRequest {
  name: string;
  description?: string;
}

export interface DashboardState {
  dashboards: Dashboard[];
  currentDashboard: Dashboard | null;
  loading: boolean;
  error: string | null;
}
