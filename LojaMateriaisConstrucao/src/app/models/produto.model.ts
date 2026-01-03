export interface Produto {
    id: string;
    titulo: string;
    preco: number;
    precoPromocional?: number;
    estoque: number;
    imagemUrl?: string;
}