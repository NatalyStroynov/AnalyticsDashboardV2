import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SimpleChartWidgetComponent } from '../simple-chart-widget/simple-chart-widget.component';
import { CreateDashboardModalComponent } from '../create-dashboard-modal/create-dashboard-modal.component';
import { NotificationService } from '../../services/notification.service';

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  charts: ChartData[];
}

interface ChartData {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  data: any;
  position?: { x: number; y: number; width: number; height: number };
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    SimpleChartWidgetComponent
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  readonly dashboards = signal<Dashboard[]>([
    {
      id: 'simulation',
      name: 'Simulation Field Model Dashboard',
      description: 'Simulation data analysis',
      charts: [
        {
          id: 'chart1',
          title: 'Patient Accrual',
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Patients',
              data: [12, 19, 15, 25, 22, 30],
              borderColor: '#d4a421',
              backgroundColor: 'rgba(212, 164, 33, 0.1)',
              borderWidth: 2,
              fill: true
            }]
          }
        },
        {
          id: 'chart2',
          title: 'Treatment Outcomes',
          type: 'bar',
          data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
              label: 'Success Rate',
              data: [85, 92, 78, 89],
              backgroundColor: '#d4a421',
              borderRadius: 4
            }]
          }
        },
        {
          id: 'chart3',
          title: 'Resource Utilization',
          type: 'pie',
          data: {
            labels: ['ICU', 'General Ward', 'Outpatient', 'Emergency'],
            datasets: [{
              data: [30, 45, 15, 10],
              backgroundColor: ['#2196f3', '#4caf50', '#ff9800', '#e91e63'],
              borderWidth: 0
            }]
          }
        }
      ]
    },
    {
      id: 'lead-contact',
      name: 'Lead Contacts Dashboard',
      description: 'Lead management and contact tracking',
      charts: [
        {
          id: 'chart4',
          title: 'Lead Generation',
          type: 'line',
          data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              label: 'New Leads',
              data: [45, 62, 38, 55],
              borderColor: '#4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderWidth: 2,
              fill: true
            }]
          }
        },
        {
          id: 'chart5',
          title: 'Conversion Rate',
          type: 'doughnut',
          data: {
            labels: ['Converted', 'In Progress', 'Lost'],
            datasets: [{
              data: [65, 25, 10],
              backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
              borderWidth: 0
            }]
          }
        }
      ]
    },
    {
      id: 'fiber-tracts',
      name: 'Fiber Tracts Dashboard',
      description: 'Fiber network analysis',
      charts: [
        {
          id: 'chart6',
          title: 'Network Performance',
          type: 'bar',
          data: {
            labels: ['Node A', 'Node B', 'Node C', 'Node D'],
            datasets: [{
              label: 'Throughput (Mbps)',
              data: [120, 190, 150, 250],
              backgroundColor: '#2196f3',
              borderRadius: 4
            }]
          }
        }
      ]
    }
  ]);

  readonly selectedDashboard = signal<string>('simulation');
  readonly currentDashboard = computed(() => {
    return this.dashboards().find(d => d.id === this.selectedDashboard()) || this.dashboards()[0];
  });

  ngOnInit() {
    // Initialize with first dashboard
  }

  onDashboardChange(value: string) {
    if (value === 'create-new') {
      this.openCreateDashboardModal();
      return;
    }
    this.selectedDashboard.set(value);
    this.notificationService.show(`Switched to ${this.currentDashboard().name}`);
  }

  openCreateDashboardModal() {
    const dialogRef = this.dialog.open(CreateDashboardModalComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createNewDashboard(result.name, result.description);
      }
    });
  }

  createNewDashboard(name: string, description?: string) {
    const newDashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      name,
      description,
      charts: []
    };

    this.dashboards.update(dashboards => [...dashboards, newDashboard]);
    this.selectedDashboard.set(newDashboard.id);
    this.notificationService.show(`Dashboard "${name}" created successfully`);
  }

  onChartEdit(chart: ChartData) {
    // Handle chart editing
    console.log('Editing chart:', chart);
  }

  onChartDelete(chartId: string) {
    const dashboard = this.currentDashboard();
    if (dashboard) {
      dashboard.charts = dashboard.charts.filter(c => c.id !== chartId);
      this.notificationService.show('Chart deleted');
    }
  }

  onChartDuplicate(chart: ChartData) {
    const dashboard = this.currentDashboard();
    if (dashboard) {
      const duplicatedChart: ChartData = {
        ...chart,
        id: `${chart.id}-copy-${Date.now()}`,
        title: `${chart.title} (Copy)`
      };
      dashboard.charts.push(duplicatedChart);
      this.notificationService.show(`Chart "${chart.title}" duplicated`);
    }
  }
}