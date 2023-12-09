import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-layout.component.html',
  styles: `
    .content {
      padding: 1.5rem;
      margin: 0 auto;
      background-color: #EFEFEA;
      height: 100vh;
    }
    .card, .btn {
      width: 18rem;
      background-color: white;
      border-radius: 12px;
      border: solid gray 2px;
      padding: 1.8rem;
    }
    .name {
      color: red;
    }
    .btn:hover {
      background-color: #f2e1e1;
    }
  `,
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);

  public user = computed(() => this.authService.currentUser());
  public users = computed(() => this.authService.users());
  public usersSubscription?: Subscription;

  fetchUsers() {
    this.usersSubscription = this.authService.fetchUsers();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
  }
}
