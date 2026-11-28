// LOCAL FARMER MARKET - JAVASCRIPT

let cart = JSON.parse(localStorage.getItem("farmerCart")) || [];

// ADD CART BUTTON TO EACH PRODUCT
document.querySelectorAll(".product").forEach(function(product, index) {

    let name = product.querySelector("h3").innerText;
    let priceText = product.querySelector(".price").innerText;
    let price = Number(priceText.replace(/[^\d.]/g, ""));

    product.dataset.id = index;
    product.dataset.name = name;
    product.dataset.price = price;

    let button = document.createElement("button");
    button.innerText = "Add to Cart";
    button.className = "add-cart-btn";

    button.onclick = function() {
        addToCart(index);
    };

    product.appendChild(button);
});

// CREATE CART SECTION
let cartSection = document.createElement("section");
cartSection.id = "shopping-cart";

cartSection.innerHTML = `
    <h2 class="section-title">🛒 Shopping Cart</h2>
    <div id="cartItems"></div>
    <h3 id="cartTotal">Total: ₹0</h3>
    <button id="clearCart">Clear Cart</button>
    <button id="checkoutBtn">Place Order</button>
`;

document.body.insertBefore(
    cartSection,
    document.querySelector("footer")
);

// ADD PRODUCT TO CART
function addToCart(index) {

    let product = document.querySelectorAll(".product")[index];

    let name = product.dataset.name;
    let price = Number(product.dataset.price);

    let existing = cart.find(item => item.name === name);

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

    alert(name + " added to cart!");
}

// SAVE CART
function saveCart() {
    localStorage.setItem("farmerCart", JSON.stringify(cart));
}

// DISPLAY CART
function displayCart() {

    let cartItems = document.getElementById("cartItems");
    let total = 0;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach(function(item, index) {

        let subtotal = item.price * item.quantity;
        total += subtotal;

        let div = document.createElement("div");
        div.className = "cart-item";

        let name = document.createElement("strong");
        name.textContent = item.name;

        let details = document.createElement("p");
        details.textContent =
            "₹" + item.price + " × " + item.quantity +
            " = ₹" + subtotal;

        let minus = document.createElement("button");
        minus.textContent = "-";
        minus.onclick = function() {
            changeQuantity(index, -1);
        };

        let plus = document.createElement("button");
        plus.textContent = "+";
        plus.onclick = function() {
            changeQuantity(index, 1);
        };

        let remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.onclick = function() {
            removeItem(index);
        };

        div.append(name, details, minus, plus, remove);
        cartItems.appendChild(div);
    });

    document.getElementById("cartTotal").textContent =
        "Total: ₹" + total;

    document.getElementById("checkoutBtn").disabled =
        cart.length === 0;
}

// CHANGE QUANTITY
function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    displayCart();
}

// REMOVE PRODUCT
function removeItem(index) {

    cart.splice(index, 1);

    saveCart();
    displayCart();
}

// CLEAR CART
document.getElementById("clearCart").onclick = function() {

    cart = [];

    saveCart();
    displayCart();
};

// PLACE ORDER
document.getElementById("checkoutBtn").onclick = function() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let customerName = prompt("Enter your name:");

    if (!customerName || !customerName.trim()) {
        alert("Please enter your name.");
        return;
    }

    let phone = prompt("Enter your phone number:");

    if (!phone || !/^\d{10}$/.test(phone.trim())) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    let total = cart.reduce(function(sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    let orderDetails = cart.map(function(item) {
        return item.name + " x " + item.quantity;
    }).join("\n");

    alert(
        "ORDER CONFIRMED!\n\n" +
        "Customer: " + customerName +
        "\nPhone: " + phone +
        "\n\nProducts:\n" + orderDetails +
        "\n\nTotal Amount: ₹" + total +
        "\n\nThank you for shopping!"
    );

    cart = [];
    saveCart();
    displayCart();
};

// SEARCH PRODUCTS
function searchProducts() {

    let search = document.getElementById("searchInput")
        .value.toLowerCase();

    let products = document.querySelectorAll(".product");
    let count = 0;

    products.forEach(function(product) {

        let name = product.querySelector("h3")
            .innerText.toLowerCase();

        let description = product.innerText.toLowerCase();

        if (description.includes(search)) {
            product.style.display = "block";
            count++;
        } else {
            product.style.display = "none";
        }
    });

    document.getElementById("noResults").style.display =
        count === 0 ? "block" : "none";
}

// FILTER PRODUCTS
function filterProducts(category) {

    document.getElementById("searchInput").value = "";

    let products = document.querySelectorAll(".product");
    let count = 0;

    products.forEach(function(product) {

        if (category === "all" ||
            product.dataset.category === category) {

            product.style.display = "block";
            count++;

        } else {
            product.style.display = "none";
        }
    });

    document.getElementById("noResults").style.display =
        count === 0 ? "block" : "none";
}

// INITIAL DISPLAY
displayCart();
