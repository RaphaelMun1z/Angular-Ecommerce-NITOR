import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemCarrinho } from '../../models/carrinho.models';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/auth/auth.service';
import { Produto } from '../../models/catalogo.models';
import { CarrinhoService } from '../../services/carrinho.service';
import { CatalogoService } from '../../services/catalogo.service';
import { PopupState } from '../../shared/interfaces/Cart';

@Component({
    selector: 'app-cart-page',
    imports: [CommonModule, FormsModule, CurrencyPipe],
    templateUrl: './cart-page.component.html',
    styleUrl: './cart-page.component.css'
})

export class CartPageComponent implements OnInit {
    private carrinhoService = inject(CarrinhoService);
    private authService = inject(AuthService);
    private catalogoService = inject(CatalogoService);
    private toastr = inject(ToastrService);
    private router = inject(Router);
    
    // Produtos relacionados (Cross-selling)
    relatedProducts = signal<Produto[]>([]);
    
    // Shipping State (Local apenas para simulação visual, já que não temos endpoint de cálculo de frete ainda)
    zipCode = signal('');
    showZipInput = signal(true);
    shippingCost = signal(0);
    
    // Popup State (Quick View do Item do Carrinho)
    popup = signal<PopupState>({ visible: false, x: 0, y: 0, item: null });
    
    // Acessando o sinal do serviço
    cartItems = computed(() => this.carrinhoService.carrinho()?.itens || []);
    
    // Totais
    subtotal = computed(() => this.carrinhoService.valorTotal());
    total = computed(() => this.subtotal() + this.shippingCost());
    
    constructor() {
        // Garante que o carrinho está atualizado ao entrar na página
        effect(() => {
            const user = this.authService.currentUser();
            if (user?.id) {
                this.carrinhoService.carregarCarrinho(user.id);
            }
        });
    }
    
    ngOnInit() {
        this.carregarProdutosRelacionados();
    }
    
    carregarProdutosRelacionados() {
        // Carrega produtos da vitrine como sugestão
        this.catalogoService.listarProdutosVitrine({ page: 0, size: 4 }).subscribe({
            next: (page) => this.relatedProducts.set(page.content)
        });
    }
    
    // --- Ações do Carrinho ---
    
    updateQty(item: ItemCarrinho, delta: number) {
        const novaQuantidade = item.quantidade + delta;
        
        if (novaQuantidade <= 0) {
            // Se for diminuir para 0, sugere remover
            this.removeItem(item);
            return;
        }
        
        const clienteId = this.authService.currentUser()?.id;
        // ATENÇÃO: O backend espera o produtoId. 
        // Se o seu DTO 'ItemCarrinho' não tem 'produtoId', você precisará ajustar o backend.
        // Aqui assumirei que item.id pode ser usado ou que vamos ajustar o backend.
        // Para funcionar AGORA com o seu backend atual, vamos supor que você ajustará o DTO para enviar 'produtoId'.
        // Vou usar 'any' temporariamente para evitar erro de compilação se a interface não tiver o campo.
        const produtoId = (item as any).produtoId || item.id; 
        
        if (clienteId) {
            this.carrinhoService.atualizarQuantidade(clienteId, produtoId, novaQuantidade).subscribe({
                error: (err) => this.toastr.error('Erro ao atualizar quantidade. Verifique o estoque.', 'Ops!')
            });
        }
    }
    
    removeItem(item: ItemCarrinho) {
        if (confirm(`Deseja remover "${item.nomeProduto}" do carrinho?`)) {
            const clienteId = this.authService.currentUser()?.id;
            // Mesmo caso do produtoId acima
            const produtoId = (item as any).produtoId || item.id;
            
            if (clienteId) {
                this.carrinhoService.removerItem(clienteId, produtoId).subscribe({
                    next: () => {
                        this.toastr.info('Item removido.', 'Carrinho');
                        // Fecha popup se o item removido for o que está aberto
                        if (this.popup().item === item) {
                            this.hidePopup();
                        }
                    }
                });
            }
        }
    }
    
    // Adicionar produto relacionado ao carrinho
    addToCart(product: Produto) {
        const clienteId = this.authService.currentUser()?.id;
        if (!clienteId) {
            this.router.navigate(['/login']);
            return;
        }
        
        this.carrinhoService.adicionarItem(clienteId, product.id).subscribe({
            next: () => {
                this.toastr.success(`${product.titulo} adicionado!`, 'Sucesso');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error: () => this.toastr.error('Erro ao adicionar produto.', 'Erro')
        });
    }
    
    // --- Lógica de Frete (Simulada) ---
    calculateShipping() {
        if (this.zipCode().length >= 8) {
            // Simulação: R$ 15,90 fixo se CEP válido
            this.updateShippingCost(15.90);
            this.showZipInput.set(false);
        } else {
            this.toastr.warning('Por favor, digite um CEP válido.');
        }
    }
    
    toggleZipEdit() {
        this.showZipInput.set(true);
        this.shippingCost.set(0);
    }
    
    updateShippingCost(cost: number) {
        this.shippingCost.set(cost);
    }
    
    finalizarCompra() {
        const clienteId = this.authService.currentUser()?.id;
        if (clienteId) {
            // Aqui você poderia chamar o checkout do pedidoService ou navegar para a página de pagamento
            this.router.navigate(['/finalizar-compra']);
        } else {
            this.router.navigate(['/login']);
        }
    }
    
    // --- Popup Logic ---
    showPopup(item: ItemCarrinho) {
        this.popup.update(s => ({ ...s, visible: true, item }));
    }
    
    movePopup(event: MouseEvent) {
        if (!this.popup().visible) return;
        
        const gap = 20;
        const popupWidth = 288;
        const popupHeight = 200;
        
        let left = event.clientX + gap;
        let top = event.clientY + gap;
        
        if (left + popupWidth > window.innerWidth) {
            left = event.clientX - popupWidth - gap;
        }
        
        this.popup.update(s => ({ ...s, x: left, y: top }));
    }
    
    hidePopup() {
        this.popup.update(s => ({ ...s, visible: false }));
    }
}