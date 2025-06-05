import { Injectable, signal, computed } from '@angular/core';
import { Dashboard, DashboardCreateRequest, DashboardState } from '../types/dashboard.types';
import { ChartWidget } from '../types/chart.types';
import { Filter } from '../types/filter.types';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly state = signal<DashboardState>({
    dashboards: [],
    currentDashboard: null,
    loading: false,
    error: null
  });

  private readonly appliedFilters = signal<Filter[]>([]);

  // Public signals
  readonly dashboards = computed(() => this.state().dashboards);
  readonly currentDashboard = computed(() => this.state().currentDashboard);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly filters = computed(() => this.appliedFilters());

  constructor() {
    this.initializeDefaultDashboard();
  }

  private initializeDefaultDashboard(): void {
    const defaultDashboard: Dashboard = {
      id: 'default',
      name: 'Default Dashboard',
      description: 'Main analytics dashboard',
      widgets: [],
      filters: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.updateState({
      ...this.state(),
      dashboards: [defaultDashboard],
      currentDashboard: defaultDashboard
    });
  }

  createDashboard(request: DashboardCreateRequest): Observable<Dashboard> {
    return new Observable(observer => {
      this.updateState({ ...this.state(), loading: true });

      const newDashboard: Dashboard = {
        id: this.generateId(),
        name: request.name,
        description: request.description,
        widgets: [],
        filters: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedDashboards = [...this.state().dashboards, newDashboard];
      
      this.updateState({
        ...this.state(),
        dashboards: updatedDashboards,
        currentDashboard: newDashboard,
        loading: false
      });

      observer.next(newDashboard);
      observer.complete();
    });
  }

  selectDashboard(dashboardId: string): void {
    const dashboard = this.state().dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      this.updateState({
        ...this.state(),
        currentDashboard: dashboard
      });
      this.appliedFilters.set(dashboard.filters);
    }
  }

  addWidget(widget: ChartWidget): void {
    const currentDashboard = this.state().currentDashboard;
    if (!currentDashboard) return;

    const updatedWidgets = [...currentDashboard.widgets, widget];
    const updatedDashboard = {
      ...currentDashboard,
      widgets: updatedWidgets,
      updatedAt: new Date()
    };

    this.updateDashboard(updatedDashboard);
  }

  updateWidget(widgetId: string, updates: Partial<ChartWidget>): void {
    const currentDashboard = this.state().currentDashboard;
    if (!currentDashboard) return;

    const updatedWidgets = currentDashboard.widgets.map(widget =>
      widget.id === widgetId ? { ...widget, ...updates, updatedAt: new Date() } : widget
    );

    const updatedDashboard = {
      ...currentDashboard,
      widgets: updatedWidgets,
      updatedAt: new Date()
    };

    this.updateDashboard(updatedDashboard);
  }

  removeWidget(widgetId: string): void {
    const currentDashboard = this.state().currentDashboard;
    if (!currentDashboard) return;

    const updatedWidgets = currentDashboard.widgets.filter(widget => widget.id !== widgetId);
    const updatedDashboard = {
      ...currentDashboard,
      widgets: updatedWidgets,
      updatedAt: new Date()
    };

    this.updateDashboard(updatedDashboard);
  }

  updateFilters(filters: Filter[]): void {
    this.appliedFilters.set(filters);
    
    const currentDashboard = this.state().currentDashboard;
    if (currentDashboard) {
      const updatedDashboard = {
        ...currentDashboard,
        filters,
        updatedAt: new Date()
      };
      this.updateDashboard(updatedDashboard);
    }
  }

  reorderWidgets(widgetIds: string[]): void {
    const currentDashboard = this.state().currentDashboard;
    if (!currentDashboard) return;

    const widgetMap = new Map(currentDashboard.widgets.map(w => [w.id, w]));
    const reorderedWidgets = widgetIds.map(id => widgetMap.get(id)!).filter(Boolean);

    const updatedDashboard = {
      ...currentDashboard,
      widgets: reorderedWidgets,
      updatedAt: new Date()
    };

    this.updateDashboard(updatedDashboard);
  }

  private updateDashboard(updatedDashboard: Dashboard): void {
    const updatedDashboards = this.state().dashboards.map(dashboard =>
      dashboard.id === updatedDashboard.id ? updatedDashboard : dashboard
    );

    this.updateState({
      ...this.state(),
      dashboards: updatedDashboards,
      currentDashboard: updatedDashboard
    });
  }

  private updateState(newState: DashboardState): void {
    this.state.set(newState);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
