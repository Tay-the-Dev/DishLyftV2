// Page routes configuration
const routes = {
    '/': 'home',
    '/restaurant': 'restaurant',
    '/cart': 'cart',
    '/orders': 'orders',
    '/login': 'login',
    '/partners': 'partners'
};

export function initRouter() {
    // Handle initial load
    window.addEventListener('load', handleRoute);
    
    // Handle navigation
    window.addEventListener('popstate', handleRoute);
    
    // Intercept all link clicks
    document.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
}

function handleRoute() {
    const path = window.location.pathname;
    const route = routes[path] || 'home';
    
    // Hide all content sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show current route's content
    const activeSection = document.getElementById(route);
    if (activeSection) activeSection.style.display = 'block';
    
    // Initialize specific page logic
    switch(route) {
        case 'restaurant':
            import('./restaurants.js').then(restaurants => {
                restaurants.loadRestaurant();
            });
            break;
        case 'cart':
            import('./cart.js').then(cart => {
                cart.renderCartItems();
            });
            break;
    }
}

export function navigateTo(path) {
    window.history.pushState({}, '', path);
    handleRoute();
}
