import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Categoria, ProdutoRequest } from '../../../models/catalogo.models';
import { CatalogoService } from '../../../services/catalogo.service';

@Component({
    selector: 'app-register-product-page',
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './register-product-page.component.html',
    styleUrl: './register-product-page.component.css'
})

export class RegisterProductPageComponent implements OnInit {
    private fb = inject(FormBuilder);
    private catalogoService = inject(CatalogoService);
    private toastr = inject(ToastrService);
    private router = inject(Router);
    
    // Estado
    isLoading = signal(false);
    images = signal<string[]>([]);
    categorias = signal<Categoria[]>([]);
    
    // Formulário seguindo a interface ProdutoRequest
    productForm: FormGroup = this.fb.group({
        codigoControle: ['', [Validators.required, Validators.minLength(3)]], // SKU
        titulo: ['', [Validators.required, Validators.minLength(3)]],
        descricao: ['', [Validators.required]],
        preco: [null, [Validators.required, Validators.min(0.01)]],
        precoPromocional: [null, [Validators.min(0)]],
        estoque: [0, [Validators.required, Validators.min(0)]],
        ativo: [true, Validators.required],
        categoriaId: ['', Validators.required],
        pesoKg: [null],
        dimensoes: ['']
    });
    
    ngOnInit() {
        this.carregarCategorias();
    }
    
    carregarCategorias() {
        this.catalogoService.listarCategoriasAtivas({ page: 0, size: 100 }).subscribe({
            next: (page) => this.categorias.set(page.content),
            error: () => this.toastr.error('Erro ao carregar categorias.')
        });
    }
    
    // Upload Simulado (O backend atual ainda não lida com multipart, salvamos apenas os dados)
    onFileSelected(event: any) {
        const files = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.images.update(imgs => [...imgs, e.target.result]);
                };
                reader.readAsDataURL(files[i]);
            }
        }
    }
    
    removeImage(index: number) {
        this.images.update(imgs => imgs.filter((_, i) => i !== index));
    }
    
    isFieldInvalid(fieldName: string): boolean {
        const field = this.productForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }
    
    onSubmit() {
        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            this.toastr.warning('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        this.isLoading.set(true);
        const formValue = this.productForm.value;
        
        // Mapeia para o DTO esperado pelo Backend
        const request: ProdutoRequest = {
            codigoControle: formValue.codigoControle,
            titulo: formValue.titulo,
            descricao: formValue.descricao,
            preco: formValue.preco,
            precoPromocional: formValue.precoPromocional || undefined,
            estoque: formValue.estoque,
            ativo: formValue.ativo,
            categoriaId: formValue.categoriaId,
            pesoKg: formValue.pesoKg,
            dimensoes: formValue.dimensoes
        };
        
        this.catalogoService.salvarProduto(request).subscribe({
            next: (produto) => {
                this.toastr.success(`Produto "${produto.titulo}" cadastrado com sucesso!`);
                this.router.navigate(['/dashboard-admin']);
            },
            error: (err) => {
                const msg = err.error?.message || 'Erro ao salvar o produto.';
                this.toastr.error(msg, 'Erro');
                this.isLoading.set(false);
            }
        });
    }
}