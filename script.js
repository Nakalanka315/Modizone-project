// =========================================
// 1. UI INTERACTIONS (Search, Popup, Menu)
// =========================================

let search = document.querySelector('.search-box');
let searchIcon = document.querySelector('#search-icon');

if(searchIcon) {
    searchIcon.onclick = () => {
        search.classList.toggle('active');
    }
}

// User Icon Popup Box
const userIcon = document.querySelector("#user-icon");
const popup = document.getElementById("popupBox");

if(userIcon && popup) {
    userIcon.addEventListener("click", () => {
        popup.classList.toggle("active");
    });

    // Close popup when clicking outside
    document.addEventListener("click", (e) => {
        if (!popup.contains(e.target) && !userIcon.contains(e.target)) {
            popup.classList.remove("active");
        }
    });
}

// Update Cart Count on Page Load
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});

// =========================================
// 2. BACKGROUND SLIDER (Home Page Only)
// =========================================
window.addEventListener("DOMContentLoaded", () => {
    const homeSection = document.querySelector(".home");

    if (homeSection) {
        const images = [
            "image/homeimg0.jpg", "image/homeimg1.png", "image/homeimg2.png",
            "image/homeimg3.png", "image/homeimg4.png", "image/homeimg5.png",
            "image/homeimg6.png", "image/homeimg7.png", "image/homeimg8.png"
        ];

        let index = 0;
        function changeBackground() {
            homeSection.style.backgroundImage = `url(${images[index]})`;
            index = (index + 1) % images.length;
        }
        changeBackground();
        setInterval(changeBackground, 5000);
    }
});

// =========================================
// 3. MAIN ROUTER (Decides what code to run)
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // Check which page we are on by looking for specific IDs
    const latestContainer = document.getElementById('latest-container');
    const allContainer = document.getElementById('all-container');
    const cartTable = document.getElementById('cart-items');
    const checkoutForm = document.getElementById('checkoutForm');

    // If on Shop Page
    if (latestContainer || allContainer) {
        loadShopProducts(latestContainer, allContainer);
    } 
    // If on Cart Page
    else if (cartTable) {
        renderCartTable();
    } 
    // If on Checkout Page
    else if (checkoutForm) {
        initCheckout();
    }
});

// =========================================
// 4. SHOP PAGE: FETCH PRODUCTS
// =========================================
function loadShopProducts(latestContainer, allContainer) {
    console.log("Fetching products...");
    
    fetch('backend/get_products.php')
        .then(response => {
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return response.text(); 
        })
        .then(text => {
            try {
                const products = JSON.parse(text); 
                
                products.forEach(product => {
                    // Safety: Handle single quotes in names to prevent JS errors
                    const safeName = product.name.replace(/'/g, "\\'"); 
                    const safeImage = product.image.replace(/'/g, "\\'");

                    const cardHTML = `
                        <div class="product-card box">
                            <div class="image">
                                <img src="${product.image}" alt="${product.name}" onerror="this.src='image/logo.png'"> 
                            </div>
                            <div class="content">
                                <h3>${product.name}</h3>
                                <div class="price">$${product.price}</div>
                                <button class="btn" onclick="addToCart(${product.id}, '${safeName}', ${product.price}, '${safeImage}')">Add to Cart</button>
                            </div>
                        </div>
                    `;

                    if (product.category && product.category.toLowerCase() === 'latest' && latestContainer) {
                        latestContainer.innerHTML += cardHTML;
                    }
                    if (allContainer) {
                        allContainer.innerHTML += cardHTML;
                    }
                });
            } catch (e) {
                console.error("JSON Error:", e);
            }
        })
        .catch(error => console.error('Fetch error:', error));
}

// =========================================
// 5. CART FUNCTIONALITY (LocalStorage)
// =========================================

// Helper to safely get cart
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error("Cart data corrupted, resetting.", e);
        localStorage.removeItem('cart');
        return [];
    }
}

function addToCart(id, name, price, image) {
    let cart = getCart();
    let existingItem = cart.find(item => item.id == id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(name + " added to cart!");
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        let cart = getCart();
        let totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        countElement.innerText = totalCount;
    }
}

function renderCartTable() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total-price');
    
    if (!cartItemsContainer || !totalElement) return;

    let cart = getCart();
    cartItemsContainer.innerHTML = ''; 
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5" style="text-align:center;">Your cart is empty.</td></tr>';
        totalElement.innerText = "$0.00";
        return;
    }

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        let row = `
            <tr>
                <td>
                    <img src="${item.image}" style="width:50px; height:50px; object-fit:cover; vertical-align:middle; margin-right:10px;">
                    ${item.name}
                </td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button onclick="updateQuantity(${index}, -1)" style="padding:5px 10px; cursor:pointer;">-</button>
                    <span style="margin:0 10px;">${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)" style="padding:5px 10px; cursor:pointer;">+</button>
                </td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td><i class="fa-solid fa-trash" onclick="removeFromCart(${index})" style="cursor:pointer; color:red;"></i></td>
            </tr>
        `;
        cartItemsContainer.innerHTML += row;
    });

    totalElement.innerText = "$" + total.toFixed(2);
}

function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartTable();
    updateCartCount();
}

function updateQuantity(index, change) {
    let cart = getCart();
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartTable();
        updateCartCount();
    }
}

// =========================================
// 6. CHECKOUT PAGE LOGIC (Send to Database)
// =========================================
function initCheckout() {
    console.log("Initializing Checkout Logic...");

    const totalDisplay = document.getElementById('checkout-total');
    const countDisplay = document.getElementById('checkout-item-count');
    const form = document.getElementById('checkoutForm');

    // Prevent default form action (fixes 404 error)
    if(form && form.hasAttribute('action')) {
        form.removeAttribute('action');
    }
    
    // 1. Get Cart
    let cart = getCart();
    
    // 2. Redirect if empty
    if (cart.length === 0) {
        alert("Your cart is empty! Please shop first.");
        window.location.href = "shopnow.html";
        return;
    }

    // 3. Calculate Totals
    let totalAmount = 0;
    let totalItems = 0;

    cart.forEach(item => {
        totalAmount += (item.price * item.quantity);
        totalItems += item.quantity;
    });

    // 4. Update HTML
    if (totalDisplay) totalDisplay.innerText = "$" + totalAmount.toFixed(2);
    if (countDisplay) countDisplay.innerText = totalItems;

    // 5. Handle Form Submit -> SEND TO PHP
    if(form){
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 

            // Get form values
            const name = document.getElementById('fullname').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phonenumber').value;

            // Prepare Data Package
            const orderData = {
                name: name,
                address: address,
                phone: phone,
                total: totalAmount,
                items: cart
            };

            // Send to Backend
            fetch('backend/place_order.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                if(data.status === "success") {
                    alert("Order Placed Successfully! \nOrder saved to Database.");
                    localStorage.removeItem('cart'); // Clear Cart
                    updateCartCount();
                    window.location.href = "index.html";
                } else {
                    alert("Error placing order: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Server Connection Error! Check console for details.");
            });
        });
    } else {
        console.error("Checkout Form not found!");
    }
}