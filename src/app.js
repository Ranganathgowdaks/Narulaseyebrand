const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require('connect-flash');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const signup = require("./Signup");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Connect flash middleware
app.use(flash());

// Global variables for flash messages (optional)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Set view engine to Handlebars
app.set("view engine", "hbs");

// Set views directory
app.set("views", path.join(__dirname, "../views"));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get("/", (req, res) => {
    res.render("home");
});

// Signup
app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create a new user document in MongoDB
        const newUser = new signup({ name, email, phone, password: hashedPassword });
        await newUser.save(); // Save the new user data

        // Set flash message and redirect to login page
        req.flash('success_msg', 'Signup successful! Please login.');
        res.redirect("login"); // Redirect to the login page
    } catch (err) {
        console.error("Error signing up:", err);
        req.flash('error_msg', 'Error signing up. Please try again.');
        res.redirect("/signup"); // Redirect back to signup page on error
    }
});

// Login
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body; // Corrected variable name

    try {
        // Find user by email in MongoDB
        const user = await signup.findOne({ email });

        if (!user) {
            // Handle case where user does not exist
            return res.render("login", { error: "No user with that email found." });
        }

        // Compare hashed password
        const passwordMatch = await bcrypt.compare(password, user.password); // Corrected variable name

        if (passwordMatch) {
            // Redirect to home page upon successful login
            return res.render("home", { name: user.name });
        } else {
            // Handle case where password does not match
            return res.render("login", { error: "Invalid password." });
        }
    } catch (err) {
        console.error("An error occurred during login:", err);
        return res.render("login", { error: "An error occurred. Please try again later." });
    }
});


// MongoDB connection and server start
const PORT = process.env.PORT || 8000;
mongoose.connect("mongodb://localhost:27017/narulas", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to database");

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.error("Database connection error:", err);
});
