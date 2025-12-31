import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportType } from '../../../shared/interfaces/ReportType';

@Component({
    selector: 'app-administrative-reports-page',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './administrative-reports-page.component.html',
    styleUrl: './administrative-reports-page.component.css'
})

export class AdministrativeReportsPageComponent {
    // Estado
    activeCategory = signal<'Todos' | 'Vendas' | 'Estoque' | 'Clientes' | 'Financeiro'>('Todos');
    loadingReportId = signal<string | null>(null);
    showToast = signal(false);
    
    // Lista de Relatórios Disponíveis
    reports = signal<ReportType[]>([
        {
            id: 'sales-period',
            title: 'Vendas por Período',
            description: 'Relatório detalhado de transações concluídas, incluindo ticket médio e métodos de pagamento.',
            icon: 'ph-chart-line-up',
            category: 'Vendas',
            colorClass: 'bg-green-50 text-green-600',
            selectedPeriod: 'month'
        },
        {
            id: 'top-products',
            title: 'Produtos Mais Vendidos',
            description: 'Ranking de performance de produtos (Curva ABC) para análise de demanda.',
            icon: 'ph-trophy',
            category: 'Vendas',
            colorClass: 'bg-green-50 text-green-600',
            selectedPeriod: 'month'
        },
        {
            id: 'inventory-status',
            title: 'Posição de Estoque',
            description: 'Visão geral do inventário atual, valor total em mercadoria e itens com estoque baixo.',
            icon: 'ph-package',
            category: 'Estoque',
            colorClass: 'bg-brand-50 text-brand-600',
            selectedPeriod: 'today'
        },
        {
            id: 'low-stock',
            title: 'Reposição Necessária',
            description: 'Lista crítica de produtos abaixo do estoque mínimo configurado para compra imediata.',
            icon: 'ph-warning',
            category: 'Estoque',
            colorClass: 'bg-brand-50 text-brand-600',
            selectedPeriod: 'today'
        },
        {
            id: 'customer-growth',
            title: 'Novos Clientes',
            description: 'Métricas de aquisição de clientes, cadastros realizados e origem do tráfego.',
            icon: 'ph-users-three',
            category: 'Clientes',
            colorClass: 'bg-blue-50 text-blue-600',
            selectedPeriod: 'month'
        },
        {
            id: 'inactive-customers',
            title: 'Clientes Inativos',
            description: 'Relatório de clientes sem compras no período selecionado para ações de reengajamento.',
            icon: 'ph-user-minus',
            category: 'Clientes',
            colorClass: 'bg-blue-50 text-blue-600',
            selectedPeriod: 'quarter'
        },
        {
            id: 'financial-summary',
            title: 'Faturamento & Receita',
            description: 'Balanço financeiro consolidado, fluxo de caixa previsto e realizado.',
            icon: 'ph-currency-dollar',
            category: 'Financeiro',
            colorClass: 'bg-purple-50 text-purple-600',
            selectedPeriod: 'month'
        },
        {
            id: 'cancelled-orders',
            title: 'Pedidos Cancelados',
            description: 'Análise de pedidos não concluídos, estornos realizados e motivos de cancelamento.',
            icon: 'ph-x-circle',
            category: 'Financeiro',
            colorClass: 'bg-purple-50 text-purple-600',
            selectedPeriod: 'month'
        }
    ]);
    
    // Filtro
    filteredReports() {
        const category = this.activeCategory();
        if (category === 'Todos') return this.reports();
        return this.reports().filter(r => r.category === category);
    }
    
    // Ação de Gerar
    generateReport(report: ReportType) {
        // Simula o processamento do backend
        this.loadingReportId.set(report.id);
        
        setTimeout(() => {
            this.loadingReportId.set(null);
            this.triggerToast();
            console.log(`Gerando relatório: ${report.title} para o período: ${report.selectedPeriod}`);
        }, 2000); // 2 segundos de loading fake
    }
    
    // Toast Control
    triggerToast() {
        this.showToast.set(true);
        setTimeout(() => this.showToast.set(false), 3000);
    }
}
