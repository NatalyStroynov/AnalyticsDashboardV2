import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimpleChartWidgetComponent } from '../simple-chart-widget/simple-chart-widget.component';

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
    SimpleChartWidgetComponent
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {

  dashboards: Dashboard[] = [
    {
      id: 'simulation',
      name: 'Simulation Field Model Dashboard',
      description: 'Simulation data analysis',
      charts: [
        {
          id: 'chart1',
          title: 'Patient Accrual',
          type: 'line',
          data: {}
        },
        {
          id: 'chart2',
          title: 'Treatment Outcomes',
          type: 'bar',
          data: {}
        },
        {
          id: 'chart3',
          title: 'Resource Utilization',
          type: 'pie',
          data: {}
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
          data: {}
        },
        {
          id: 'chart5',
          title: 'Conversion Rate',
          type: 'doughnut',
          data: {}
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
          data: {}
        }
      ]
    }
  ];

  selectedDashboard = 'simulation';
  
  get currentDashboard() {
    return this.dashboards.find(d => d.id === this.selectedDashboard) || this.dashboards[0];
  }

  ngOnInit() {
    // Initialize with first dashboard
  }

  onDashboardChange(event: any) {
    const value = event.target.value;
    if (value === 'create-new') {
      this.createNewDashboard();
      return;
    }
    this.selectedDashboard = value;
  }

  createNewDashboard() {
    const name = prompt('Enter dashboard name:');
    if (name?.trim()) {
      const newDashboard: Dashboard = {
        id: `dashboard-${Date.now()}`,
        name: name.trim(),
        description: '',
        charts: []
      };
      this.dashboards.push(newDashboard);
      this.selectedDashboard = newDashboard.id;
    }
  }

  onChartEdit(chart: ChartData) {
    console.log('Editing chart:', chart);
  }

  onChartDelete(chartId: string) {
    const dashboard = this.currentDashboard;
    if (dashboard) {
      dashboard.charts = dashboard.charts.filter(c => c.id !== chartId);
    }
  }

  onChartDuplicate(chart: ChartData) {
    const dashboard = this.currentDashboard;
    if (dashboard) {
      const duplicatedChart: ChartData = {
        ...chart,
        id: `${chart.id}-copy-${Date.now()}`,
        title: `${chart.title} (Copy)`
      };
      dashboard.charts.push(duplicatedChart);
    }
  }
}