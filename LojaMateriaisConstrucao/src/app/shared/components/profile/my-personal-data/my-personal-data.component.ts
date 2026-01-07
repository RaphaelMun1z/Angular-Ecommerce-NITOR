import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/auth/auth.service';
import { FileUploadService } from '../../../../services/fileUpload.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-my-personal-data',
    imports: [CommonModule, FormsModule],
    templateUrl: './my-personal-data.component.html',
    styleUrl: './my-personal-data.component.css'
})
export class MyPersonalDataComponent implements OnInit {
    private authService = inject(AuthService);
    private fileUploadService = inject(FileUploadService);
    private usuarioService = inject(UsuarioService);
    private toastr = inject(ToastrService);
    
    isUploading = signal(false);
    isSaving = signal(false);
    
    // Objeto para bind do formulário [(ngModel)]
    formData = {
        nome: '',
        telefone: '',
        cpf: ''
    };
    
    // Signal para visualização e controle de UI (isCliente)
    user = signal({
        email: '',
        avatar: '',
        isCliente: false
    });
    
    constructor() {
        // Reage a qualquer mudança no utilizador global (AuthService)
        effect(() => {
            const currentUser = this.authService.currentUser();
            if (currentUser) {
                const isCliente = currentUser.roles ? currentUser.roles.includes('ROLE_CLIENTE') : false;
                
                // 1. Atualiza dados de exibição
                this.user.set({
                    email: currentUser.email,
                    avatar: currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.email}&background=0D8ABC&color=fff`,
                    isCliente: isCliente
                });
                
                // 2. Sincroniza os inputs do formulário
                // Usamos as propriedades do seu modelo User (phone e cpf)
                this.formData.nome = currentUser.name || '';
                this.formData.telefone = currentUser.phone || '';
                this.formData.cpf = currentUser.cpf || '';
            }
        });
    }
    
    ngOnInit() {
        // Garante que temos os dados mais frescos ao abrir a aba
        this.authService.refreshUserData();
    }
    
    savePersonalData(event: Event) {
        event.preventDefault();
        
        if (!this.formData.nome || this.formData.nome.length < 3) {
            this.toastr.warning('O nome deve ter pelo menos 3 caracteres.');
            return;
        }
        
        this.isSaving.set(true);
        
        // Prepara o payload para o UsuarioService.atualizarMeusDados
        // Removemos formatação de máscara para salvar apenas números se o backend exigir
        const payload = {
            nome: this.formData.nome,
            telefone: this.formData.telefone ? this.formData.telefone.replace(/\D/g, '') : '',
            cpf: this.formData.cpf ? this.formData.cpf.replace(/\D/g, '') : ''
        };
        
        this.usuarioService.atualizarMeusDados(payload).subscribe({
            next: () => {
                this.toastr.success('Dados atualizados com sucesso!');
                this.isSaving.set(false);
                // Solicita ao AuthService para buscar os dados novamente e disparar o effect de sincronia
                this.authService.refreshUserData();
            },
            error: (err) => {
                this.toastr.error(err.error?.message || 'Erro ao salvar alterações.');
                this.isSaving.set(false);
            }
        });
    }
    
    // --- Upload de Foto ---
    onAvatarSelected(event: any) {
        const file: File = event.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        
        this.isUploading.set(true);
        this.fileUploadService.upload(file).subscribe({
            next: (response: any) => {
                const body = response instanceof HttpResponse ? response.body : response;
                if (body && body.fileName) {
                    this.usuarioService.atualizarMeuAvatar(body.fileName).subscribe({
                        next: () => {
                            const newUrl = body.url;
                            this.authService.updateUser({ avatar: newUrl });
                            this.toastr.success('Foto de perfil atualizada!');
                            this.isUploading.set(false);
                        },
                        error: () => this.isUploading.set(false)
                    });
                }
            },
            error: () => this.isUploading.set(false)
        });
    }
    
    handleImageError(event: any) {
        event.target.src = `https://ui-avatars.com/api/?name=${this.user().email}&background=0D8ABC&color=fff`;
    }
}