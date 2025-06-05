import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    provideAnimationsAsync(),
    importProvidersFrom(
      BrowserAnimationsModule,
      DragDropModule,
      MatToolbarModule,
      MatButtonModule,
      MatIconModule,
      MatSelectModule,
      MatFormFieldModule,
      MatInputModule,
      MatCardModule,
      MatSidenavModule,
      MatListModule,
      MatCheckboxModule,
      MatSliderModule,
      MatDialogModule,
      MatMenuModule
    )
  ]
};
