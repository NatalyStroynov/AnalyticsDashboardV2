import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardPageComponent],
  template: '<app-dashboard-page></app-dashboard-page>',
  styles: []
})
export class AppComponent {
  title = 'analytics-dashboard';
}
