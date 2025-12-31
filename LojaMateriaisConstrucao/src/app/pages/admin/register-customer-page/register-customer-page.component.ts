import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-register-customer-page',
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './register-customer-page.component.html',
    styleUrl: './register-customer-page.component.css'
})

export class RegisterCustomerPageComponent {
    private fb = inject(FormBuilder);
    
    // Estado
    isLoading = signal(false);
    showToast = signal(false);
    
    // Formulário
    customerForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        document: [''],
        birthDate: [''],
        zipCode: [''],
        street: [''],
        number: [''],
        complement: [''],
        neighborhood: [''],
        city: [''],
        state: [''],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        status: ['active'],
        group: ['retail'],
        newsletter: [true],
        notes: ['']
    });
    
    isFieldInvalid(fieldName: string): boolean {
        const field = this.customerForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }
    
    onSubmit() {
        if (this.customerForm.valid) {
            this.isLoading.set(true);
            
            // Simulação de API
            setTimeout(() => {
                this.isLoading.set(false);
                this.showToast.set(true);
                setTimeout(() => this.showToast.set(false), 3000);
                
                console.log('Dados do Cliente:', this.customerForm.value);
            }, 1500);
        } else {
            this.customerForm.markAllAsTouched();
            // Não usamos alert em Angular moderno, ideal é ter um toast de erro ou feedback nos campos
        }
    }
}
