import { Component, inject, OnInit, signal } from '@angular/core';
import { FilterSidebarComponent } from "./filter-sidebar/filter-sidebar.component";
import { HeroCarouselComponent } from "./hero-carousel/hero-carousel.component";
import { GridHeaderComponent } from "./grid-header/grid-header.component";
import { ProductGridComponent } from './product-grid/product-grid.component';
import { EmptyStateComponent } from "./empty-state/empty-state.component";
import { Produto } from '../../../models/catalogo.models';
import { CatalogoService } from '../../../services/catalogo.service';

@Component({
    selector: 'app-main-layout',
    imports: [FilterSidebarComponent, HeroCarouselComponent, GridHeaderComponent, ProductGridComponent, EmptyStateComponent],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.css'
})

export class MainLayoutComponent implements OnInit {
    private catalogoService = inject(CatalogoService);
    
    produtos = signal<Produto[]>([]);
    loading = signal(true);
    
    ngOnInit() {
        this.carregarProdutos();
    }
    
    carregarProdutos() {
        this.catalogoService.listarProdutosVitrine({ page: 0, size: 20 }).subscribe({
            next: (page) => {
                this.produtos.set(page.content);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar vitrine', err);
                this.loading.set(false);
            }
        });
    }
}