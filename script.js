// Sample product data
const products = [
    { id: 1, name: "Wireless Headphones", price: 79.99, category: "electronics", rating: 4.5, emoji: "🎧" },
    { id: 2, name: "Smart Watch", price: 199.99, category: "electronics", rating: 4.7, emoji: "⌚" },
    { id: 3, name: "Laptop Computer", price: 899.99, category: "electronics", rating: 4.8, emoji: "💻" },
    { id: 4, name: "Bluetooth Speaker", price: 49.99, category: "electronics", rating: 4.3, emoji: "🔊" },
    { id: 5, name: "Men's T-Shirt", price: 24.99, category: "clothing", rating: 4.2, emoji: "👕" },
    { id: 6, name: "Women's Dress", price: 59.99, category: "clothing", rating: 4.6, emoji: "👗" },
    { id: 7, name: "Running Shoes", price: 89.99, category: "clothing", rating: 4.5, emoji: "👟" },
    { id: 8, name: "Winter Jacket", price: 129.99, category: "clothing", rating: 4.7, emoji: "🧥" },
    { id: 9, name: "Best Seller Novel", price: 14.99, category: "books", rating: 4.9, emoji: "📚" },
    { id: 10, name: "Cookbook", price: 19.99, category: "books", rating: 4.4, emoji: "📖" },
    { id: 11, name: "Coffee Maker", price: 79.99, category: "home", rating: 4.6, emoji: "☕" },
    { id: 12, name: "Blender", price: 49.99, category: "home", rating: 4.3, emoji: "🥤" }
];

let cart = [];
let currentFilter = 'all';

// Initialize the page
function init() {
    displayProducts(products);
    updateCartCount();
}

// Display products
function displayProducts(productsToShow) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-rating">${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsContainer.appendChild(productCard);
    });
}

// Filter by category
function filterCategory(category) {
    currentFilter = category;
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    showNotification('Added to cart!');
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Show cart modal
function showCart() {
    const modal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty</p>';
    } else {
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    
    updateCartTotal();
    modal.style.display = 'block';
}

// Close cart modal
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            showCart();
            updateCartCount();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    showCart();
    updateCartCount();
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Order placed successfully!\nTotal: $${total.toFixed(2)}\n\nThank you for shopping with us!`);
    cart = [];
    updateCartCount();
    closeCart();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        closeCart();
    }
}

// Initialize on page load
init();
