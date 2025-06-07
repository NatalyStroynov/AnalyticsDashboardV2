import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../types/dashboard.types';

@Component({
  selector: 'app-dashboard-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-selector-wrapper">
      <select 
        class="dashboard-selector"
        [value]="currentDashboard()?.id || ''"
        (change)="onDashboardChange($event)">
        @for (dashboard of dashboards(); track dashboard.id) {
          <option [value]="dashboard.id">{{ dashboard.name }}</option>
        }
        <option value="create-new" class="create-option">+ Create New Dashboard</option>
      </select>
    </div>
  `,
  styles: [`
    .dashboard-selector-wrapper {
      position: relative;
      z-index: 200;
    }

    .dashboard-selector {
      background: #2d2d2d;
      border: 1px solid #555;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      min-width: 280px;
      max-width: 350px;
      font-size: 14px;
      cursor: pointer;
    }

    .dashboard-selector:focus {
      outline: none;
      border-color: #d4a421;
      box-shadow: 0 0 0 2px rgba(212, 164, 33, 0.2);
    }

    .dashboard-selector option {
      background: #2d2d2d;
      color: white;
      padding: 8px 12px;
    }

    .create-option {
      background: #3a4a3a !important;
      color: #d4a421 !important;
      font-weight: 500;
      border-top: 1px solid #555;
    }
  `]
})
export class DashboardSelectorComponent {
  private readonly dashboardService = new DashboardService();

  readonly dashboards = this.dashboardService.dashboards;
  readonly currentDashboard = this.dashboardService.currentDashboard;

  onDashboardChange(event: any): void {
    const value = event.target.value;
    if (value === 'create-new') {
      this.createNewDashboard();
      return;
    }
    this.dashboardService.selectDashboard(value);
  }

  createNewDashboard(): void {
    const name = prompt('Enter dashboard name:');
    if (name?.trim()) {
      this.dashboardService.createDashboard({ name: name.trim() }).subscribe();
    }
  }
}