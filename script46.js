/* =========================================================
   SI DIGITAL PRINTS & BANNER DESIGN
   script.js
   ========================================================= */


/* =========================================================
   PRODUCT DATABASE / CRUD DEMO
   ========================================================= */

   let products = JSON.parse(
    localStorage.getItem("siProducts")
) || [

    {
        id: 1,
        name: "Premium Banner",
        category: "Banners",
        price: 499,
        image:
            "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=900&q=85",
        description:
            "Premium quality banner printing for businesses, events and promotions."
    },

    {
        id: 2,
        name: "Business Cards",
        category: "Business Printing",
        price: 299,
        image:
            "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=900&q=85",
        description:
            "Professional business cards with premium paper and finishing."
    },

    {
        id: 3,
        name: "Custom T-Shirt",
        category: "Apparel",
        price: 599,
        image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
        description:
            "Custom T-shirt printing for companies, events and personal designs."
    },

    {
        id: 4,
        name: "Coffee Mug Printing",
        category: "Promotional",
        price: 349,
        image:
            "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=85",
        description:
            "Personalized coffee mug printing with high-quality graphics."
    },

    {
        id: 5,
        name: "Wedding Invitation",
        category: "Wedding",
        price: 799,
        image:
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85",
        description:
            "Elegant wedding invitation printing with premium finishing."
    },

    {
        id: 6,
        name: "Acrylic Sign Board",
        category: "Signage",
        price: 1499,
        image:
            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=85",
        description:
            "Premium acrylic signage for offices, shops and businesses."
    },

    {
        id: 7,
        name: "Poster Printing",
        category: "Printing",
        price: 199,
        image:
            "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=900&q=85",
        description:
            "High-resolution poster printing for advertising and events."
    },

    {
        id: 8,
        name: "Logo Design",
        category: "Design",
        price: 999,
        image:
            "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=85",
        description:
            "Professional logo design and brand identity development."
    }

];


/* =========================================================
   CART
   ========================================================= */

let cart = JSON.parse(
    localStorage.getItem("siCart")
) || [];


/* =========================================================
   USER
   ========================================================= */

