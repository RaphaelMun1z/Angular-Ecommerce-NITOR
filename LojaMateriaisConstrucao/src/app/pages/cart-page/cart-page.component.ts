import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartItem, PopupState, ProductResume } from '../../shared/interfaces/Cart';
import { RELATED_PRODUCTS_MOCK } from '../../shared/mocks/RELATED_PRODUCTS_MOCK';

@Component({
    selector: 'app-cart-page',
    imports: [CommonModule, FormsModule, CurrencyPipe],
    templateUrl: './cart-page.component.html',
    styleUrl: './cart-page.component.css'
})

export class CartPageComponent {
    cartItems = signal<CartItem[]>([]);
    
    relatedProducts = signal<ProductResume[]>(RELATED_PRODUCTS_MOCK);
    
    // Shipping State
    zipCode = signal('');
    showZipInput = signal(true);
    shippingCost = signal(0);
    
    // Popup State
    popup = signal<PopupState>({ visible: false, x: 0, y: 0, item: null });
    
    // --- Computed Values ---
    subtotal = computed(() => {
        return this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0);
    });
    
    total = computed(() => {
        return this.subtotal() + this.shippingCost();
    });
    
    // --- Methods ---
    
    updateQty(id: number, delta: number) {
        this.cartItems.update(items => {
            return items.map(item => {
                if (item.id === id) {
                    const newQty = item.quantity + delta;
                    return { ...item, quantity: newQty > 0 ? newQty : item.quantity }; // Prevent 0 quantity here, handle removal separately
                }
                return item;
            });
        });
        
        // Check if any reached 0 manually via delta (optional logic depending on UX preference)
        // Here I kept it > 0 to force user to click trash icon for safety
    }
    
    removeItem(id: number) {
        if (confirm('Deseja remover este item do carrinho?')) {
            this.cartItems.update(items => items.filter(i => i.id !== id));
            if (this.cartItems().length === 0) {
                this.popup.set({ visible: false, x: 0, y: 0, item: null });
            }
        }
    }
    
    addToCart(product: ProductResume) {
        this.cartItems.update(items => {
            const existing = items.find(i => i.id === product.id);
            if (existing) {
                return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...items, { ...product, quantity: 1 }];
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    resetCartDemo() {
        this.cartItems.set([
            { id: 1, name: "Cimento CP II-E-32 50kg", category: "Material", price: 34.90, quantity: 10, stock: 50, images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop"] },
            { id: 3, name: "Tinta Acrílica Fosca", category: "Tintas", price: 429.90, quantity: 1, stock: 2, images: ["https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=200&fit=crop"] }
        ]);
    }
    
    // --- Shipping Logic ---
    calculateShipping() {
        if (this.zipCode().length >= 8) {
            this.updateShippingCost(15.90);
            this.showZipInput.set(false);
        } else {
            alert('Por favor, digite um CEP válido.');
        }
    }
    
    toggleZipEdit() {
        this.showZipInput.set(true);
        this.shippingCost.set(0);
    }
    
    updateShippingCost(cost: number) {
        this.shippingCost.set(cost);
    }
    
    // --- Popup Logic (Reactive) ---
    showPopup(item: CartItem) {
        this.popup.update(s => ({ ...s, visible: true, item }));
    }
    
    movePopup(event: MouseEvent) {
        if (!this.popup().visible) return;
        
        const gap = 20;
        const popupWidth = 288; // w-72 = 18rem = 288px
        const popupHeight = 300; // Aproximado
        
        let left = event.clientX + gap;
        let top = event.clientY + gap;
        
        // Boundary Checks (Simple version)
        if (left + popupWidth > window.innerWidth) {
            left = event.clientX - popupWidth - gap;
        }
        if (top + popupHeight > window.innerHeight) {
            top = event.clientY - popupHeight - gap;
        }
        
        this.popup.update(s => ({ ...s, x: left, y: top }));
    }
    
    hidePopup() {
        this.popup.update(s => ({ ...s, visible: false }));
    }
}
