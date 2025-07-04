const restaurants = {
    'burger-palace': {
        id: 'burger-palace',
        name: "Burger Palace",
        banner: "images/restaurants/burger-palace-banner.jpg",
        rating: "4.5 ★ (248 reviews)",
        deliveryFee: "$2.99",
        deliveryTime: "20-30 min",
        cuisine: "American • Burgers • Fast Food",
        menu: {
            "Burgers": [
                { id: 101, name: "Classic Cheeseburger", description: "...", price: 8.99, image: "..." }
                // More items...
            ]
        }
    },
    // Other restaurants...
};

export function loadRestaurant() {
    const restaurantId = new URLSearchParams(window.location.search).get('id');
    const restaurant = restaurants[restaurantId];
    
    if (!restaurant) return;
    
    // Render restaurant page
    const template = `
        <div class="restaurant-banner">
            <img src="${restaurant.banner}" alt="${restaurant.name}">
        </div>
        <div class="restaurant-header">
            <h1>${restaurant.name}</h1>
            <!-- Other restaurant info -->
        </div>
        <div class="menu-section">
            ${renderMenuSections(restaurant.menu)}
        </div>
    `;
    
    document.getElementById('restaurant-content').innerHTML = template;
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.dataset.id;
            const item = getMenuItem(restaurantId, itemId);
            import('./cart.js').then(cart => {
                cart.addToCart({
                    ...item,
                    restaurant: restaurant.name,
                    restaurantId: restaurant.id
                });
            });
        });
    });
}

function renderMenuSections(menu) {
    return Object.entries(menu).map(([category, items]) => `
        <h2>${category}</h2>
        <div class="menu-items">
            ${items.map(item => `
                <div class="menu-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        <p class="item-price">$${item.price.toFixed(2)}</p>
                    </div>
                    <button class="add-to-cart" data-id="${item.id}">+</button>
                </div>
            `).join('')}
        </div>
    `).join('');
}
