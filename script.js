
// Available products
const products = [
    {
        id: 1,
        name: "Headphones",
        price: 1499,
        image: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 2499,
        image: "⌚"
    },
    {
        id: 3,
        name: "Laptop",
        price: 49999,
        image: "💻"
    },
    {
        id: 4,
        name: "Mobile Phone",
        price: 15999,
        image: "📱"
    },
    {
        id: 5,
        name: "Camera",
        price: 12999,
        image: "📷"
    },
    {
        id: 6,
        name: "Speaker",
        price: 1999,
        image: "🔊"
    }
];

// Get elements
const productsContainer = document.getElementById("products");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
const clearCartBtn = document.getElementById("clearCartBtn");

// Load saved cart
let cart = [];

try {
    const savedCart = JSON.parse(localStorage.getItem("shoppingCart"));
    cart = Array.isArray(savedCart) ? savedCart : [];
} catch (error) {
    cart = [];
}

// Format prices in Indian Rupees
function formatPrice(price) {
    return price.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
    });
}

// Display available products
function displayProducts() {
    productsContainer.innerHTML = "";

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <h3>${product.name}</h3>
            <p>${formatPrice(product.price)}</p>
            <button class="add-btn" data-id="${product.id}">
                Add to Cart
            </button>
        `;

        productsContainer.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const cartProduct = cart.find(item => item.id === id);

    if (cartProduct) {
        cartProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

// Change product quantity
function changeQuantity(id, change) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        updateCart();
    }
}

// Remove product from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Display cart items and calculate total
function updateCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-message">Your cart is empty!</p>';
    }

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <h3>${item.image} ${item.name}</h3>
            <p>Price: ${formatPrice(item.price)}</p>

            <div class="quantity-controls">
                <button data-action="decrease" data-id="${item.id}">
                    -
                </button>

                <span>${item.quantity}</span>

                <button data-action="increase" data-id="${item.id}">
                    +
                </button>
            </div>

            <p>
                Subtotal:
                <strong>${formatPrice(item.price * item.quantity)}</strong>
            </p>

            <button class="remove-btn" data-action="remove"
                data-id="${item.id}">
                Remove
            </button>
        `;

        cartItems.appendChild(cartItem);
    });

    // Calculate number of items
    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    // Calculate total price
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = count;
    subtotalElement.textContent = formatPrice(total);
    totalElement.textContent = formatPrice(total);

    // Save cart in Local Storage
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

// Handle Add to Cart buttons
productsContainer.addEventListener("click", function(event) {
    const button = event.target.closest("[data-id]");

    if (button) {
        addToCart(Number(button.dataset.id));
    }
});

// Handle quantity and remove buttons
cartItems.addEventListener("click", function(event) {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "increase") {
        changeQuantity(id, 1);
    } else if (action === "decrease") {
        changeQuantity(id, -1);
    } else if (action === "remove") {
        removeFromCart(id);
    }
});

// Clear entire cart
clearCartBtn.addEventListener("click", function() {
    cart = [];
    updateCart();
});

// Initial display
displayProducts();
updateCart();
