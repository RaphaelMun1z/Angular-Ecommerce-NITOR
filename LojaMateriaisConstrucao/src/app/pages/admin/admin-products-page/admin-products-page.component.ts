import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Produto } from '../../../models/catalogo.models';
import { PageableParams } from '../../../models/shared.models';
import { CatalogoService } from '../../../services/catalogo.service';
import { TipoMovimentacao, MovimentacaoEstoqueRequest } from '../../../models/estoque.models';
import { EstoqueService } from '../../../services/estoque.service';

@Component({
    selector: 'app-admin-products-page',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
    templateUrl: './admin-products-page.component.html',
    styleUrl: './admin-products-page.component.css'
})
export class AdminProductsPageComponent implements OnInit {
    private catalogoService = inject(CatalogoService);
    private estoqueService = inject(EstoqueService);
    private toastr = inject(ToastrService);
    private fb = inject(FormBuilder);
    
    // Estado da UI
    isLoading = signal(true);
    isAdjusting = signal(false);
    searchTerm = signal('');
    activeStatusFilter = signal<'all' | 'active' | 'inactive'>('all');
    
    // Estado do Modal de Estoque
    showStockModal = signal(false);
    selectedProduct = signal<Produto | null>(null);
    
    // Dados Reais
    products = signal<Produto[]>([]);
    totalElements = signal(0);
    currentPage = signal(0);
    pageSize = signal(10);
    
    // Formulário de Ajuste
    stockForm: FormGroup = this.fb.group({
        quantidade: [1, [Validators.required, Validators.min(1)]],
        tipo: [TipoMovimentacao.ENTRADA, Validators.required],
        motivo: ['', [Validators.required, Validators.minLength(5)]]
    });
    
    filteredProducts = computed(() => {
        let result = this.products();
        const term = this.searchTerm().toLowerCase().trim();
        const filter = this.activeStatusFilter();
        
        if (filter === 'active') result = result.filter(p => p.ativo);
        if (filter === 'inactive') result = result.filter(p => !p.ativo);
        
        if (term) {
            result = result.filter(p => 
                p.titulo.toLowerCase().includes(term) || 
                p.codigoControle.toLowerCase().includes(term) ||
                p.categoria?.nome?.toLowerCase().includes(term)
            );
        }
        return result;
    });
    
    ngOnInit() {
        this.loadProducts();
    }
    
    loadProducts() {
        this.isLoading.set(true);
        const params: PageableParams = {
            page: this.currentPage(),
            size: this.pageSize(),
            sort: 'titulo,asc'
        };
        
        this.catalogoService.listarTodosProdutosAdmin(params).subscribe({
            next: (page) => {
                this.products.set(page.content || []);
                this.totalElements.set(page.totalElements || 0);
                this.isLoading.set(false);
            },
            error: () => {
                this.toastr.error('Erro ao carregar catálogo.');
                this.isLoading.set(false);
            }
        });
    }
    
    // --- Lógica de Estoque ---
    
    openStockModal(product: Produto) {
        this.selectedProduct.set(product);
        this.stockForm.reset({ quantidade: 1, tipo: TipoMovimentacao.ENTRADA, motivo: '' });
        this.showStockModal.set(true);
    }
    
    confirmStockAdjustment() {
        if (this.stockForm.invalid || !this.selectedProduct()) {
            this.stockForm.markAllAsTouched();
            return;
        }
        
        this.isAdjusting.set(true);
        const val = this.stockForm.value;
        const request: MovimentacaoEstoqueRequest = {
            produtoId: this.selectedProduct()!.id,
            quantidade: val.quantidade,
            tipo: val.tipo,
            motivo: val.motivo
        };
        
        this.estoqueService.registrarMovimentacao(request).subscribe({
            next: () => {
                this.toastr.success('Estoque atualizado com sucesso!');
                this.showStockModal.set(false);
                this.loadProducts(); // Recarrega a tabela para mostrar o novo saldo
            },
            error: (err) => this.toastr.error(err.error?.message || 'Erro ao ajustar estoque.'),
            complete: () => this.isAdjusting.set(false)
        });
    }
    
    // --- Outras Ações ---
    
    toggleStatus(product: Produto) {
        const action$ = product.ativo 
        ? this.catalogoService.desativarProduto(product.id)
        : this.catalogoService.ativarProduto(product.id);
        
        action$.subscribe({
            next: () => {
                this.toastr.success(`Status alterado com sucesso.`);
                this.loadProducts();
            },
            error: (err) => this.toastr.error(err.error?.message || 'Erro ao alterar status.')
        });
    }
    
    deleteProduct(product: Produto) {
        if (confirm(`Excluir permanentemente "${product.titulo}"?`)) {
            this.catalogoService.excluirProduto(product.id).subscribe({
                next: () => {
                    this.toastr.success('Produto removido.');
                    this.loadProducts();
                },
                error: (err) => this.toastr.error(err.error?.message || 'Erro ao excluir.')
            });
        }
    }
    
    changePage(delta: number) {
        const next = this.currentPage() + delta;
        if (next >= 0 && (next * this.pageSize() < this.totalElements())) {
            this.currentPage.set(next);
            this.loadProducts();
        }
    }
    
    get enumTipo() { return TipoMovimentacao; }
}