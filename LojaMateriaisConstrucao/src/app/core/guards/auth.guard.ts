import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    if (authService.isAuthenticated()) {
        return true;
    }
    
    // Redireciona para login com a URL de retorno (opcional, para melhor UX)
    return router.createUrlTree(['/login']);
};

// Guard opcional para Admin
export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    // Verificação simples baseada no role (ajusta conforme o teu modelo de User)
    const user = authService.currentUser();
    if (user?.roles?.includes('ROLE_ADMIN')) {
        return true;
    }
    return false;
};