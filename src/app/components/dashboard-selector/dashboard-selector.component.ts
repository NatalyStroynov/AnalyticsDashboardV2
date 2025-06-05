import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../types/dashboard.types';

@Component({
  selector: 'app-dashboard-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './dashboard-selector.component.html',
  styleUrls: ['./dashboard-selector.component.scss']
})
export class DashboardSelectorComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly dialog = inject(MatDialog);

  readonly dashboards = this.dashboardService.dashboards;
  readonly currentDashboard = this.dashboardService.currentDashboard;

  readonly showCreateForm = signal(false);
  readonly newDashboardName = signal('');

  onDashboardChange(dashboardId: string): void {
    this.dashboardService.selectDashboard(dashboardId);
  }

  createNewDashboard(): void {
    this.showCreateForm.set(true);
    this.newDashboardName.set('');
  }

  onCreateDashboard(): void {
    const name = this.newDashboardName().trim();
    if (!name) return;

    this.dashboardService.createDashboard({ name }).subscribe({
      next: () => {
        this.showCreateForm.set(false);
        this.newDashboardName.set('');
      },
      error: (error) => {
        console.error('Failed to create dashboard:', error);
      }
    });
  }

  onCancelCreate(): void {
    this.showCreateForm.set(false);
    this.newDashboardName.set('');
  }

  trackDashboard(index: number, dashboard: Dashboard): string {
    return dashboard.id;
  }
}
