import { CartItem } from '../interfaces/Cart';

export const CART_ITEMS_MOCK: CartItem[] = [
    {
        id: 1,
        name: 'Furadeira Impacto 12V',
        category: 'Ferramentas',
        price: 289.9,
        quantity: 1,
        stock: 10,
        images: [
            'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&h=200&fit=crop',
        ],
    },
    {
        id: 2,
        name: 'Cimento CP II 50kg',
        category: 'Cimento & Argamassa',
        price: 174.5,
        quantity: 5,
        stock: 50,
        images: [
            'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop',
        ],
    },
    {
        id: 3,
        name: 'Cimento CP II-E-32 50kg Votorantim',
        category: 'Cimento & Argamassa',
        price: 34.9,
        quantity: 10,
        stock: 50,
        images: [
            'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop',
        ],
    },
    {
        id: 4,
        name: 'Furadeira Parafusadeira Impacto 12V',
        category: 'Ferramentas',
        price: 289.9,
        quantity: 1,
        stock: 3,
        images: [
            'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&h=200&fit=crop',
        ],
    },
    {
        id: 5,
        name: 'Tinta Acrílica Fosca Premium Branco 18L',
        category: 'Tintas',
        price: 429.9,
        quantity: 1,
        stock: 2,
        images: [
            'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=200&fit=crop',
        ],
    },
];