export interface Order {
    id: string;
    date: string;
    status: 'Entregue' | 'Em Trânsito' | 'Cancelado';
    statusColor: string; // Tailwind class para a bolinha
    statusBg: string; // Tailwind class para o badge
    statusText: string; // Tailwind class para o texto
    total: number;
    itemsCount: number;
    images: string[];
    actionLabel: string;
}

export interface Address {
    id: number;
    label: string;
    street: string;
    city: string;
    zip: string;
    isMain: boolean;
}

export interface AdminOrder {
    id: string;
    customer: {
        name: string;
        email: string;
        avatar: string;
    };
    date: string;
    total: number;
    paymentStatus: 'Pago' | 'Pendente' | 'Falha' | 'Reembolsado';
    fulfillmentStatus: 'Não Enviado' | 'Enviado' | 'Entregue' | 'Devolvido';
    itemsCount: number;
}