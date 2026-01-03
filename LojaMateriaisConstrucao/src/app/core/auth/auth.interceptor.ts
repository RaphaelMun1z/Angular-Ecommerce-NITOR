import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.accessToken();
    
    // 1. Injeta o Token se existir
    let authReq = req;
    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    
    // 2. Trata erros globais (ex: Token Expirado)
    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Se der 401, o token é inválido ou expirou -> Logout forçado
                authService.cleanSession();
            }
            return throwError(() => error);
        })
    );
};