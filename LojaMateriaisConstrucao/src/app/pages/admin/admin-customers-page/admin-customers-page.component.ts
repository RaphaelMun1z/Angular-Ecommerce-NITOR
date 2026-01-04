import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageableParams } from '../../../models/shared.models';
import { Cliente } from '../../../models/usuario.models';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
    selector: 'app-admin-customers-page',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-customers-page.component.html',
    styleUrl: './admin-customers-page.component.css'
})
export class AdminCustomersPageComponent implements OnInit {
    private usuarioService = inject(UsuarioService);
    private toastr = inject(ToastrService);
    
    // Estado da UI
    isLoading = signal(true);
    searchTerm = signal('');
    
    // Dados Reais
    customers = signal<Cliente[]>([]);
    totalElements = signal(0);
    currentPage = signal(0);
    pageSize = signal(10);
    
    // Filtro local na página atual
    filteredCustomers = computed(() => {
        const list = this.customers();
        const term = this.searchTerm().toLowerCase().trim();
        
        if (!term) return list;
        
        return list.filter(c => 
            c.nome.toLowerCase().includes(term) || 
            c.email.toLowerCase().includes(term)
        );
    });
    
    ngOnInit() {
        this.loadCustomers();
    }
    
    loadCustomers() {
        this.isLoading.set(true);
        const params: PageableParams = {
            page: this.currentPage(),
            size: this.pageSize(),
            sort: 'nome,asc'
        };
        
        this.usuarioService.listarTodosClientes(params).subscribe({
            next: (page) => {
                this.customers.set(page.content);
                this.totalElements.set(page.totalElements);
                this.isLoading.set(false);
            },
            error: () => {
                this.toastr.error('Erro ao carregar lista de clientes.');
                this.isLoading.set(false);
            }
        });
    }
    
    changePage(delta: number) {
        const next = this.currentPage() + delta;
        const maxPage = Math.ceil(this.totalElements() / this.pageSize()) - 1;
        
        if (next >= 0 && next <= maxPage) {
            this.currentPage.set(next);
            this.loadCustomers();
        }
    }
}