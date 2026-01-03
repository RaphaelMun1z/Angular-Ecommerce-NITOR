import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterRequest, TokenResponse, User } from '../../models/auth.models';
import { tap, map, catchError, of, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = `${environment.apiUrl}/auth`;
    
    private _accessToken = signal<string | null>(localStorage.getItem('access_token'));
    
    public accessToken = this._accessToken.asReadonly();
    
    private _currentUser = signal<User | null>(null);
    public currentUser = this._currentUser.asReadonly();
    
    public isAuthenticated = computed(() => !!this._accessToken());
    
    constructor() {
        const token = this._accessToken();
        if (token) {
            this.decodeAndSetUser(token);
        }
    }
    
    // --- AÇÕES ---
    
    login(credentials: LoginRequest): Observable<boolean> {
        return this.http.post<TokenResponse>(`${this.apiUrl}/signin`, credentials).pipe(
            tap(response => this.handleAuthSuccess(response)),
            map(() => true),
            catchError(error => {
                console.error('Erro no login', error);
                return of(false);
            })
        );
    }
    
    register(data: RegisterRequest): Observable<boolean> {
        return this.http.post(`${this.apiUrl}/signup`, data).pipe(
            map(() => true),
            catchError(error => {
                console.error('Erro no registo', error);
                return of(false);
            })
        );
    }
    
    logout() {
        this._accessToken.set(null);
        this._currentUser.set(null);
        
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        
        this.router.navigate(['/login']);
    }
    
    cleanSession() {
        this.logout();
    }
    
    // --- MÉTODOS PRIVADOS ---
    
    private handleAuthSuccess(response: TokenResponse) {
        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('refresh_token', response.refreshToken);
        localStorage.setItem('username', response.username);
        
        this._accessToken.set(response.accessToken);
        this.decodeAndSetUser(response.accessToken);
    }
    
    private decodeAndSetUser(token: string) {
        try {
            const payload = this.parseJwt(token);
            const user: User = {
                email: payload.sub,
                roles: payload.roles
            };
            this._currentUser.set(user);
        } catch (e) {
            console.error('Erro ao decodificar token', e);
            this.logout();
        }
    }
    
    private parseJwt(token: string) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
    }
}