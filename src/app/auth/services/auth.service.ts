import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import {
  User,
  AuthStatus,
  LoginResponse,
  CheckTokenResponse,
} from '../interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  private _users = signal<User[]>([]);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());
  public users = computed(() => this._users());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  register(email: string, password: string, name: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/register`;
    const body = { email, password, name };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-auth`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  fetchUsers() {
    const url = `${this.baseUrl}/auth/users`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<User[]>(url, { headers })
      .pipe(catchError((err) => of([])))
      .subscribe((users) => this._users.set(users));
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    this.router.navigateByUrl('/auth/login');
  }
}
