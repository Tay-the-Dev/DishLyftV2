// Mobile Navigation Toggle
const hamburgerMenu = document.getElementById('hamburger-menu');
const mobileNav = document.getElementById('mobile-nav');

hamburgerMenu.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && e.target !== hamburgerMenu) {
        mobileNav.classList.remove('active');
    }
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
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
        image: "https://via.placeholder.com/300x150"
    },
    {
        id: 2,
        name: "Pizza Heaven",
        cuisine: "Italian",
        rating: 4.2,
        deliveryTime: "25-35 min",
        deliveryFee: "$1.99",
        image: "https://via.placeholder.com/300x150"
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
