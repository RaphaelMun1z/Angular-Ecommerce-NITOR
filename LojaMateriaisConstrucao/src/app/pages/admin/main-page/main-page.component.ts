import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { DashboardStatCard } from '../../../shared/interfaces/Dashboard';
import { STATS_DATA_MOCK } from '../../../shared/mocks/STATS_DATA_MOCK';
import { RECENT_ORDERS_MOCK } from '../../../shared/mocks/RECENT_ORDERS_MOCK';

@Component({
    selector: 'app-main-page',
    imports: [CommonModule],
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.css'
})

export class MainPageComponent {
    periods = ['Hoje', '7 Dias', 'Este Mês'];
    activePeriod = 'Hoje';
    
    setPeriod(period: string) {
        this.activePeriod = period;
        this.loadDashboardData();
    }
    
    /* =====================
    * Stats
    * ===================== */
    private statsData: Record<string, DashboardStatCard[]> = STATS_DATA_MOCK;
    
    stats = signal<DashboardStatCard[]>(this.statsData[this.activePeriod]);
    
    loadDashboardData() {
        this.stats.set(this.statsData[this.activePeriod] ?? []);
    }
    
    /* =====================
    * Recent Orders
    * ===================== */
    recentOrders = signal(RECENT_ORDERS_MOCK);
    
    getStatusClass(status: string) {
        return {
            Pago: 'bg-green-50 text-green-700 border-green-200',
            Pendente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            Cancelado: 'bg-red-50 text-red-700 border-red-200'
        }[status] ?? 'bg-gray-50 text-gray-700 border-gray-200';
    }
}
