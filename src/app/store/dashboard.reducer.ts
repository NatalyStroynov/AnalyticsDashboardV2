import { createReducer, on } from '@ngrx/store';
import { DashboardState, initialState, Dashboard, Chart } from './dashboard.state';
import * as DashboardActions from './dashboard.actions';

export const dashboardReducer = createReducer(
  initialState,

  // Dashboard Loading
  on(DashboardActions.loadDashboards, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(DashboardActions.loadDashboardsSuccess, (state, { dashboards }) => ({
    ...state,
    dashboards,
    loading: false,
    error: null,
    currentDashboardId: dashboards.length > 0 ? dashboards[0].id : null
  })),

  on(DashboardActions.loadDashboardsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Dashboard Management
  on(DashboardActions.createDashboardSuccess, (state, { dashboard }) => ({
    ...state,
    dashboards: [...state.dashboards, dashboard],
    currentDashboardId: dashboard.id
  })),

  on(DashboardActions.updateDashboard, (state, { id, updates }) => ({
    ...state,
    dashboards: state.dashboards.map(dashboard =>
      dashboard.id === id 
        ? { ...dashboard, ...updates, updatedAt: new Date() }
        : dashboard
    )
  })),

  on(DashboardActions.deleteDashboard, (state, { id }) => {
    const filteredDashboards = state.dashboards.filter(d => d.id !== id);
    return {
      ...state,
      dashboards: filteredDashboards,
      currentDashboardId: state.currentDashboardId === id 
        ? (filteredDashboards.length > 0 ? filteredDashboards[0].id : null)
        : state.currentDashboardId
    };
  }),

  on(DashboardActions.setCurrentDashboard, (state, { id }) => ({
    ...state,
    currentDashboardId: id
  })),

  // Chart Management
  on(DashboardActions.addChartSuccess, (state, { dashboardId, chart }) => ({
    ...state,
    dashboards: state.dashboards.map(dashboard =>
      dashboard.id === dashboardId
        ? {
            ...dashboard,
            charts: [...dashboard.charts, chart],
            updatedAt: new Date()
          }
        : dashboard
    )
  })),

  on(DashboardActions.updateChartSuccess, (state, { dashboardId, chart }) => ({
    ...state,
    dashboards: state.dashboards.map(dashboard =>
      dashboard.id === dashboardId
        ? {
            ...dashboard,
            charts: dashboard.charts.map(c => c.id === chart.id ? chart : c),
            updatedAt: new Date()
          }
        : dashboard
    )
  })),

  on(DashboardActions.deleteChart, (state, { dashboardId, chartId }) => ({
    ...state,
    dashboards: state.dashboards.map(dashboard =>
      dashboard.id === dashboardId
        ? {
            ...dashboard,
            charts: dashboard.charts.filter(c => c.id !== chartId),
            updatedAt: new Date()
          }
        : dashboard
    )
  })),

  on(DashboardActions.duplicateChartSuccess, (state, { dashboardId, chart }) => ({
    ...state,
    dashboards: state.dashboards.map(dashboard =>
      dashboard.id === dashboardId
        ? {
            ...dashboard,
            charts: [...dashboard.charts, chart],
            updatedAt: new Date()
          }
        : dashboard
    )
  })),

  // Filter Management
  on(DashboardActions.setActiveFilters, (state, { filters }) => ({
    ...state,
    activeFilters: filters
  })),

  on(DashboardActions.addFilter, (state, { filter }) => ({
    ...state,
    activeFilters: [...state.activeFilters, filter]
  })),

  on(DashboardActions.updateFilter, (state, { index, filter }) => ({
    ...state,
    activeFilters: state.activeFilters.map((f, i) => i === index ? filter : f)
  })),

  on(DashboardActions.removeFilter, (state, { index }) => ({
    ...state,
    activeFilters: state.activeFilters.filter((_, i) => i !== index)
  }))
);