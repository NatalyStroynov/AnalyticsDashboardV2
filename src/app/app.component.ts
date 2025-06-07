import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'analytics-dashboard';
}
