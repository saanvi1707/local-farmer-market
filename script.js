
// ==========================================
// LOCAL FARMER MARKET - JAVASCRIPT
// ==========================================

// LOAD CART FROM LOCAL STORAGE

let cart = JSON.parse(localStorage.getItem("farmerCart")) || [];

let currentCategory = "all";
let currentSearch = "";


// ==========================================
// CREATE SHOPPING CART SECTION
// ==========================================

function createCartSection() {

    // Avoid creating duplicate cart sections

    let cartSection = document.getElementById("shopping-cart");

    if (!cartSection) {

        cartSection = document.createElement("section");

        cartSection.id = "shopping-cart";

        cartSection.innerHTML = `
            <h2 class="section-title">🛒 Shopping Cart</h2>

            <div id="cartItems"></div>

            <h3 id="cartTotal">Total: ₹0</h3>

            <div style="text-align:center;">
                <button id="clearCart">Clear Cart</button>
            </div>

            <form id="checkoutForm">

                <h3>Customer Details</h3>

                <input
                    type="text"
                    id="customerName"
                    placeholder="Enter your full name"
                    required
                >

                <input
                    type="tel"
                    id="customerPhone"
                    placeholder="Enter 10-digit phone number"
                    maxlength="10"
                    pattern="[0-9]{10}"
                    required
                >

                <textarea
                    id="customerAddress"
                    placeholder="Enter your complete delivery address"
                    required
                ></textarea>

                <button type="submit" id="checkoutBtn">
                    Place Order
                </button>

            </form>

            <div id="orderMessage"></div>
        `;

        let footer = document.querySelector("footer");

        if (footer) {
            document.body.insertBefore(cartSection, footer);
        } else {
            document.body.appendChild(cartSection);
        }
    }
}


// ==========================================
// ADD CART LINK TO NAVIGATION
// ==========================================

function createCartNavigation() {

    let nav = document.querySelector("nav");

    if (!nav) return;

    let cartLink = nav.querySelector(
        'a[href="#shopping-cart"]'
    );

    if (!cartLink) {

        cartLink = document.createElement("a");

        cartLink.href = "#shopping-cart";

        nav.appendChild(cartLink);
    }

    cartLink.innerHTML =
        '🛒 Cart (<span id="cartCount">0</span>)';
}


// ==========================================
// ADD ADD-TO-CART BUTTON TO PRODUCTS
// ==========================================

function setupProducts() {

    document.querySelectorAll(".product").forEach(
        function(product, index) {

            let nameElement = product.querySelector("h3");

            let priceElement = product.querySelector(".price");

            if (!nameElement || !priceElement) return;

            let name = nameElement.innerText.trim();

            let priceText = priceElement.innerText;

            let price = Number(
                priceText.replace(/[^\d.]/g, "")
            );

            if (!name || !Number.isFinite(price)) return;

            product.dataset.id = index;

            product.dataset.name = name;

            product.dataset.price = price;

            // Prevent duplicate buttons

            if (!product.querySelector(".add-cart-btn")) {

                let button = document.createElement("button");

                button.innerText = "Add to Cart";

                button.className = "add-cart-btn";

                button.type = "button";

                button.onclick = function() {
                    addToCart(index);
                };

                product.appendChild(button);
            }
        }
    );
}


// ==========================================
// SAVE CART
// ==========================================

function saveCart() {

    localStorage.setItem(
        "farmerCart",
        JSON.stringify(cart)
    );
}


// ==========================================
// ADD PRODUCT TO CART
// ==========================================

function addToCart(index) {

    let products = document.querySelectorAll(".product");

    let product = products[index];

    if (!product) return;

    let name = product.dataset.name;

    let price = Number(product.dataset.price);

    let existing = cart.find(
        function(item) {
            return item.name === name;
        }
    );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();

    displayCart();

    alert(name + " added to your cart!");
}


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    let countElement = document.getElementById("cartCount");

    if (!countElement) return;

    let count = cart.reduce(
        function(total, item) {
            return total + item.quantity;
        },
        0
    );

    countElement.textContent = count;
}


// ==========================================
// DISPLAY CART ITEMS
// ==========================================

function displayCart() {

    let cartItems = document.getElementById("cartItems");

    let cartTotal = document.getElementById("cartTotal");

    let checkoutBtn = document.getElementById("checkoutBtn");

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p style='text-align:center;'>Your cart is empty. Add some fresh products!</p>";

    }

    cart.forEach(function(item, index) {

        let subtotal = item.price * item.quantity;

        total += subtotal;

        let div = document.createElement("div");

        div.className = "cart-item";

        let details = document.createElement("div");

        let name = document.createElement("h3");

        name.textContent = item.name;

        let price = document.createElement("p");

        price.textContent =
            "Price: ₹" + item.price +
            " × Quantity: " + item.quantity +
            " = ₹" + subtotal;

        details.append(name, price);


        // DECREASE BUTTON

        let minus = document.createElement("button");

        minus.textContent = "-";

        minus.type = "button";

        minus.onclick = function() {
            changeQuantity(index, -1);
        };


        // INCREASE BUTTON

        let plus = document.createElement("button");

        plus.textContent = "+";

        plus.type = "button";

        plus.onclick = function() {
            changeQuantity(index, 1);
        };


        // REMOVE BUTTON

        let remove = document.createElement("button");

        remove.textContent = "Remove";

        remove.type = "button";

        remove.onclick = function() {
            removeItem(index);
        };


        div.append(
            details,
            minus,
            plus,
            remove
        );

        cartItems.appendChild(div);
    });


    // DISPLAY TOTAL

    cartTotal.textContent = "Total: ₹" + total;


    // DISABLE CHECKOUT WHEN CART IS EMPTY

    if (checkoutBtn) {

        checkoutBtn.disabled = cart.length === 0;

    }

    updateCartCount();
}


