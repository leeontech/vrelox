const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Article = require('./models/Article');

const app = express();
connectDB();

// Middleware Engine Configuration
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'vrelox_secret_luxury_key',
    resave: false,
    saveUninitialized: false
}));

// Route Middlewares for Session Guarding
const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');
const isAdmin = (req, res, next) => (req.session.user && req.session.user.role === 'admin') ? next() : res.send('Access Denied: Admins Only');

// --- AUTHENTICATION ROUTES ---
app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, role });
        res.redirect('/login');
    } catch (err) { res.send("Error creating user profile."); }
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        return user.role === 'admin' ? res.redirect('/admin') : res.redirect('/magazine');
    }
    res.send("Invalid Email or Credentials.");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

// --- PANELS LOGIC ---

// 1. Customer Panel (Magazine view)
// After (Sahi Public Flow)
app.get('/magazine', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.render('magazine', { articles });
});

// 2. Admin Panel (Post Engine)
app.get('/admin', isAdmin, (req, res) => res.render('admin'));
app.post('/admin/post', isAdmin, async (req, res) => {
    try {
        const { title, category, description, imageUrl, readTime, isHero } = req.body;
        
        // If current post is marked as Hero, reset previous hero posts
        if(isHero === 'true') { await Article.updateMany({}, { isHero: false }); }

        await Article.create({ title, category, description, imageUrl, readTime, isHero: isHero === 'true' });
        res.redirect('/magazine');
    } catch (err) { res.send("Error saving article to production database."); }
});

// Default redirection fallback
app.get('*', (req, res) => res.redirect('/login'));

app.listen(3000, () => console.log('Vrelox System Active on http://localhost:3000'));