let currentUser =
    localStorage.getItem("siUser") || null;


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderProducts();

        updateCart();

        updateUserInterface();

        setupScrollReveal();

        setupNavigation();

        setupKeyboardEvents();

    }
);


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    const grid =
        document.getElementById("productGrid");

    if (!grid) return;

    grid.innerHTML = "";

    if (products.length === 0) {

        grid.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
                color:#aaa;
            ">
                No products available.
            </div>
        `;

        return;
    }


    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "card reveal";


        card.innerHTML = `

            <img
                src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name)}"
                loading="lazy"
            >

            <div class="card-body">

                <small style="
                    color:#00d9ff;
                    display:block;
                    margin-bottom:7px;
                ">
                    ${escapeHTML(product.category)}
                </small>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                <div class="price">
                    ₹${formatCurrency(product.price)}
                </div>

                <button
                    class="btn btn-primary"
                    style="width:100%"
                    onclick="addToCart(${product.id})"
                >
                    🛒 Add to Cart
                </button>

            </div>
        `;

        grid.appendChild(card);

    });

    setupScrollReveal();
}


/* =========================================================
   CREATE PRODUCT
   CRUD - CREATE
   ========================================================= */

function createProduct(
    name,
    category,
    price,
    image,
    description
) {

    const product = {

        id:
            Date.now(),

        name:
            name,

        category:
            category,

        price:
            Number(price),

        image:
            image,

        description:
            description

    };


    products.push(product);

    saveProducts();

    renderProducts();

    return product;
}


/* =========================================================
   UPDATE PRODUCT
   CRUD - UPDATE
   ========================================================= */

function updateProduct(
    id,
    updatedData
) {

    const index =
        products.findIndex(
            product =>
                product.id === Number(id)
        );


    if (index === -1) {

        console.warn(
            "Product not found."
        );

        return false;
    }


    products[index] = {

        ...products[index],

        ...updatedData,

        price:
            Number(
                updatedData.price ??
                products[index].price
            )

    };


    saveProducts();

    renderProducts();

    return true;
}


/* =========================================================
   DELETE PRODUCT
   CRUD - DELETE
   ========================================================= */

function deleteProduct(id) {

    const confirmed =
        confirm(
            "Delete this product?"
        );


    if (!confirmed) return;


    products =
        products.filter(
            product =>
                product.id !== Number(id)
        );


    saveProducts();

    renderProducts();

}


/* =========================================================
   READ PRODUCT
   CRUD - READ
   ========================================================= */

function getProduct(id) {

    return products.find(
        product =>
            product.id === Number(id)
    );

}


/* =========================================================
   SAVE PRODUCTS
   ========================================================= */

function saveProducts() {

    localStorage.setItem(
        "siProducts",
        JSON.stringify(products)
    );

}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(id) {

    const product =
        getProduct(id);


    if (!product) {

        showNotification(
            "Product not found.",
            "error"
        );

        return;
    }


    const existing =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            category:
                product.category,

            price:
                product.price,

            image:
                product.image,

            quantity:
                1

        });

    }


    saveCart();

    updateCart();

    openCart();

    showNotification(
        `${product.name} added to cart.`,
        "success"
    );

}


/* =========================================================
   UPDATE CART
   ========================================================= */

function updateCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    if (!container) return;


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML = `

            <div style="
                text-align:center;
                padding:50px 15px;
                color:#aaa;
            ">

                <div style="
                    font-size:50px;
                    margin-bottom:15px;
                ">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add a printing product
                    to get started.
                </p>

            </div>
        `;

    }


    let subtotal = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price *
            item.quantity;


        subtotal +=
            itemTotal;


        const element =
            document.createElement(
                "div"
            );


        element.className =
            "cart-item";


        element.innerHTML = `

            <img
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.name)}"
            >

            <div class="cart-item-info">

                <strong>
                    ${escapeHTML(item.name)}
                </strong>

                <small style="
                    color:#888;
                ">
                    ${escapeHTML(item.category || "")}
                </small>

                <div style="
                    margin-top:5px;
                ">
                    ₹${formatCurrency(item.price)}
                </div>

                <div class="quantity">

                    <button
                        onclick="
                        changeQuantity(
                            ${item.id},
                            -1
                        )"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="
                        changeQuantity(
                            ${item.id},
                            1
                        )"
                    >
                        +
                    </button>

                    <button
                        class="remove"
                        onclick="
                        removeFromCart(
                            ${item.id}
                        )"
                    >
                        ×
                    </button>

                </div>

            </div>

        `;


        container.appendChild(
            element
        );

    });


    const tax =
        subtotal * 0.18;


    const total =
        subtotal + tax;


    const subtotalElement =
        document.getElementById(
            "subtotal"
        );

    const taxElement =
        document.getElementById(
            "tax"
        );

    const totalElement =
        document.getElementById(
            "grandTotal"
        );

    const countElement =
        document.getElementById(
            "cartCount"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            formatCurrency(subtotal);

    }


    if (taxElement) {

        taxElement.textContent =
            formatCurrency(tax);

    }


    if (totalElement) {

        totalElement.textContent =
            formatCurrency(total);

    }


    if (countElement) {

        countElement.textContent =
            cart.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.quantity,
                0
            );

    }


    saveCart();

}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQuantity(
    id,
    amount
) {

    const item =
        cart.find(
            product =>
                product.id === Number(id)
        );


    if (!item) return;


    item.quantity +=
        Number(amount);


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !== Number(id)
            );

    }


    saveCart();

    updateCart();

}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                item.id !== Number(id)
        );


    saveCart();

    updateCart();

    showNotification(
        "Product removed from cart.",
        "success"
    );

}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    if (cart.length === 0) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to clear the cart?"
        );


    if (!confirmed) return;


    cart = [];


    saveCart();

    updateCart();


    showNotification(
        "Cart cleared.",
        "success"
    );

}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {

    localStorage.setItem(
        "siCart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    const panel =
        document.getElementById(
            "cartPanel"
        );


    if (panel) {

        panel.classList.add(
            "active"
        );

    }

}


/* =========================================================
   CLOSE / TOGGLE CART
   ========================================================= */

function toggleCart() {

    const panel =
        document.getElementById(
            "cartPanel"
        );


    if (!panel) return;


    panel.classList.toggle(
        "active"
    );

}


/* =========================================================
   LOGIN MODAL
   ========================================================= */

function openLogin() {

    const modal =
        document.getElementById(
            "loginModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }


    const username =
        document.getElementById(
            "username"
        );


    if (username) {

        setTimeout(
            () =>
                username.focus(),
            150
        );

    }

}


/* =========================================================
   CLOSE LOGIN
   ========================================================= */

function closeLogin() {

    const modal =
        document.getElementById(
            "loginModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   LOGIN
   ========================================================= */

function login() {

    const usernameInput =
        document.getElementById(
            "username"
        );

    const passwordInput =
        document.getElementById(
            "password"
        );


    if (
        !usernameInput ||
        !passwordInput
    ) {

        return;

    }


    const username =
        usernameInput.value.trim();


    const password =
        passwordInput.value.trim();


    if (!username) {

        showNotification(
            "Please enter your User ID.",
            "error"
        );

        usernameInput.focus();

        return;
    }


    if (!password) {

        showNotification(
            "Please enter your password.",
            "error"
        );

        passwordInput.focus();

        return;
    }


    /*
       DEMO LOGIN ONLY.

       For production:
       connect this to a secure
       backend authentication API.
    */


    currentUser =
        username;


    localStorage.setItem(
        "siUser",
        username
    );


    updateUserInterface();

    closeLogin();


    usernameInput.value = "";

    passwordInput.value = "";


    showNotification(
        `Welcome, ${username}!`,
        "success"
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    if (!currentUser) {

        showNotification(
            "No user is currently logged in.",
            "error"
        );

        return;
    }


    const confirmed =
        confirm(
            "Do you want to logout?"
        );


    if (!confirmed) return;


    localStorage.removeItem(
        "siUser"
    );


    currentUser =
        null;


    updateUserInterface();


    showNotification(
        "You have been logged out.",
        "success"
    );

}


/* =========================================================
   UPDATE USER INTERFACE
   ========================================================= */

function updateUserInterface() {

    const loginLinks =
        document.querySelectorAll(
            'a[onclick="openLogin()"]'
        );


    loginLinks.forEach(
        link => {

            if (currentUser) {

                link.textContent =
                    `👤 ${currentUser}`;

            } else {

                link.textContent =
                    "User Login";

            }

        }
    );

}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

    if (cart.length === 0) {

        showNotification(
            "Your cart is empty.",
            "error"
        );

        return;
    }


    if (!currentUser) {

        showNotification(
            "Please login before checkout.",
            "error"
        );

        openLogin();

        return;
    }


    const subtotal =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                (
                    item.price *
                    item.quantity
                ),
            0
        );


    const tax =
        subtotal * 0.18;


    const total =
        subtotal + tax;


    const order = {

        orderId:
            "SID-" +
            Date.now(),

        customer:
            currentUser,

        items:
            [...cart],

        subtotal:
            subtotal,

        tax:
            tax,

        total:
            total,

        status:
            "Pending",

        createdAt:
            new Date()
                .toISOString()

    };


    saveOrder(order);


    showInvoice(order);


    cart = [];

    saveCart();

    updateCart();

}


/* =========================================================
   SAVE ORDER
   ========================================================= */

function saveOrder(order) {

    const orders =
        JSON.parse(
            localStorage.getItem(
                "siOrders"
            )
        ) || [];


    orders.push(order);


    localStorage.setItem(
        "siOrders",
        JSON.stringify(orders)
    );

}


/* =========================================================
   INVOICE
   ========================================================= */

function showInvoice(order) {

    const invoiceWindow =
        window.open(
            "",
            "_blank",
            "width=850,height=700"
        );


    if (!invoiceWindow) {

        showNotification(
            "Please allow popups to view the invoice.",
            "error"
        );

        return;
    }


    const itemRows =
        order.items
            .map(
                item => `

                    <tr>

                        <td>
                            ${escapeHTML(item.name)}
                        </td>

                        <td>
                            ${item.quantity}
                        </td>

                        <td>
                            ₹${formatCurrency(item.price)}
                        </td>

                        <td>
                            ₹${formatCurrency(
                                item.price *
                                item.quantity
                            )}
                        </td>

                    </tr>
                `
            )
            .join("");


    invoiceWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                SI Digital Invoice
            </title>

            <style>

                body {
                    font-family: Arial;
                    padding: 40px;
                    color: #222;
                }

                .header {
                    display:flex;
                    justify-content:space-between;
                    border-bottom:2px solid #222;
                    padding-bottom:20px;
                }

                h1 {
                    color:#5b2cff;
                }

                table {
                    width:100%;
                    border-collapse:collapse;
                    margin-top:30px;
                }

                th,
                td {
                    padding:12px;
                    border:1px solid #ddd;
                    text-align:left;
                }

                .total {
                    margin-top:25px;
                    text-align:right;
                }

                .grand {
                    font-size:24px;
                    font-weight:bold;
                }

                .print {
                    margin-top:30px;
                    padding:12px 20px;
                    border:0;
                    background:#5b2cff;
                    color:white;
                    border-radius:8px;
                    cursor:pointer;
                }

                @media print {

                    .print {
                        display:none;
                    }

                }

            </style>

        </head>

        <body>

            <div class="header">

                <div>

                    <h1>
                        SI DIGITAL PRINTS
                    </h1>

                    <p>
                        Banner Design & Digital Printing
                    </p>

                </div>

                <div>

                    <strong>
                        INVOICE
                    </strong>

                    <p>
                        ${order.orderId}
                    </p>

                    <p>
                        ${new Date(
                            order.createdAt
                        ).toLocaleDateString()}
                    </p>

                </div>

            </div>


            <h3>
                Customer
            </h3>

            <p>
                ${escapeHTML(order.customer)}
            </p>


            <table>

                <thead>

                    <tr>

                        <th>
                            Product
                        </th>

                        <th>
                            Qty
                        </th>

                        <th>
                            Price
                        </th>

                        <th>
                            Amount
                        </th>

                    </tr>

                </thead>

                <tbody>

                    ${itemRows}

                </tbody>

            </table>


            <div class="total">

                <p>
                    Subtotal:
                    ₹${formatCurrency(order.subtotal)}
                </p>

                <p>
                    GST 18%:
                    ₹${formatCurrency(order.tax)}
                </p>

                <p class="grand">
                    Grand Total:
                    ₹${formatCurrency(order.total)}
                </p>

            </div>


            <button
                class="print"
                onclick="window.print()"
            >
                Print Invoice
            </button>

        </body>

        </html>

    `);


    invoiceWindow.document.close();

}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function setupScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );


    if (!("IntersectionObserver" in window)) {

        elements.forEach(
            element =>
                element.classList.add(
                    "show"
                )
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add("show");

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold:
                    0.12
            }
        );


    elements.forEach(
        element =>
            observer.observe(
                element
            )
    );

}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function toggleMenu() {

    const nav =
        document.getElementById(
            "navLinks"
        );


    if (!nav) return;


    nav.classList.toggle(
        "active"
    );

}


