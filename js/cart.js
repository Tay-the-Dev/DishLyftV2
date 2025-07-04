let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function initCart() {
    updateCartCount();
    document.addEventListener('click', handleCartActions);
}

export function addToCart(item) {
    const existingItem = cart.find(i => 
        i.id === item.id && i.restaurantId === item.restaurantId
    );
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
}

function handleCartActions(e) {
    if (e.target.matches('.quantity-btn')) {
        updateQuantity(
            e.target.dataset.id,
            e.target.dataset.restaurantId,
            parseInt(e.target.dataset.change)
        );
    }
    
    if (e.target.matches('.remove-btn')) {
        removeFromCart(
            e.target.dataset.id,
            e.target.dataset.restaurantId
        );
    }
}

export function renderCartItems() {
    // Cart rendering logic...
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}
