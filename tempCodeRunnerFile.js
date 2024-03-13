const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.fmsqvre.mongodb.net/registrationFormDB`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

// Registration schema
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Model of registration schema 
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Registration.findOne({ email: email });

        if (existingUser) {
            // If user already exists, send an error response
            return res.redirect("/error");
        } else {
            // Create a new user if not already existing
            const user = new Registration({
                name,
                email,
                password
            });
            await user.save();
            return res.redirect("/success");
        }
    } catch (error) {
        console.log(error);
        return res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/error.html");
});

app.listen(port, () => {
    console.log("Server Is Started!!");
});
