import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Endereco, EnderecoRequest } from '../models/usuario.models';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/enderecos`;
    
    // Estado local dos endereços para evitar refetching constante
    private _enderecos = signal<Endereco[]>([]);
    public enderecos = this._enderecos.asReadonly();
    
    carregarEnderecos(clienteId: string) {
        this.http.get<Endereco[]>(`${this.apiUrl}/cliente/${clienteId}`)
        .subscribe(lista => this._enderecos.set(lista));
    }
    
    adicionarEndereco(clienteId: string, dto: EnderecoRequest) {
        return this.http.post<Endereco>(`${this.apiUrl}/cliente/${clienteId}`, dto)
        .pipe(tap(() => this.carregarEnderecos(clienteId))); // Recarrega a lista
    }
    
    atualizarEndereco(id: string, dto: EnderecoRequest, clienteId: string) {
        return this.http.put<Endereco>(`${this.apiUrl}/${id}`, dto)
        .pipe(tap(() => this.carregarEnderecos(clienteId)));
    }
    
    removerEndereco(id: string, clienteId: string) {
        return this.http.delete(`${this.apiUrl}/${id}`)
        .pipe(tap(() => this.carregarEnderecos(clienteId)));
    }
    
    definirPrincipal(id: string, clienteId: string) {
        return this.http.patch(`${this.apiUrl}/${id}/principal`, {})
        .pipe(tap(() => this.carregarEnderecos(clienteId)));
    }
}