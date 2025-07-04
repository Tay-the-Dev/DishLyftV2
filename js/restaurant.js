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
                { 
                    id: 101, 
                    name: "Classic Cheeseburger", 
                    description: "Beef patty with American cheese, lettuce, tomato, and special sauce", 
                    price: 8.99, 
                    image: "images/food/classic-cheeseburger.jpg" 
                },
                { 
                    id: 102, 
                    name: "Bacon King", 
                    description: "Double beef patties with smoked bacon and cheddar", 
                    price: 11.99, 
                    image: "images/food/bacon-burger.jpg" 
                }
            ],
            "Sides": [
                { 
                    id: 201, 
                    name: "French Fries", 
                    description: "Crispy golden fries with sea salt", 
                    price: 3.99, 
                    image: "images/food/french-fries.jpg" 
                }
            ]
        }
    },
    'pizza-heaven': {
        id: 'pizza-heaven',
        name: "Pizza Heaven",
        banner: "images/restaurants/pizza-heaven-banner.jpg",
        rating: "4.7 ★ (312 reviews)",
        deliveryFee: "$1.99",
        deliveryTime: "15-25 min",
        cuisine: "Italian • Pizza",
        menu: {
            "Classic Pizzas": [
                { 
                    id: 301, 
                    name: "Margherita", 
                    description: "Tomato sauce, mozzarella, and basil", 
                    price: 12.99, 
                    image: "images/food/margherita-pizza.jpg" 
                }
            ],
            "Specialty Pizzas": [
                { 
                    id: 302, 
                    name: "BBQ Chicken", 
                    description: "BBQ sauce with grilled chicken and red onions", 
                    price: 15.99, 
                    image: "images/food/bbq-chicken-pizza.jpg" 
                }
            ]
        }
    },
    'taco-fiesta': {
        id: 'taco-fiesta',
        name: "Taco Fiesta",
        banner: "images/restaurants/taco-fiesta-banner.jpg",
        rating: "4.3 ★ (187 reviews)",
        deliveryFee: "$1.99",
        deliveryTime: "15-20 min",
        cuisine: "Mexican • Tacos",
        menu: {
            "Tacos": [
                { 
                    id: 401, 
                    name: "Carne Asada", 
                    description: "Grilled steak with onions and cilantro", 
                    price: 3.99, 
                    image: "images/food/carne-asada-taco.jpg" 
                }
            ],
            "Specialties": [
                { 
                    id: 402, 
                    name: "Quesadilla", 
                    description: "Flour tortilla with melted cheese", 
                    price: 7.99, 
                    image: "images/food/quesadilla.jpg" 
                }
            ]
        }
    },
    // Add other restaurants following the same pattern
    'noodle-house': { /* ... */ },
    'shake-joint': { /* ... */ },
    'sushi-world': { /* ... */ }
};

// Current restaurant cache
let currentRestaurant = null;

export function loadRestaurant() {
    const restaurantId = new URLSearchParams(window.location.search).get('id');
    currentRestaurant = restaurants[restaurantId];
    
    if (!currentRestaurant) {
        console.error('Restaurant not found:', restaurantId);
        return navigateTo('/');
    }
    
    renderRestaurantPage();
    setupCartEventListeners();
}

function renderRestaurantPage() {
    const restaurantContent = document.getElementById('restaurant-content');
    
    restaurantContent.innerHTML = `
        <header class="restaurant-header">
            <div class="restaurant-banner">
                <img src="${currentRestaurant.banner}" alt="${currentRestaurant.name}">
            </div>
            <div class="restaurant-info">
                <h1>${currentRestaurant.name}</h1>
                <div class="meta-info">
                    <span class="rating">${currentRestaurant.rating}</span>
                    <span class="delivery-fee">${currentRestaurant.deliveryFee}</span>
                    <span class="delivery-time">${currentRestaurant.deliveryTime}</span>
                </div>
                <p class="cuisine">${currentRestaurant.cuisine}</p>
            </div>
        </header>
        <main class="menu-container">
            ${renderMenuSections(currentRestaurant.menu)}
        </main>
    `;
}

function renderMenuSections(menu) {
    return Object.entries(menu).map(([category, items]) => `
        <section class="menu-section">
            <h2 class="section-title">${category}</h2>
            <div class="menu-items">
                ${items.map(item => `
                    <article class="menu-item" data-id="${item.id}">
                        <img class="item-image" src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h3 class="item-name">${item.name}</h3>
                            <p class="item-description">${item.description}</p>
                            <div class="item-footer">
                                <span class="item-price">$${item.price.toFixed(2)}</span>
                                <button class="add-to-cart" aria-label="Add to cart">+</button>
                            </div>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>
    `).join('');
}

function setupCartEventListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            const itemId = parseInt(menuItem.dataset.id);
            const item = getMenuItem(itemId);
            
            if (item) {
                import('./cart.js').then(({ addToCart }) => {
                    addToCart({
                        ...item,
                        restaurant: currentRestaurant.name,
                        restaurantId: currentRestaurant.id
                    });
                    showToast(`${item.name} added to cart!`);
                });
            }
        });
    });
}

function getMenuItem(itemId) {
    for (const category of Object.values(currentRestaurant.menu)) {
        const item = category.find(i => i.id === itemId);
        if (item) return item;
    }
    return null;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Helper to navigate (connected with router)
function navigateTo(path) {
    if (window.router) {
        window.router.navigateTo(path);
    } else {
        window.location.href = path;
    }
}
