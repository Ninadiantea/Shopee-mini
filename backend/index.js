const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend'));

// Helper: load data
function loadDB() {
    return JSON.parse(fs.readFileSync('./backend/db.json', 'utf8'));
}

// Helper: save data
function saveDB(data) {
    fs.writeFileSync('./backend/db.json', JSON.stringify(data, null, 2));
}

// Get all products
app.get('/api/products', (req, res) => {
    const db = loadDB();
    res.json(db.products);
});

// Add product (simulasi penjual)
app.post('/api/products', (req, res) => {
    const db = loadDB();
    const { name, price, description } = req.body;
    const newProduct = {
        id: Date.now(),
        name,
        price,
        description
    };
    db.products.push(newProduct);
    saveDB(db);
    res.json({ success: true, product: newProduct });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const db = loadDB();
    const product = db.products.find(p => p.id == req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
});

// List cart items
app.get('/api/cart', (req, res) => {
    const db = loadDB();
    res.json(db.cart);
});

// Add to cart
app.post('/api/cart', (req, res) => {
    const db = loadDB();
    const { productId } = req.body;
    const product = db.products.find(p => p.id == productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    db.cart.push({ ...product });
    saveDB(db);
    res.json({ success: true });
});

// Checkout (kosongkan keranjang)
app.post('/api/checkout', (req, res) => {
    const db = loadDB();
    db.cart = [];
    saveDB(db);
    res.json({ success: true, message: "Checkout berhasil!" });
});

app.listen(PORT, () => {
    console.log(`Mini Shopee backend running: http://localhost:${PORT}`);
});
