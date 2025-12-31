import { DashboardStatCard } from '../interfaces/Dashboard';

export const STATS_DATA_MOCK: Record<string, DashboardStatCard[]> = {
    'Hoje': [
        {
            title: 'Vendas',
            value: 'R$ 2.430',
            change: '+12%',
            isPositive: true,
            icon: 'ph-currency-dollar',
            colorClass: 'bg-green-50 text-green-600',
            comparisonText: 'Comparado a ontem'
        },
        {
            title: 'Pedidos',
            value: '38',
            change: '+8%',
            isPositive: true,
            icon: 'ph-shopping-cart',
            colorClass: 'bg-blue-50 text-blue-600',
            comparisonText: 'Comparado a ontem'
        },
        {
            title: 'Clientes',
            value: '21',
            change: '-3%',
            isPositive: false,
            icon: 'ph-users',
            colorClass: 'bg-purple-50 text-purple-600',
            comparisonText: 'Comparado a ontem'
        },
        {
            title: 'Conversão',
            value: '4.8%',
            change: '+0.6%',
            isPositive: true,
            icon: 'ph-chart-line-up',
            colorClass: 'bg-orange-50 text-orange-600',
            comparisonText: 'Comparado a ontem'
        }
    ],
    
    '7 Dias': [
        {
            title: 'Vendas',
            value: 'R$ 16.820',
            change: '+18%',
            isPositive: true,
            icon: 'ph-currency-dollar',
            colorClass: 'bg-green-50 text-green-600',
            comparisonText: 'Comparado aos 7 dias anteriores'
        },
        {
            title: 'Pedidos',
            value: '241',
            change: '+11%',
            isPositive: true,
            icon: 'ph-shopping-cart',
            colorClass: 'bg-blue-50 text-blue-600',
            comparisonText: 'Comparado aos 7 dias anteriores'
        },
        {
            title: 'Clientes',
            value: '136',
            change: '+4%',
            isPositive: true,
            icon: 'ph-users',
            colorClass: 'bg-purple-50 text-purple-600',
            comparisonText: 'Comparado aos 7 dias anteriores'
        },
        {
            title: 'Conversão',
            value: '5.2%',
            change: '+0.9%',
            isPositive: true,
            icon: 'ph-chart-line-up',
            colorClass: 'bg-orange-50 text-orange-600',
            comparisonText: 'Comparado aos 7 dias anteriores'
        }
    ],
    
    'Este Mês': [
        {
            title: 'Vendas',
            value: 'R$ 68.450',
            change: '+24%',
            isPositive: true,
            icon: 'ph-currency-dollar',
            colorClass: 'bg-green-50 text-green-600',
            comparisonText: 'Comparado ao mês anterior'
        },
        {
            title: 'Pedidos',
            value: '982',
            change: '+19%',
            isPositive: true,
            icon: 'ph-shopping-cart',
            colorClass: 'bg-blue-50 text-blue-600',
            comparisonText: 'Comparado ao mês anterior'
        },
        {
            title: 'Clientes',
            value: '524',
            change: '+7%',
            isPositive: true,
            icon: 'ph-users',
            colorClass: 'bg-purple-50 text-purple-600',
            comparisonText: 'Comparado ao mês anterior'
        },
        {
            title: 'Conversão',
            value: '5.6%',
            change: '+1.1%',
            isPositive: true,
            icon: 'ph-chart-line-up',
            colorClass: 'bg-orange-50 text-orange-600',
            comparisonText: 'Comparado ao mês anterior'
        }
    ]
};
