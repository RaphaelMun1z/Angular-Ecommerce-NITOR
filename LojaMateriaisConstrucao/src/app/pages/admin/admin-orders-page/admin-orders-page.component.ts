import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Pedido } from '../../../models/pedido.models';
import { PageableParams } from '../../../models/shared.models';
import { PedidoService } from '../../../services/pedido.service';

@Component({
    selector: 'app-admin-orders-page',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-orders-page.component.html',
    styleUrl: './admin-orders-page.component.css'
})

export class AdminOrdersPageComponent implements OnInit {
    private pedidoService = inject(PedidoService);
    
    // Estado da UI
    activeFilter = signal<'all' | 'PAGO' | 'PENDENTE' | 'CANCELADO'>('all');
    searchTerm = signal('');
    isLoading = signal(true);
    
    // Dados Reais (Paginação)
    orders = signal<Pedido[]>([]);
    totalElements = signal(0);
    currentPage = signal(0);
    pageSize = signal(10);
    
    ngOnInit() {
        this.loadOrders();
    }
    
    loadOrders() {
        this.isLoading.set(true);
        
        const params: PageableParams = {
            page: this.currentPage(),
            size: this.pageSize(),
            sort: 'dataPedido,desc'
        };
        
        this.pedidoService.listarTodos(params).subscribe({
            next: (page) => {
                this.orders.set(page.content);
                this.totalElements.set(page.totalElements);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar pedidos', err);
                this.isLoading.set(false);
            }
        });
    }
    
    // Computed para busca e filtro local na página atual
    filteredOrders = computed(() => {
        let result = this.orders();
        const term = this.searchTerm().toLowerCase().trim();
        const filter = this.activeFilter();
        
        // 1. Filtro por Status (Backend Enum)
        if (filter !== 'all') {
            result = result.filter(o => o.status === filter);
        }
        
        // 2. Busca por ID ou ClienteId (UUIDs)
        if (term) {
            result = result.filter(o => 
                o.id.toLowerCase().includes(term) || 
                o.clienteId.toLowerCase().includes(term)
            );
        }
        
        return result;
    });
    
    setFilter(filter: 'all' | 'PAGO' | 'PENDENTE' | 'CANCELADO') {
        this.activeFilter.set(filter);
    }
    
    changePage(delta: number) {
        const next = this.currentPage() + delta;
        if (next >= 0) {
            this.currentPage.set(next);
            this.loadOrders();
        }
    }
    
    /* =====================
    * Helpers de Estilização (Mappings Reais)
    * ===================== */
    
    getPaymentBadgeClass(status: string): string {
        switch (status) {
            case 'PAGO':
            case 'ENTREGUE': 
            return 'bg-green-50 text-green-700 border-green-200';
            case 'AGUARDANDO_PAGAMENTO':
            case 'PENDENTE':
            return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'CANCELADO':
            return 'bg-red-50 text-red-700 border-red-200';
            default:
            return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    }
    
    getFulfillmentBadgeClass(status: string): string {
        switch (status) {
            case 'ENTREGUE': return 'bg-brand-50 text-brand-700 border-brand-200';
            case 'ENVIADO': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'EM_PREPARACAO': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'CANCELADO': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    }
}