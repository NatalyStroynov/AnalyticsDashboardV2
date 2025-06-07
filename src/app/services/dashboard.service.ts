import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChartData {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: any;
  options: any;
}

export interface DashboardData {
  id: string;
  name: string;
  description: string;
  charts: ChartData[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardsSubject = new BehaviorSubject<DashboardData[]>([]);
  private currentDashboardSubject = new BehaviorSubject<DashboardData | null>(null);

  dashboards$ = this.dashboardsSubject.asObservable();
  currentDashboard$ = this.currentDashboardSubject.asObservable();

  constructor() {
    this.initializeDefaultDashboards();
  }

  private initializeDefaultDashboards(): void {
    const defaultDashboards: DashboardData[] = [
      {
        id: 'simulation',
        name: 'Simulation Field Model',
        description: 'Medical simulation and field data analysis',
        createdAt: new Date(),
        updatedAt: new Date(),
        charts: [
          {
            id: 'patient-accrual',
            title: 'Patient Accrual',
            type: 'line',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Patients Enrolled',
                data: [65, 78, 90, 81, 95, 102],
                borderColor: '#d4a421',
                backgroundColor: 'rgba(212, 164, 33, 0.1)',
                tension: 0.4,
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { labels: { color: '#ffffff' } },
                title: { display: true, text: 'Patient Enrollment Over Time', color: '#ffffff' }
              },
              scales: {
                x: { ticks: { color: '#ffffff' }, grid: { color: '#4a4a4a' } },
                y: { ticks: { color: '#ffffff' }, grid: { color: '#4a4a4a' } }
              }
            }
          }
        ]
      }
    ];

    this.dashboardsSubject.next(defaultDashboards);
    this.currentDashboardSubject.next(defaultDashboards[0]);
  }

  createDashboard(name: string, description: string): DashboardData {
    const newDashboard: DashboardData = {
      id: `dashboard_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      charts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const dashboards = [...this.dashboardsSubject.value, newDashboard];
    this.dashboardsSubject.next(dashboards);
    this.currentDashboardSubject.next(newDashboard);

    return newDashboard;
  }

  setCurrentDashboard(dashboardId: string): void {
    const dashboards = this.dashboardsSubject.value;
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      this.currentDashboardSubject.next(dashboard);
    }
  }

  addChartToDashboard(dashboardId: string, chart: Omit<ChartData, 'id'>): void {
    const dashboards = this.dashboardsSubject.value;
    const dashboard = dashboards.find(d => d.id === dashboardId);
    
    if (dashboard) {
      const newChart: ChartData = {
        ...chart,
        id: `chart_${Date.now()}`
      };
      
      dashboard.charts.push(newChart);
      dashboard.updatedAt = new Date();
      this.dashboardsSubject.next([...dashboards]);
    }
  }
}