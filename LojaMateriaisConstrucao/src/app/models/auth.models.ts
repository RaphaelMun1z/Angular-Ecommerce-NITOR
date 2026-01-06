export interface LoginRequest {
    email: string;
    senha: string;
}

export interface RegisterRequest {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    telefone?: string;
}

export interface TokenResponse {
    username: string;
    authenticated: boolean;
    created: string;
    expiration: string;
    accessToken: string;
    refreshToken: string;
}

export interface User {
    id: string;
    email: string;
    name?: string; 
    cpf?: string;
    phone?: string;
    avatar?: string;
    sub?: string;
    roles?: string[];
}