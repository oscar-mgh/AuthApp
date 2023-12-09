import { Routes } from '@angular/router';
import { IsAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    canActivate: [IsAuthenticatedGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  { path: '**', redirectTo: 'auth' },
];
