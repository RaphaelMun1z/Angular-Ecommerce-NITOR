import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-register-product-page',
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './register-product-page.component.html',
    styleUrl: './register-product-page.component.css'
})

export class RegisterProductPageComponent {
    private fb = inject(FormBuilder);
    
    // Estado
    isLoading = signal(false);
    showToast = signal(false);
    images = signal<string[]>([]);
    
    // Formulário
    productForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        status: ['active', Validators.required],
        category: ['', Validators.required],
        brand: [''],
        price: ['', Validators.required],
        salePrice: [''],
        stock: ['', Validators.required]
    });
    
    // Upload Simulado de Imagem
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
        if (this.productForm.valid) {
            this.isLoading.set(true);
            
            // Simulação de API
            setTimeout(() => {
                this.isLoading.set(false);
                this.showToast.set(true);
                setTimeout(() => this.showToast.set(false), 3000);
                
                console.log('Dados do Produto:', {
                    ...this.productForm.value,
                    images: this.images()
                });
            }, 1500);
        } else {
            this.productForm.markAllAsTouched();
            // Em uma aplicação real, aqui dispararíamos um toast de erro
        }
    }
}
