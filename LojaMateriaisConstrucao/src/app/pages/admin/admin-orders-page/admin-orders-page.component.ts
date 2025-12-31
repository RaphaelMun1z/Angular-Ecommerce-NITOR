import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardOrder } from '../../../shared/interfaces/Dashboard';

@Component({
    selector: 'app-admin-orders-page',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './admin-orders-page.component.html',
    styleUrl: './admin-orders-page.component.css'
})

export class AdminOrdersPageComponent {
    // Estado UI
    activeFilter = signal<'all' | 'pago' | 'pendente'>('all');
    searchTerm = '';
    
    // Dados Mockados - Usando DashboardOrder
    orders = signal<DashboardOrder[]>([
        {
            id: '12345',
            customer: 'Roberto Silva',
            email: 'roberto@email.com',
            date: '31 Dez, 10:30',
            amount: 450.00,
            status: 'Concluído',
            avatar: 'https://ui-avatars.com/api/?name=Roberto+S&background=f3f4f6&color=4b5563'
        },
        {
            id: '12346',
            customer: 'Ana Clara',
            email: 'ana.c@email.com',
            date: '30 Dez, 16:45',
            amount: 1250.90,
            status: 'Processando',
            avatar: 'https://ui-avatars.com/api/?name=Ana+C&background=e0e7ff&color=4338ca'
        },
        {
            id: '12347',
            customer: 'Construtora Forte',
            email: 'compras@forte.com',
            date: '28 Dez, 09:15',
            amount: 5400.00,
            status: 'Pendente',
            avatar: 'https://ui-avatars.com/api/?name=Forte&background=fef3c7&color=d97706'
        },
        {
            id: '12348',
            customer: 'Marcos Paulo',
            email: 'mp@email.com',
            date: '27 Dez, 14:20',
            amount: 120.50,
            status: 'Cancelado',
            avatar: 'https://ui-avatars.com/api/?name=Marcos+P&background=fee2e2&color=dc2626'
        },
        {
            id: '12349',
            customer: 'Julia Roberts',
            email: 'juju@email.com',
            date: '26 Dez, 11:00',
            amount: 890.00,
            status: 'Concluído',
            avatar: 'https://ui-avatars.com/api/?name=Julia+R&background=d1fae5&color=059669'
        }
    ]);
    
    // Computed Filtered Orders
    filteredOrders = computed(() => {
        let result = this.orders();
        
        // Filtro por Status
        if (this.activeFilter() === 'pago') {
            result = result.filter(o => o.status === 'Concluído');
        } else if (this.activeFilter() === 'pendente') {
            result = result.filter(o => o.status === 'Pendente' || o.status === 'Processando');
        }
        
        // Filtro por Busca (ID, Nome, Email)
        if (this.searchTerm.trim()) {
            const term = this.searchTerm.toLowerCase();
            result = result.filter(o => 
                o.id.toLowerCase().includes(term) ||
                o.customer.toLowerCase().includes(term) ||
                o.email.toLowerCase().includes(term)
            );
        }
        
        return result;
    });
    
    setFilter(filter: 'all' | 'pago' | 'pendente') {
        this.activeFilter.set(filter);
    }
    
    getPaymentBadgeClass(status: string): string {
        // Mapeando status do pedido para cores de pagamento
        switch (status) {
            case 'Concluído': return 'bg-green-50 text-green-700 border-green-100'; // Pago
            case 'Processando': return 'bg-blue-50 text-blue-700 border-blue-100'; // Pago/Em andamento
            case 'Pendente': return 'bg-yellow-50 text-yellow-700 border-yellow-100'; // Aguardando
            case 'Cancelado': return 'bg-red-50 text-red-700 border-red-100'; // Falha/Cancelado
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    }
    
    getFulfillmentBadgeClass(status: string): string {
        // Mapeando status do pedido para cores de entrega
        switch (status) {
            case 'Concluído': return 'bg-brand-50 text-brand-700 border-brand-100'; // Entregue
            case 'Processando': return 'bg-blue-50 text-blue-700 border-blue-100'; // Enviado
            case 'Pendente': return 'bg-gray-100 text-gray-600 border-gray-200'; // Não enviado
            default: return 'bg-gray-50 text-gray-400 border-gray-200';
        }
    }
}
