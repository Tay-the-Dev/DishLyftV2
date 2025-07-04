// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
    // Load required modules
    import('./router.js').then(router => {
        router.initRouter();
    });
    
    import('./cart.js').then(cart => {
        cart.initCart();
    });
});