/* =========================================================
   NAVIGATION LINKS
   ========================================================= */

function setupNavigation() {

    const links =
        document.querySelectorAll(
            ".nav-links a"
        );


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    const nav =
                        document.getElementById(
                            "navLinks"
                        );


                    if (nav) {

                        nav.classList.remove(
                            "active"
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   KEYBOARD EVENTS
   ========================================================= */

function setupKeyboardEvents() {

    document.addEventListener(
        "keydown",
        event => {

            /* ESC closes cart */

            if (
                event.key === "Escape"
            ) {

                const cartPanel =
                    document.getElementById(
                        "cartPanel"
                    );

                const loginModal =
                    document.getElementById(
                        "loginModal"
                    );


                if (cartPanel) {

                    cartPanel.classList.remove(
                        "active"
                    );

                }


                if (loginModal) {

                    loginModal.classList.remove(
                        "active"
                    );

                }

            }


            /* CTRL + K opens cart */

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                openCart();

            }

        }
    );

}


/* =========================================================
   NOTIFICATION
   ========================================================= */

function showNotification(
    message,
    type = "success"
) {

    const existing =
        document.querySelector(
            ".si-notification"
        );


    if (existing) {

        existing.remove();

    }


    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        "si-notification";


    const background =
        type === "error"
            ? "#ff4966"
            : "#20d889";


    notification.innerHTML = `

        <span>
            ${type === "error" ? "⚠️" : "✓"}
        </span>

        <span>
            ${escapeHTML(message)}
        </span>

    `;


    Object.assign(
        notification.style,
        {

            position:
                "fixed",

            top:
                "95px",

            right:
                "25px",

            zIndex:
                "5000",

            display:
                "flex",

            alignItems:
                "center",

            gap:
                "10px",

            padding:
                "14px 20px",

            color:
                "#ffffff",

            background:
                background,

            borderRadius:
                "12px",

            boxShadow:
                "0 15px 40px rgba(0,0,0,.3)",

            fontWeight:
                "700",

            transform:
                "translateX(120%)",

            transition:
                "transform .35s ease"

        }
    );


    document.body.appendChild(
        notification
    );


    requestAnimationFrame(
        () => {

            notification.style.transform =
                "translateX(0)";

        }
    );


    setTimeout(
        () => {

            notification.style.transform =
                "translateX(120%)";


            setTimeout(
                () => {

                    notification.remove();

                },
                400
            );

        },
        3000
    );

}


/* =========================================================
   SEARCH PRODUCTS
   ========================================================= */

function searchProducts(
    searchText
) {

    const query =
        String(searchText)
            .toLowerCase()
            .trim();


    const results =
        products.filter(
            product =>

                product.name
                    .toLowerCase()
                    .includes(query)

                ||

                product.category
                    .toLowerCase()
                    .includes(query)

                ||

                product.description
                    .toLowerCase()
                    .includes(query)
        );


    renderProductResults(
        results
    );

}


/* =========================================================
   RENDER SEARCH RESULTS
   ========================================================= */

function renderProductResults(
    results
) {

    const grid =
        document.getElementById(
            "productGrid"
        );


    if (!grid) return;


    grid.innerHTML = "";


    if (results.length === 0) {

        grid.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
                color:#aaa;
            ">

                <h3>
                    No products found
                </h3>

                <p>
                    Try another search.
                </p>

            </div>

        `;

        return;
    }


    results.forEach(
        product => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card reveal";


            card.innerHTML = `

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >

                <div class="card-body">

                    <small style="
                        color:#00d9ff;
                    ">
                        ${escapeHTML(product.category)}
                    </small>

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>

                    <p>
                        ${escapeHTML(product.description)}
                    </p>

                    <div class="price">
                        ₹${formatCurrency(product.price)}
                    </div>

                    <button
                        class="btn btn-primary"
                        style="width:100%"
                        onclick="
                            addToCart(
                                ${product.id}
                            )
                        "
                    >
                        🛒 Add to Cart
                    </button>

                </div>

            `;


            grid.appendChild(card);

        }
    );


    setupScrollReveal();

}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function filterByCategory(
    category
) {

    if (
        !category ||
        category === "all"
    ) {

        renderProducts();

        return;

    }


    const results =
        products.filter(
            product =>
                product.category
                    .toLowerCase() ===
                category
                    .toLowerCase()
        );


    renderProductResults(
        results
    );

}


/* =========================================================
   ADMIN - GET ALL ORDERS
   ========================================================= */

function getOrders() {

    return JSON.parse(
        localStorage.getItem(
            "siOrders"
        )
    ) || [];

}


/* =========================================================
   ADMIN - UPDATE ORDER
   ========================================================= */

function updateOrderStatus(
    orderId,
    status
) {

    const orders =
        getOrders();


    const order =
        orders.find(
            item =>
                item.orderId === orderId
        );


    if (!order) {

        return false;

    }


    order.status =
        status;


    localStorage.setItem(
        "siOrders",
        JSON.stringify(orders)
    );


    return true;

}


/* =========================================================
   ADMIN - DELETE ORDER
   ========================================================= */

function deleteOrder(
    orderId
) {

    let orders =
        getOrders();


    orders =
        orders.filter(
            order =>
                order.orderId !==
                orderId
        );


    localStorage.setItem(
        "siOrders",
        JSON.stringify(orders)
    );

}


/* =========================================================
   NUMBER FORMAT
   ========================================================= */

function formatCurrency(
    number
) {

    return Number(
        number || 0
    ).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits:
                2
        }
    );

}


/* =========================================================
   SECURITY HELPER
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const modal =
            document.getElementById(
                "loginModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeLogin();

        }

    }
);


/* =========================================================
   PUBLIC API
   Useful when connecting an admin dashboard
   ========================================================= */

window.SIDigital = {

    products,

    cart,

    addToCart,

    removeFromCart,

    changeQuantity,

    clearCart,

    createProduct,

    getProduct,

    updateProduct,

    deleteProduct,

    searchProducts,

    filterByCategory,

    getOrders,

    updateOrderStatus,

    deleteOrder,

    checkout,

    login,

    logout

};