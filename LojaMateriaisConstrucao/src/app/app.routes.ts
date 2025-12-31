import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { FinalizePurchasePageComponent } from './pages/finalize-purchase-page/finalize-purchase-page.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
    },
    {
        path: 'inicio',
        component: HomePageComponent
    },
    {
        path: 'produto',
        component: ProductPageComponent
    },
    {
        path: 'carrinho',
        component: CartPageComponent
    },
    {
        path: 'finalizar-compra',
        component: FinalizePurchasePageComponent
    }
];