// ==========================================
// CHANGE PRODUCT QUANTITY
// ==========================================

function changeQuantity(index, amount) {

    if (!cart[index]) return;

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    saveCart();

    displayCart();
}


// ==========================================
// REMOVE PRODUCT
// ==========================================

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    displayCart();
}


// ==========================================
// CLEAR CART
// ==========================================

function setupClearCart() {

    let clearButton = document.getElementById("clearCart");

    if (!clearButton) return;

    clearButton.onclick = function() {

        if (cart.length === 0) {

            alert("Your cart is already empty!");

            return;
        }

        if (confirm("Are you sure you want to clear your cart?")) {

            cart = [];

            saveCart();

            displayCart();
        }
    };
}


// ==========================================
// PLACE ORDER
// ==========================================

function setupCheckout() {

    let checkoutForm = document.getElementById("checkoutForm");

    if (!checkoutForm) return;

    checkoutForm.onsubmit = function(event) {

        event.preventDefault();

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;
        }

        let customerName = document
            .getElementById("customerName")
            .value.trim();

        let phone = document
            .getElementById("customerPhone")
            .value.trim();

        let address = document
            .getElementById("customerAddress")
            .value.trim();


        // VALIDATE CUSTOMER DETAILS

        if (!customerName || !phone || !address) {

            alert("Please fill in all customer details.");

            return;
        }

        if (!/^\d{10}$/.test(phone)) {

            alert("Please enter a valid 10-digit phone number.");

            return;
        }


        // CALCULATE TOTAL

        let total = cart.reduce(
            function(sum, item) {

                return sum + item.price * item.quantity;

            },
            0
        );


        // CREATE ORDER

        let order = {

            orderId: "FM" + Date.now(),

            customerName: customerName,

            phone: phone,

            address: address,

            products: cart.map(function(item) {

                return {
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                };

            }),

            totalAmount: total,

            orderDate: new Date().toLocaleString()

        };


        // SAVE ORDER IN LOCAL STORAGE

        let orders = JSON.parse(
            localStorage.getItem("farmerOrders")
        ) || [];

        orders.push(order);

        localStorage.setItem(
            "farmerOrders",
            JSON.stringify(orders)
        );


        // DISPLAY ORDER CONFIRMATION

        let message = document.getElementById("orderMessage");

        message.textContent =
            "Order placed successfully! " +
            "Order ID: " + order.orderId +
            ". Total Amount: ₹" + total +
            ". Thank you for shopping!";


        alert(
            "ORDER CONFIRMED!\n\n" +
            "Order ID: " + order.orderId +
            "\nCustomer: " + customerName +
            "\nPhone: " + phone +
            "\nTotal Amount: ₹" + total
        );


        // CLEAR CART AFTER ORDER

        cart = [];

        saveCart();

        displayCart();

        checkoutForm.reset();

        message.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    };
}


// ==========================================
// SEARCH PRODUCTS
// ==========================================

function searchProducts() {

    let searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    currentSearch = searchInput.value.toLowerCase().trim();

    applyProductFilters();
}


// ==========================================
// FILTER PRODUCTS BY CATEGORY
// ==========================================

function filterProducts(category) {

    currentCategory = category;

    let searchInput = document.getElementById("searchInput");

    if (searchInput) {

        searchInput.value = "";

    }

    currentSearch = "";

    applyProductFilters();
}


// ==========================================
// APPLY SEARCH AND CATEGORY FILTERS
// ==========================================

function applyProductFilters() {

    let products = document.querySelectorAll(".product");

    let count = 0;

    products.forEach(function(product) {

        let name = product.querySelector("h3");

        let description = product.innerText.toLowerCase();

        if (name) {
            description = description.toLowerCase();
        }

        let matchesSearch =
            description.includes(currentSearch);

        let matchesCategory =
            currentCategory === "all" ||
            product.dataset.category === currentCategory;

        if (matchesSearch && matchesCategory) {

            product.style.display = "";

            count++;

        } else {

            product.style.display = "none";

        }
    });


    let noResults = document.getElementById("noResults");

    if (noResults) {

        noResults.style.display =
            count === 0 ? "block" : "none";

    }
}


// ==========================================
// INITIALIZE WEBSITE
// ==========================================

function initializeWebsite() {

    createCartSection();

    createCartNavigation();

    setupProducts();

    setupClearCart();

    setupCheckout();

    displayCart();

    applyProductFilters();
}


// RUN AFTER HTML LOADS

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeWebsite
    );

} else {

    initializeWebsite();

}
