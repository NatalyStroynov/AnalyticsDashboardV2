import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filters-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filters-panel">
      <!-- Filters panel implementation -->
    </div>
  `,
  styles: [`
    .filters-panel {
      padding: 16px;
      background: #3a3a3a;
      border-radius: 8px;
    }
  `]
})
export class FiltersPanelComponent {
}