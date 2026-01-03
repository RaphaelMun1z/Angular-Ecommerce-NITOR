import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    
    constructor(private zone: NgZone) {}
    
    handleError(error: any) {
        // Verifica se é um erro HTTP (geralmente já tratado pelo Interceptor, mas serve de backup)
        if (error instanceof HttpErrorResponse) {
            console.error('Backend returned status code:', error.status);
            console.error('Body was:', error.error);
        } else {
            // Erros de Cliente (JavaScript, Angular)
            console.error('An error occurred:', error);
            
            // Exemplo: Mostrar um alerta visual (Toast/Snackbar)
            // Usamos ngZone.run porque erros globais podem ocorrer fora do ciclo de deteção de mudanças do Angular
            this.zone.run(() => {
                // Aqui você pode chamar um NotificationService
                // ex: this.notificationService.error('Ocorreu um erro inesperado.');
                console.warn('Alerta para o utilizador: Ocorreu um erro inesperado. Por favor tente novamente.');
            });
        }
        
        // TODO: Aqui é onde enviaria o erro para um serviço de log externo (Sentry, LogRocket, etc.)
    }
}