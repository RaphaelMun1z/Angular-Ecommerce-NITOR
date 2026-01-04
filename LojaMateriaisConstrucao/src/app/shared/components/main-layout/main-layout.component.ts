import { Component, inject, OnInit, signal } from '@angular/core';
import { FilterSidebarComponent } from "./filter-sidebar/filter-sidebar.component";
import { HeroCarouselComponent } from "./hero-carousel/hero-carousel.component";
import { GridHeaderComponent } from "./grid-header/grid-header.component";
import { ProductGridComponent } from './product-grid/product-grid.component';
import { EmptyStateComponent } from "./empty-state/empty-state.component";
import { Produto, ProdutoFiltro } from '../../../models/catalogo.models';
import { CatalogoService } from '../../../services/catalogo.service';
import { PageableParams } from '../../../models/shared.models';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-main-layout',
    imports: [FilterSidebarComponent, HeroCarouselComponent, GridHeaderComponent, ProductGridComponent, EmptyStateComponent],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.css'
})

export class MainLayoutComponent implements OnInit {
    private catalogoService = inject(CatalogoService);
    private route = inject(ActivatedRoute);
    
    // Dados
    produtos = signal<Produto[]>([]);
    totalItems = signal(0);
    loading = signal(true);
    
    // Estado Visual
    isMobileFilterOpen = signal(false);
    viewMode = signal<'grid' | 'list'>('grid');
    
    // Estado da Busca
    currentSort = signal(''); 
    currentFilter = signal<ProdutoFiltro | null>(null);
    
    ngOnInit() {
        // Escuta mudanças na URL de forma reativa
        this.route.queryParams.subscribe(params => {
            const termo = params['termo'];
            const filtroLocal = this.currentFilter();
            
            if (termo) {
                // 1. Caso haja termo na URL: Atualiza ou cria o filtro mantendo o termo
                this.currentFilter.set({
                    ...(filtroLocal || {
                        apenasAtivos: true
                    }),
                    termo: termo,
                    precoMin: 0,
                    precoMax: 10000
                });
                this.carregarDados();
            } else {
                // 2. Caso NÃO haja termo na URL:
                // Se existia um termo no filtro local, precisamos removê-lo para resetar a busca
                if (filtroLocal?.termo) {
                    const novoFiltro = { ...filtroLocal };
                    delete novoFiltro.termo;
                    
                    // Se após remover o termo, o filtro for o padrão (preços originais), podemos deixar null
                    // ou manter apenas os filtros de preço da sidebar.
                    this.currentFilter.set(novoFiltro);
                    this.carregarDados();
                } 
                // Se é o carregamento inicial da página (sem termo e sem produtos carregados)
                else if (this.produtos().length === 0) {
                    this.carregarDados();
                }
            }
        });
    }
    
    carregarDados() {
        this.loading.set(true);
        
        const pageParams: PageableParams = { 
            page: 0, 
            size: 20, 
            sort: this.currentSort() 
        };
        
        // Decide qual endpoint chamar
        const requisicao$ = this.currentFilter() 
        ? this.catalogoService.buscarProdutosComFiltro(this.currentFilter()!, pageParams)
        : this.catalogoService.listarProdutosVitrine(pageParams);
        
        requisicao$.subscribe({
            next: (page) => {
                this.produtos.set(page.content);
                this.totalItems.set(page.totalElements ?? 0);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar produtos', err);
                this.produtos.set([]);
                this.totalItems.set(0);
                this.loading.set(false);
            }
        });
    }
    
    aplicarFiltros(filtro: ProdutoFiltro) {
        // Ao aplicar filtros da sidebar, preservamos o termo de busca que está na URL se ele existir
        const termoUrl = this.route.snapshot.queryParams['termo'];
        if (termoUrl) {
            filtro.termo = termoUrl;
        }
        
        this.currentFilter.set(filtro);
        this.isMobileFilterOpen.set(false);
        this.carregarDados();
    }
    
    aplicarOrdenacao(sort: string) {
        this.currentSort.set(sort);
        this.carregarDados();
    }
    
    alterarVisualizacao(mode: 'grid' | 'list') {
        this.viewMode.set(mode);
    }
}