axios.defaults.baseURL = server

let session = null
window.onload = async () => {
    fetchProducts()
    session = await checkAuth()
    console.log(session)

    const accountMenuUi = session ? withLogin() : withoutLogin()
    const accountMenu = document.getElementById("account-menu")
    accountMenu.innerHTML = accountMenuUi
}

const withoutLogin = () => {
    return (`
        <div class="flex gap-12 items-center">
            <a href="./login.html">Login</a>
            <a href="./signup.html" class="bg-gradient-to-r from-cyan-500 to-blue-500 rounded px-12 py-3 text-white font-semibold">Register Now</a>
        </div> 
    `)
}

const adminMenu = () => {
    return (`
    <a href="./admin/" class="flex items-center gap-2 py-2 px-3 hover:bg-gray-100">
            <i class="ri-shopping-cart-line"></i>
            Products
        </a>
        <a href="./admin/" class="flex items-center gap-2 py-2 px-3 hover:bg-gray-100">
            <i class="ri-group-2-line"></i>
            Orders
        </a>
        <a href="./admin/" class="flex items-center gap-2 py-2 px-3 hover:bg-gray-100">
            <i class="ri-money-rupee-circle-line"></i>
            Payments
        </a>
        <a href="./admin/" class="flex items-center gap-2 py-2 px-3 hover:bg-gray-100">
            <i class="ri-user-line"></i>
            Customers
        </a>
        <a class="flex items-center gap-2 py-2 px-3 hover:bg-gray-100" onclick="logout()">
            <i class="ri-logout-circle-r-line"></i>
            Logout
        </a>     
    `)
}

const userMenu = () => {
    return (`
        <a href="./cart.html" class="flex items-center gap-2 py-2 px-3 hover:bg-gray-100">
            <i class="ri-shopping-cart-line"></i>
            Cart
        </a>
        <a href="./order.html" class="flex items-center gap-2 py-2 px-3 hover:bg-gray-100">
            <i class="ri-user-line"></i>
            Orders
        </a>
        <a class="flex items-center gap-2 py-2 px-3 hover:bg-gray-100" onclick="logout()">
            <i class="ri-logout-circle-r-line"></i>
            Logout
        </a>        
    `)
}

const loadApp = () => {
    if (session.role === "admin")
        return adminMenu()

    if (session.role === "user")
        return userMenu()

    // logout()
}

const withLogin = () => {
    return (`
    <div class="relative">
        <button class="flex gap-2 items-center" onclick="toggleUserMenu()">
            <img src="./images/pic.jpg" class="w-8 h-8 rounded-full" />
            <h1 class="font-medium capitalize">${session.fullname}</h1>
        </button>

        <div class="px-2 py-4 w-[150px] shadow-lg rounded absolute top-12 right-0 bg-white hidden" id="account-drop-menu">
          ${loadApp()}
        </div>
    </div>    
    `)
}

const fetchProducts = async () => {
    try {
        const productContainer = document.getElementById("products-container")
        const productNotFound = document.getElementById("product-not-found")
        const { data } = await axios.get("/product")

        // Product not available
        if (data.length === 0)
            return productNotFound.style.display = "flex"

        // Product available
        for (let product of data) {
            console.log(product)
            const ui = `
                <div class="shadow-lg bg-white">
                <img class="w-full h-[220px] object-cover" src="${product.thumbnail ? `${server}/${product.thumbnail}` : './images/products/product-avt.png'}" />
                <div class="p-4">
                    <h1 class="text-lg font-semibold capitalize">${product.title}</h1>
                    <button class="font-bold text-rose-600 text-sm capitalize">${product.brand}</button>
                    <div class="flex gap-2 mt-1">
                        <h1 class="text-md font-bold">₹${product.price - (product.price * product.discount) / 100}</h1>
                        <del>₹${product.price}</del>
                        <label class="text-gray-600">(${product.discount}% OFF)</label>
                    </div>
                    <div class="flex items-center gap-3 mt-3">
                        <button class="bg-rose-500 text-white font-semibold px-4 py-2 rounded" onclick="buyNow(${product.price},'${product.title}','${product._id}',${product.discount})">
                            Checkout
                        </button>
                        <button onclick="addToCart('${product._id}')" class="bg-green-500 text-white font-semibold px-4 py-2 rounded">
                            <i class="ri-shopping-cart-line mr-2"></i>
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
            `

            productContainer.innerHTML += ui
        }
    }
    catch (err) {

    }
}

// buy

const buyNow = async (price, title, id, discount) => {

    try {
        const session = localStorage.getItem('auth')
        const options = {
            headers: {
                Authorization: `Bearer ${session}`
            }
        }
        const { data } = await axios.post('/checkout', { productId: id }, options)
        window.location.href = `./checkout.html?token=${data.token}`
    }
    catch (err) {
        localStorage.clear()
        window.location.href = "./login.html"
    }


    // try {
    //     const netPrice = price - (price * discount) / 100
    //     const { data } = await axios.post('/razorpay/order', { amount: netPrice })
    //     console.log(data)
    //     const Razor = new Razorpay({ // Razorpay from index.html razorpay cdn
    //         key: "rzp_test_jlUS13dW6LgToR",
    //         amount: data.amount,
    //         order_id: data.orderId,
    //         name: "wap institute",
    //         description: title,
    //         image: "https://example.com/your_logo",
    //         prefill: {
    //             name: 'jugal kishore sahu',
    //             email: 'jugalasahu@gmail.com',
    //             contact: '7973841779'
    //         },
    //         handler: function (response) {
    //             console.log(response)
    //         },
    //         notes: {
    //             user: '666bafab87c3d3d3c61d1f5f',
    //             product: id,
    //             price: price,
    //             discount: discount
    //         }
    //     })
    //     Razor.open()

    //     Razor.on("payment.failed", function (response) {
    //         console.log(response)
    //     })
    // }
    // catch (err) {
    //     console.log(err)
    // }
}

// add to cart

const addToCart = async (id) => {
    try {
        const authToken = localStorage.getItem('auth')
        const options = {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        }
        await axios.post('/cart', { product: id }, options)
        new Swal({
            icon: 'success',
            title: 'Product Added !'
        })
    }
    catch (err) {
        new Swal({
            icon: 'error',
            title: 'Failed !',
            text: err.message
        })
    }
}

const toggleUserMenu = () => {
    const menu = document.getElementById("account-drop-menu")
    if (menu.className.indexOf("hidden") !== -1) {
        menu.classList.remove("hidden")
    }
    else {
        menu.classList.add("hidden")
    }
}

// logout

const logout = () => {
    localStorage.clear()
    window.location.href = "./"
}

