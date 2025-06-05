export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'scatter' | 'area';

export type AggregationType = 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct_count';

export interface ChartWidget {
  id: string;
  title: string;
  description?: string;
  type: ChartType;
  config: ChartConfig;
  position?: WidgetPosition;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChartConfig {
  dataSource: string;
  xAxis: FieldConfig;
  yAxis: FieldConfig;
  groupBy?: string[];
  aggregation: AggregationType;
  filters?: ChartFilter[];
  styling?: ChartStyling;
}

export interface FieldConfig {
  field: string;
  label?: string;
  type: 'string' | 'number' | 'date' | 'boolean';
}

export interface ChartFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: any;
}

export interface ChartStyling {
  colors?: string[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins?: {
    legend?: {
      display: boolean;
      position: 'top' | 'bottom' | 'left' | 'right';
    };
    title?: {
      display: boolean;
      text: string;
    };
  };
  scales?: {
    x?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
    };
    y?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
    };
  };
}
