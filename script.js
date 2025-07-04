
// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeCart();
    initializePaymentMethods();
    setupNavigation();
    loadRestaurantData();
});

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileNav.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && e.target !== hamburgerMenu) {
                mobileNav.classList.remove('active');
            }
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initializeCart() {
    updateCartCount();
    if (document.querySelector('.cart-main')) {
        renderCartItems();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems > 0 ? totalItems : '';
    }
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => 
        cartItem.id === item.id && cartItem.restaurant === item.restaurant
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${item.name} added to cart from ${item.restaurant}!`);
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const deliveryFee = 2.99;
    
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="index.html" class="btn-primary">Browse Restaurants</a>
            </div>
        `;
        if (subtotalElement) subtotalElement.textContent = '$0.00';
        if (totalElement) totalElement.textContent = `$${deliveryFee.toFixed(2)}`;
        return;
    }

    let cartHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const price = typeof item.price === 'string' ? 
            parseFloat(item.price.replace('$', '')) : 
            item.price;
            
        subtotal += price * (item.quantity || 1);
        cartHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-restaurant">${item.restaurant}</div>
                    <div class="item-price">$${price.toFixed(2)}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-id="${item.id}" data-restaurant="${item.restaurant}" data-change="-1">-</button>
                    <span class="quantity">${item.quantity || 1}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-restaurant="${item.restaurant}" data-change="1">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}" data-restaurant="${item.restaurant}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${(subtotal + deliveryFee).toFixed(2)}`;

    // Add event listeners to dynamic buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const restaurant = this.dataset.restaurant;
            const change = parseInt(this.dataset.change);
            updateQuantity(id, restaurant, change);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const restaurant = this.dataset.restaurant;
            removeFromCart(id, restaurant);
        });
    });
}

function updateQuantity(id, restaurant, change) {
    const itemIndex = cart.findIndex(item => 
        item.id === id && item.restaurant === restaurant
    );
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = (cart[itemIndex].quantity || 1) + change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
}

function removeFromCart(id, restaurant) {
    cart = cart.filter(item => 
        !(item.id === id && item.restaurant === restaurant)
    );
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

// Payment methods
function initializePaymentMethods() {
    if (document.querySelector('.payment-main')) {
        setupPaymentMethods();
    }
}

function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.querySelectorAll('[id$="-details"]');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
            
            paymentDetails.forEach(detail => detail.style.display = 'none');
            
            const methodType = method.dataset.method;
            const detailsElement = document.getElementById(`${methodType}-details`);
            if (detailsElement) {
                detailsElement.style.display = 'block';
            }
        });
    });
}

// Navigation and page loading
function setupNavigation() {
    document.querySelectorAll('a[href^="#"], a[href^="/"], a[href^="."]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                return;
            }
            
            e.preventDefault();
            const page = this.getAttribute('href').replace('.html', '').replace('/', '');
            loadPage(page);
        });
    });
}

function loadPage(page) {
    // In a real app, this would use fetch() or similar to load content
    console.log(`Loading ${page} page...`);
    
    // Update active state in navigation
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(page)) {
            link.classList.add('active');
        }
    });
    
    if (page === 'partners') {
        document.body.classList.add('partners-page');
    } else {
        document.body.classList.remove('partners-page');
    }
    
    // Handle restaurant page loading
    if (page === 'restaurant') {
        loadRestaurantData();
    }
}

// Restaurant data handling
function loadRestaurantData() {
    if (!document.querySelector('.restaurant-main')) return;

    // Get restaurant ID from URL (simulated here)
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id') || '1';
    
    // In a real app, you would fetch this data from an API
    const restaurant = getRestaurantById(restaurantId);
    
    if (restaurant) {
        renderRestaurantPage(restaurant);
    }
}

function getRestaurantById(id) {
    // Sample data - in a real app this would come from an API
    const restaurants = {
        '1': { // Burger Palace
            id: 1,
            name: "Burger Palace",
            banner: "images/restaurants/burger-palace-banner.jpg",
            rating: "4.5 ★ (248 reviews)",
            deliveryFee: "$2.99",
            deliveryTime: "20-30 min",
            cuisine: "American • Burgers • Fast Food",
            menu: {
                "Burgers": [
                    { id: 101, name: "Classic Cheeseburger", description: "Beef patty with American cheese, lettuce, tomato, pickles, and special sauce", price: 8.99, image: "images/food/classic-cheeseburger.jpg" },
                    { id: 102, name: "Bacon King Burger", description: "Two beef patties, smoked bacon, cheddar, crispy onions, and BBQ sauce", price: 12.99, image: "images/food/bacon-burger.jpg" },
                    { id: 103, name: "Mushroom Veggie Burger", description: "Portobello mushroom patty with avocado, sprouts, and garlic aioli", price: 10.49, image: "images/food/veggie-burger.jpg" }
                ],
                "Sides": [
                    { id: 104, name: "Classic Fries", description: "Crispy golden fries with sea salt", price: 3.99, image: "images/food/french-fries.jpg" },
                    { id: 105, name: "Beer Battered Onion Rings", description: "Crispy onion rings with ranch dipping sauce", price: 5.49, image: "images/food/onion-rings.jpg" }
                ]
            }
        },
        '2': { // Pizza Heaven
            id: 2,
            name: "Pizza Heaven",
            banner: "images/restaurants/pizza-heaven-banner.jpg",
            rating: "4.7 ★ (312 reviews)",
            deliveryFee: "$1.99",
            deliveryTime: "15-25 min",
            cuisine: "Italian • Pizza • Family Style",
            menu: {
                "Classic Pizzas": [
                    { id: 201, name: "Margherita", description: "Tomato sauce, fresh mozzarella, basil", price: 14.99, image: "images/food/margherita-pizza.jpg" },
                    { id: 202, name: "Pepperoni Classic", description: "Tomato sauce, mozzarella, spicy pepperoni", price: 16.99, image: "images/food/pepperoni-pizza.jpg" }
                ],
                "Specialty Pizzas": [
                    { id: 203, name: "BBQ Chicken", description: "BBQ sauce, chicken, red onions, cilantro", price: 18.99, image: "images/food/bbq-chicken-pizza.jpg" },
                    { id: 204, name: "Garden Vegan", description: "Vegan cheese, mushrooms, bell peppers, olives", price: 17.99, image: "images/food/vegan-pizza.jpg" }
                ]
            }
        },
        // Add other restaurants here following the same structure
        '3': { /* Sushi World */ },
        '4': { /* Taco Fiesta */ },
        '5': { /* Noodle House */ },
        '6': { /* Shake Joint */ }
    };
    
    return restaurants[id];
}

function renderRestaurantPage(restaurant) {
    // Update banner and header
    document.querySelector('.restaurant-banner img').src = restaurant.banner;
    document.querySelector('.restaurant-header h1').textContent = restaurant.name;
    document.querySelector('.restaurant-meta .rating').textContent = restaurant.rating;
    document.querySelector('.restaurant-meta .delivery-fee').textContent = restaurant.deliveryFee;
    document.querySelector('.restaurant-meta .delivery-time').textContent = restaurant.deliveryTime;
    document.querySelector('.cuisine-type').textContent = restaurant.cuisine;

    // Build menu sections
    const menuSection = document.querySelector('.menu-section');
    menuSection.innerHTML = '';
    
    for (const [category, items] of Object.entries(restaurant.menu)) {
        const categoryHTML = document.createElement('div');
        categoryHTML.innerHTML = `
            <h2>${category}</h2>
            <div class="menu-items"></div>
        `;
        
        const menuItemsContainer = categoryHTML.querySelector('.menu-items');
        
        items.forEach(item => {
            const itemHTML = document.createElement('div');
            itemHTML.className = 'menu-item';
            itemHTML.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p class="item-description">${item.description}</p>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                </div>
                <button class="add-to-cart">+</button>
            `;
            
            // Add click handler
            itemHTML.querySelector('.add-to-cart').addEventListener('click', () => {
                addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    restaurant: restaurant.name
                });
            });
            
            menuItemsContainer.appendChild(itemHTML);
        });
        
        menuSection.appendChild(categoryHTML);
    }
}

// Helper functions
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Partner form submission
if (document.querySelector('.partner-form')) {
    document.querySelector('.partner-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Application submitted successfully! We will contact you soon.');
        this.reset();
    });
}
