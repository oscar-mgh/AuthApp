import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { dashboardRoutes } from './dashboard.routes';

export const dashboardConfig: ApplicationConfig = {
  providers: [provideRouter(dashboardRoutes)],
};
