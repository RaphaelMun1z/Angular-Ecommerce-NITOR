import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CART_ITEMS_MOCK } from '../../shared/mocks/CART_ITEMS_MOCK';
import { CartItem, PaymentMethod } from '../../shared/interfaces/Cart';

@Component({
    selector: 'app-finalize-purchase-page',
    imports: [CommonModule],
    templateUrl: './finalize-purchase-page.component.html',
    styleUrl: './finalize-purchase-page.component.css'
})

export class FinalizePurchasePageComponent {
    paymentMethod: PaymentMethod = 'credit';
    
    user = {
        name: 'Carlos Silva',
        email: 'carlos.silva@email.com',
    };
    
    cartItems: CartItem[] = CART_ITEMS_MOCK;
    
    get subtotal(): number {
        return this.cartItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
    }
    
    setPayment(method: PaymentMethod) {
        this.paymentMethod = method;
    }
}
