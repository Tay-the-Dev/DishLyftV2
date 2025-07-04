// Enhanced route configuration with parameter support
const routes = {
    '/': {
        id: 'home',
        loader: null // No special loader needed for home
    },
    '/restaurant': {
        id: 'restaurant',
        loader: () => import('./restaurants.js').then(module => module.loadRestaurant())
    },
    '/cart': {
        id: 'cart', 
        loader: () => import('./cart.js').then(module => module.renderCartItems())
    },
    '/orders': {
        id: 'orders',
        loader: () => import('./orders.js').then(module => module.loadOrders())
    },
    '/login': {
        id: 'login',
        loader: null
    },
    '/partners': {
        id: 'partners',
        loader: null
    }
};

export function initRouter() {
    // Handle initial load
    window.addEventListener('load', handleRoute);
    
    // Handle back/forward navigation
    window.addEventListener('popstate', handleRoute);
    
    // Intercept all link clicks
    document.addEventListener('click', e => {
        // Handle regular navigation links
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
        
        // Handle restaurant card clicks (even if they don't have data-link)
        const restaurantCard = e.target.closest('.restaurant-card');
        if (restaurantCard && restaurantCard.dataset.id) {
            e.preventDefault();
            navigateTo(`/restaurant?id=${restaurantCard.dataset.id}`);
        }
    });
}

function handleRoute() {
    const path = window.location.pathname;
    const route = routes[path] || routes['/']; // Default to home
    
    // Hide all content sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show current route's content
    const activeSection = document.getElementById(route.id);
    if (activeSection) {
        activeSection.style.display = 'block';
        
        // Initialize page-specific logic if loader exists
        if (route.loader) {
            route.loader().catch(error => {
                console.error('Error loading module:', error);
                navigateTo('/'); // Fallback to home on error
            });
        }
    }
}

export function navigateTo(path) {
    // Only update history if the path actually changed
    if (window.location.pathname !== new URL(path, window.location.origin).pathname) {
        window.history.pushState({}, '', path);
    }
    handleRoute();
}

// Helper function to extract URL parameters
export function getUrlParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}
