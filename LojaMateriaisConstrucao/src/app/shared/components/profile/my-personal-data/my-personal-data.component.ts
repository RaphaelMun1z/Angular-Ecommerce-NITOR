import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
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
export class MyPersonalDataComponent {
    // Injeção dos serviços reais do seu projeto
    private authService = inject(AuthService);
    private fileUploadService = inject(FileUploadService);
    private usuarioService = inject(UsuarioService);
    private toastr = inject(ToastrService);
    
    // Estado local reativo
    isUploading = signal(false);
    user = signal({
        id: '',
        name: '',
        email: '',
        cpf: '',
        phone: '',
        avatar: ''
    });
    
    constructor() {
        // Reage a mudanças no usuário logado (AuthService)
        effect(() => {
            const currentUser = this.authService.currentUser();
            if (currentUser) {
                // Se não houver avatar, usamos o serviço ui-avatars como fallback visual
                const defaultAvatar = `https://ui-avatars.com/api/?name=${currentUser.email}&background=0D8ABC&color=fff&size=128`;
                
                this.user.set({
                    id: currentUser.id || '',
                    email: currentUser.email || '',
                    name: currentUser.name || currentUser.email?.split('@')[0] || 'Usuário',
                    cpf: currentUser.cpf || '',
                    phone: currentUser.phone || '',
                    avatar: currentUser.avatar || defaultAvatar
                });
            }
        });
    }
    
    /**
    * Gerencia a seleção e o upload da nova imagem de perfil
    */
    onAvatarSelected(event: any) {
        const file: File = event.target.files[0];
        if (!file) return;
        
        // Validação de tipo de arquivo
        if (!file.type.startsWith('image/')) {
            this.toastr.warning('Por favor, selecione um arquivo de imagem válido (JPG, PNG).');
            return;
        }
        
        this.isUploading.set(true);
        
        // 1. Faz o upload físico para a pasta 'uploads' do backend via FileUploadService
        this.fileUploadService.upload(file).subscribe({
            next: (httpEvent: any) => {
                // Opcional: Monitorar progresso do upload
                if (httpEvent.type === HttpEventType.UploadProgress) {
                    const percent = Math.round(100 * httpEvent.loaded / httpEvent.total);
                    console.log(`Upload progress: ${percent}%`);
                } 
                
                // 2. Quando o upload terminar e o backend retornar o nome do arquivo
                else if (httpEvent instanceof HttpResponse) {
                    const uploadedFileName = httpEvent.body.fileName;
                    const userId = this.user().id;
                    
                    if (userId) {
                        // 3. Atualiza a referência da foto no banco de dados (tabela de usuários)
                        this.usuarioService.atualizarFoto(userId, uploadedFileName).subscribe({
                            next: () => {
                                // Gera a URL completa de visualização
                                const newAvatarUrl = this.fileUploadService.getPreviewUrl(uploadedFileName);
                                
                                // 4. Notifica o AuthService para atualizar o avatar no Header/Sidebar
                                this.authService.updateUser({ avatar: newAvatarUrl });
                                
                                // 5. Atualiza o estado local do componente
                                this.user.update(u => ({ ...u, avatar: newAvatarUrl }));
                                
                                this.toastr.success('Foto de perfil atualizada com sucesso!');
                                this.isUploading.set(false);
                            },
                            error: (err) => {
                                console.error('Erro ao vincular foto ao usuário:', err);
                                this.toastr.error('Erro ao salvar a foto no seu perfil.');
                                this.isUploading.set(false);
                            }
                        });
                    }
                }
            },
            error: (err) => {
                console.error('Erro no upload do arquivo:', err);
                this.toastr.error('Falha ao enviar a imagem para o servidor.');
                this.isUploading.set(false);
            }
        });
    }
    
    /**
    * Fallback para erros de carregamento da imagem (ex: link quebrado)
    */
    handleImageError(event: any) {
        const email = this.user().email;
        event.target.src = `https://ui-avatars.com/api/?name=${email}&background=0D8ABC&color=fff&size=128`;
    }
    
    /**
    * Placeholder para salvar outros dados do formulário
    */
    savePersonalData(event: Event) {
        event.preventDefault();
        this.toastr.info('A atualização de dados cadastrais será implementada em breve.');
    }
}
