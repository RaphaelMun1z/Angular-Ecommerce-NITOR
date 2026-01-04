import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/auth/auth.service';
import { MetodoPagamento, PagamentoRequest } from '../../models/pedido.models';
import { CarrinhoService } from '../../services/carrinho.service';
import { PedidoService } from '../../services/pedido.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
    selector: 'app-finalize-purchase-page',
    imports: [CommonModule],
    templateUrl: './finalize-purchase-page.component.html',
    styleUrl: './finalize-purchase-page.component.css'
})

export class FinalizePurchasePageComponent {
    private authService = inject(AuthService);
    private carrinhoService = inject(CarrinhoService);
    private pedidoService = inject(PedidoService);
    public usuarioService = inject(UsuarioService);
    private router = inject(Router);
    private toastr = inject(ToastrService);
    
    // Estado Local
    paymentMethod = signal<'credit' | 'pix' | 'boleto'>('credit');
    isLoading = signal(false);
    selectedAddressId = signal<string | null>(null);
    
    // Estado do Usuário
    userEmail = computed(() => this.authService.currentUser()?.email || '');
    
    // Estado do Carrinho
    cartItems = computed(() => this.carrinhoService.carrinho()?.itens || []);
    subtotal = computed(() => this.carrinhoService.valorTotal());
    shippingCost = signal(15.90); 
    total = computed(() => this.subtotal() + this.shippingCost());
    
    // Acessa a lista de endereços do serviço
    addresses = this.usuarioService.enderecos;
    
    constructor() {
        // Carregar Dados Iniciais (Carrinho e Endereços)
        effect(() => {
            const userId = this.authService.currentUser()?.id;
            if (userId) {
                this.carrinhoService.carregarCarrinho(userId);
                this.usuarioService.carregarEnderecos(userId);
            }
        });
        
        // Selecionar endereço padrão automaticamente quando a lista carregar
        effect(() => {
            const addrs = this.addresses();
            if (addrs.length > 0 && !this.selectedAddressId()) {
                // Tenta pegar o principal, se não houver, pega o primeiro
                const principal = addrs.find(a => a.principal);
                this.selectedAddressId.set(principal ? principal.id : addrs[0].id);
            }
        });
    }
    
    setPayment(method: 'credit' | 'pix' | 'boleto') {
        this.paymentMethod.set(method);
    }
    
    confirmarPedido() {
        const userId = this.authService.currentUser()?.id;
        if (!userId) {
            this.toastr.error('Erro de autenticação.', 'Erro');
            return;
        }
        
        if (this.cartItems().length === 0) {
            this.toastr.warning('Seu carrinho está vazio.', 'Atenção');
            return;
        }
        
        if (!this.selectedAddressId()) {
            this.toastr.warning('Selecione um endereço de entrega.', 'Atenção');
            return;
        }
        
        this.isLoading.set(true);
        
        // 1. Criar Pedido (Checkout)
        this.pedidoService.checkout(userId).subscribe({
            next: (pedido) => {
                // 2. Registrar Pagamento (Aqui você poderia enviar também o endereço selecionado se o backend suportar)
                this.processarPagamento(pedido.id);
            },
            error: (err) => {
                console.error(err);
                this.toastr.error('Erro ao criar o pedido.', 'Erro');
                this.isLoading.set(false);
            }
        });
    }
    
    private processarPagamento(pedidoId: string) {
        const metodoMap: Record<string, MetodoPagamento> = {
            'credit': MetodoPagamento.CARTAO_CREDITO,
            'pix': MetodoPagamento.PIX,
            'boleto': MetodoPagamento.BOLETO
        };
        
        const pagamentoReq: PagamentoRequest = {
            metodo: metodoMap[this.paymentMethod()],
            valor: this.total(),
            numeroParcelas: this.paymentMethod() === 'credit' ? 1 : 1 
        };
        
        this.pedidoService.registrarPagamento(pedidoId, pagamentoReq).subscribe({
            next: () => {
                this.toastr.success('Pedido realizado com sucesso!', 'Parabéns');
                this.carrinhoService.limparEstadoLocal();
                this.router.navigate(['/pedido-confirmado']);
            },
            error: (err) => {
                console.error(err);
                this.toastr.warning('Pedido criado, mas houve erro no pagamento.', 'Atenção');
                this.router.navigate(['/pedido', pedidoId]);
            },
            complete: () => this.isLoading.set(false)
        });
    }
}