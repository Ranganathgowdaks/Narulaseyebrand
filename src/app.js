const express = require("express");
const hbs = require("hbs"); // Include Handlebars
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// Middlewarec
app.use(bodyParser.json());

// Set view engine to Handlebars
app.set("view engine", "hbs");

// Set views directory
app.set("views", path.join(__dirname, "../views"));

// Define routes
app.get("/", (req, res) => {
    res.render("home");
});

// MongoDB connection and server start
const PORT = process.env.PORT || 8000;
mongoose.connect("mongodb://localhost:27017/yourDatabaseName", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to database");

    app.listen(PORT, () => {
        console.log("Server is running on http://localhost:" + PORT);
    });
})
.catch((err) => {
    console.error("Database connection error:", err);
});
