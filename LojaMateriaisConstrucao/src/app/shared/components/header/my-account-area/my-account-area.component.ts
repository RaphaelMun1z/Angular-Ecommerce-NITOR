import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-my-account-area',
    imports: [CommonModule, RouterLink],
    templateUrl: './my-account-area.component.html',
    styleUrl: './my-account-area.component.css'
})
export class MyAccountAreaComponent {
    authService = inject(AuthService);
    isMenuOpen = signal(false);
    
    toggleMenu() {
        this.isMenuOpen.update(v => !v);
    }
    
    onMouseEnter() {
        this.isMenuOpen.set(true);
    }
    
    onMouseLeave() {
        this.isMenuOpen.set(false);
    }
    
    logout() {
        this.authService.logout();
    }
    
    get userName(): string {
        return this.authService.currentUser()?.email || 'Minha Conta';
    }
}
