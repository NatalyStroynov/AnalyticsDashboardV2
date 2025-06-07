# Complete Angular Dashboard Project Files

Copy each section below to create the complete Angular CLI project.

## 1. Root Configuration Files

### angular.json (use existing file)
### tsconfig.json (use existing file)  
### tsconfig.app.json (use existing file)

### package.json (replace existing)
```json
{
  "name": "analytics-dashboard",
  "version": "1.0.0",
  "description": "Advanced Angular 17-based analytics dashboard for dynamic and interactive data visualization",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "serve": "ng serve --host 0.0.0.0 --port 4200",
    "build:prod": "ng build --configuration production"
  },
  "keywords": ["angular", "dashboard", "analytics", "charts", "visualization"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@angular/animations": "^17.3.0",
    "@angular/cdk": "^17.3.0",
    "@angular/cli": "^17.3.17",
    "@angular/common": "^17.3.0",
    "@angular/compiler": "^17.3.0",
    "@angular/core": "^17.3.0",
    "@angular/forms": "^17.3.0",
    "@angular/material": "^17.3.0",
    "@angular/platform-browser": "^17.3.0",
    "@angular/platform-browser-dynamic": "^17.3.0",
    "@angular/router": "^17.3.0",
    "chart.js": "^4.4.0",
    "rxjs": "^7.8.1",
    "tslib": "^2.6.3",
    "typescript": "^5.4.5",
    "zone.js": "^0.14.10"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^17.3.17",
    "@types/node": "^18.19.0"
  }
}
```

## 2. Source Files

### src/main.ts
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import './app/chart.config';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
```

### src/styles.scss
```scss
@import '@angular/material/theming';
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@include mat.core();

// Define custom dark palette
$dark-primary: mat.define-palette((
  50: #fef7e0,
  100: #fdeab3,
  200: #fcdd80,
  300: #fbd04d,
  400: #fac626,
  500: #d4a421,
  600: #c1931e,
  700: #ab801a,
  800: #956e16,
  900: #70530f,
  A100: #fdeab3,
  A200: #fcdd80,
  A400: #fac626,
  A700: #ab801a,
  contrast: (
    50: #2d2d2d,
    100: #2d2d2d,
    200: #2d2d2d,
    300: #2d2d2d,
    400: #2d2d2d,
    500: #2d2d2d,
    600: #ffffff,
    700: #ffffff,
    800: #ffffff,
    900: #ffffff,
    A100: #2d2d2d,
    A200: #2d2d2d,
    A400: #2d2d2d,
    A700: #ffffff,
  )
), 500);

$dark-accent: mat.define-palette(mat.$teal-palette, 500);
$dark-warn: mat.define-palette(mat.$red-palette);

$dark-theme: mat.define-dark-theme((
  color: (
    primary: $dark-primary,
    accent: $dark-accent,
    warn: $dark-warn,
  ),
  typography: mat.define-typography-config($font-family: 'Inter, sans-serif'),
  density: 0,
));

@include mat.all-component-themes($dark-theme);

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Inter', sans-serif;
  background: #2d2d2d;
  color: #ffffff;
  overflow-x: hidden;
}

// Global dark theme overrides
.mat-mdc-dialog-surface {
  background: #3a3a3a !important;
  color: white !important;
}

.mat-mdc-dialog-title {
  color: white !important;
}

.mat-mdc-form-field {
  .mat-mdc-text-field-wrapper {
    background: #2d2d2d !important;
  }
  
  .mat-mdc-form-field-outline {
    color: #555 !important;
  }
  
  .mat-mdc-form-field-outline-thick {
    color: #d4a421 !important;
  }
  
  .mat-mdc-floating-label {
    color: #ccc !important;
  }
  
  .mat-mdc-form-field-input-control {
    color: white !important;
  }
  
  input::placeholder {
    color: #888 !important;
  }
}

.mat-mdc-raised-button {
  &.mat-primary {
    background: #d4a421 !important;
    color: #2d2d2d !important;
    
    &:hover {
      background: #e6b82e !important;
    }
  }
  
  &:not(.mat-primary) {
    background: #555 !important;
    color: white !important;
    
    &:hover {
      background: #666 !important;
    }
  }
}

.mat-mdc-snack-bar-container {
  background: #3a3a3a !important;
  color: white !important;
  border: 1px solid #555;
}
```

### src/app/app.component.ts
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  template: '<app-dashboard-layout></app-dashboard-layout>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'analytics-dashboard';
}
```

### src/app/chart.config.ts
```typescript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export { ChartJS as Chart };
```

### src/app/services/notification.service.ts
```typescript
import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') {
    const notification: Notification = {
      id: `notification-${Date.now()}`,
      message,
      type,
      timestamp: new Date()
    };

    this.notifications.update(notifications => [...notifications, notification]);

    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      this.remove(notification.id);
    }, 3000);
  }

  remove(id: string) {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  getNotifications() {
    return this.notifications.asReadonly();
  }
}
```

## 3. Environment Files

### src/environments/environment.ts
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  chartRefreshInterval: 30000
};
```

### src/environments/environment.prod.ts
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api',
  chartRefreshInterval: 60000
};
```

## 4. Components

### src/app/components/create-dashboard-modal/create-dashboard-modal.component.ts
```typescript
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-dashboard-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Create New Dashboard</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Dashboard Name</mat-label>
        <input matInput [(ngModel)]="name" placeholder="Enter dashboard name" required>
      </mat-form-field>
      
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Description (optional)</mat-label>
        <input matInput [(ngModel)]="description" placeholder="Dashboard description">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onCreate()" [disabled]="!name?.trim()">
        Create Dashboard
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class CreateDashboardModalComponent {
  name = '';
  description = '';

  constructor(
    public dialogRef: MatDialogRef<CreateDashboardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  onCreate() {
    if (this.name?.trim()) {
      this.dialogRef.close({
        name: this.name.trim(),
        description: this.description?.trim()
      });
    }
  }
}
```

Continue to next message for remaining component files...