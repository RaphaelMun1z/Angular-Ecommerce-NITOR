export interface ReportType {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'Vendas' | 'Estoque' | 'Clientes' | 'Financeiro';
    colorClass: string; // Cor do ícone/bg
    selectedPeriod: string; // Estado local do filtro
}