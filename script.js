// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileNav.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && e.target !== hamburgerMenu) {
                mobileNav.classList.remove('active');
            }
        });

        // Close when a nav item is clicked
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }

    // Initialize cart
    updateCartCount();
    if (document.querySelector('.cart-main')) {
        renderCartItems();
    }

    // Initialize payment methods
    if (document.querySelector('.payment-main')) {
        setupPaymentMethods();
    }

    // Make all navigation links work
    setupNavigation();
});

// Ensure all navigation links work properly
function setupNavigation() {
    // Handle internal navigation
    document.querySelectorAll('a[href^="#"], a[href^="/"], a[href^="."]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                return;
            }
            
            // For demo purposes, prevent actual page reloads
            e.preventDefault();
            const page = this.getAttribute('href').replace('.html', '').replace('/', '');
            loadPage(page);
        });
    });
}

// Demo page loading function
function loadPage(page) {
    console.log(`Loading ${page} page...`);
    // In a real app, this would load the actual page
    // For demo, we'll just show an alert
    alert(`Navigating to ${page} page (in a real app, this would load properly)`);
    
    // Update active state in navigation
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(page)) {
            link.classList.add('active');
        }
    });
    
    // Special handling for partners page
    if (page === 'partners') {
        document.body.classList.add('partners-page');
    } else {
        document.body.classList.remove('partners-page');
    }
}

// Cart functionality (same as before, but ensure it works with all pages)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems > 0 ? totalItems : '';
    }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// Sample function to add item to cart (would be used in restaurant page)
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Payment method selection
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    if (paymentMethods) {
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                paymentMethods.forEach(m => m.classList.remove('selected'));
                method.classList.add('selected');
            });
        });
    }
}

// Initialize payment methods on payment page
if (document.querySelector('.payment-page')) {
    setupPaymentMethods();
}

// Fake data for demonstration
const sampleRestaurants = [
    {
        id: 1,
        name: "Burger Palace",
        cuisine: "American",
        rating: 4.5,
        deliveryTime: "20-30 min",
        deliveryFee: "$2.99",
        image: "images/restaurant1.png"
    },
    {
        id: 2,
        name: "Pizza Heaven",
        cuisine: "Italian",
        rating: 4.2,
        deliveryTime: "25-35 min",
        deliveryFee: "$1.99",
        image: "restaurant2.png"
    }
];

const sampleMenuItems = [
    {
        id: 101,
        name: "Cheeseburger",
        description: "Classic beef patty with cheese, lettuce, and special sauce",
        price: "$8.99",
        image: "https://via.placeholder.com/100"
    },
    {
        id: 102,
        name: "Bacon Burger",
        description: "Juicy beef patty with crispy bacon and cheddar cheese",
        price: "$10.99",
        image: "https://via.placeholder.com/100"
    }
];

// Cart functionality
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="index.html" class="btn-primary">Browse Restaurants</a>
            </div>
        `;
        subtotalElement.textContent = '$0.00';
        totalElement.textContent = '$2.99'; // Just delivery fee
        return;
    }

    let cartHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        cartHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${(subtotal + 2.99).toFixed(2)}`; // Adding delivery fee
}

function updateQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

// Initialize cart on cart page
if (document.querySelector('.cart-main')) {
    renderCartItems();
}

// Payment method selection
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.querySelectorAll('[id$="-details"]');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            // Remove selected class from all methods
            paymentMethods.forEach(m => m.classList.remove('selected'));
            
            // Add selected class to clicked method
            method.classList.add('selected');
            
            // Hide all payment details
            paymentDetails.forEach(detail => detail.style.display = 'none');
            
            // Show corresponding payment details
            const methodType = method.dataset.method;
            const detailsElement = document.getElementById(`${methodType}-details`);
            if (detailsElement) {
                detailsElement.style.display = 'block';
            }
        });
    });
}

// Initialize payment methods on payment page
if (document.querySelector('.payment-main')) {
    setupPaymentMethods();
}

// Form validation for partner signup
if (document.querySelector('.partner-form')) {
    document.querySelector('.partner-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send the data to your server
        alert('Application submitted successfully! We will contact you soon.');
        this.reset();
    });
}
