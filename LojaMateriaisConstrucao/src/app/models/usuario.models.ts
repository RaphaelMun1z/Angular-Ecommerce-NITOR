export interface Cliente {
    id: string;
    nome: string;
    email: string;
}

export interface Endereco {
    id: string;
    apelido: string;
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    principal: boolean;
}

export interface EnderecoRequest {
    apelido: string;
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    principal: boolean;
}