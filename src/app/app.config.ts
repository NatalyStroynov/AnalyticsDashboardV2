import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { dashboardReducer } from './store/dashboard.reducer';
import { DashboardEffects } from './store/dashboard.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideStore({ dashboard: dashboardReducer }),
    provideEffects([DashboardEffects]),
    provideStoreDevtools({ 
      maxAge: 25, 
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
};