import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as DashboardActions from './dashboard.actions';
import { Dashboard, Chart } from './dashboard.state';

@Injectable()
export class DashboardEffects {

  loadDashboards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboards),
      mergeMap(() => {
        // Initialize with default dashboards
        const defaultDashboards: Dashboard[] = [
          {
            id: 'simulation',
            name: 'Simulation Field Model Dashboard',
            description: 'Medical simulation and field data analysis',
            createdAt: new Date(),
            updatedAt: new Date(),
            charts: [
              {
                id: 'patient-accrual',
                title: 'Patient Accrual',
                type: 'line',
                data: {
                  labels: ['May-2023', 'Jun-2023', 'Jul-2023', 'Aug-2023', 'Sep-2023', 'Oct-2023', 'Nov-2023', 'Dec-2023', 'Jan-2024', 'Feb-2024', 'Mar-2024', 'Apr-2024'],
                  datasets: [{
                    label: 'Patients',
                    data: [1, 0, 0, 1, 0, 0, 0, 0, 3, 0, 2, 0],
                    borderColor: '#d4a421',
                    backgroundColor: 'rgba(212, 164, 33, 0.1)',
                    tension: 0.1,
                    pointBackgroundColor: '#d4a421',
                    pointBorderColor: '#d4a421',
                    pointRadius: 4
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false }
                  },
                  scales: {
                    x: { 
                      ticks: { color: '#888888', font: { size: 11 } }, 
                      grid: { color: '#404040' },
                      border: { color: '#404040' }
                    },
                    y: { 
                      ticks: { color: '#888888', font: { size: 11 } }, 
                      grid: { color: '#404040' },
                      border: { color: '#404040' }
                    }
                  }
                }
              },
              {
                id: 'patient-gender',
                title: 'Patient Gender',
                type: 'pie',
                data: {
                  labels: ['Male', 'Female'],
                  datasets: [{
                    data: [42.86, 57.14],
                    backgroundColor: ['#9c4dcc', '#f8bbd9'],
                    borderWidth: 0
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      display: true,
                      position: 'right',
                      labels: { 
                        color: '#ffffff',
                        font: { size: 12 },
                        usePointStyle: true
                      }
                    }
                  }
                }
              }
            ]
          },
          {
            id: 'lead-contacts',
            name: 'Lead Contacts Dashboard',
            description: 'Lead generation and contact management',
            createdAt: new Date(),
            updatedAt: new Date(),
            charts: []
          },
          {
            id: 'fiber-tracts',
            name: 'Fiber Tracts Dashboard',
            description: 'Network fiber and tract analysis',
            createdAt: new Date(),
            updatedAt: new Date(),
            charts: []
          }
        ];

        return of(DashboardActions.loadDashboardsSuccess({ dashboards: defaultDashboards }));
      }),
      catchError(error => of(DashboardActions.loadDashboardsFailure({ error: error.message })))
    )
  );

  createDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.createDashboard),
      map(({ name, description }) => {
        const newDashboard: Dashboard = {
          id: `dashboard_${Date.now()}`,
          name: name.trim(),
          description: description.trim(),
          charts: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return DashboardActions.createDashboardSuccess({ dashboard: newDashboard });
      })
    )
  );

  addChart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.addChart),
      map(({ dashboardId, chart }) => {
        const newChart: Chart = {
          ...chart,
          id: `chart_${Date.now()}`
        };
        return DashboardActions.addChartSuccess({ dashboardId, chart: newChart });
      })
    )
  );

  duplicateChart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.duplicateChart),
      map(({ dashboardId, chartId }) => {
        // In a real app, you'd get the chart from the store or service
        // For now, create a placeholder duplicate
        const duplicatedChart: Chart = {
          id: `chart_${Date.now()}`,
          title: 'Duplicated Chart',
          type: 'bar',
          data: {
            labels: ['A', 'B', 'C', 'D'],
            datasets: [{
              data: [65, 59, 80, 81],
              backgroundColor: '#d4a421'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        };
        return DashboardActions.duplicateChartSuccess({ dashboardId, chart: duplicatedChart });
      })
    )
  );

  constructor(private actions$: Actions) {}
}