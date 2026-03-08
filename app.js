require("dotenv").config();

const express = require("express");
const app = express();
const port = 8080;

const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/Listing.js");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErr = require("./utils/ExpressErr.js");

const uri = process.env.MONGO_URI;

// DATABASE CONNECTION
async function main() {
    await mongoose.connect(uri);
}

main()
.then(() => {
    console.log("Database Connected");
})
.catch((err) => {
    console.log("Error while connecting to Database:", err);
});

// BASIC SETUP
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// INDEX ROUTE
app.get("/listings", async (req, res) => {
    const AllListing = await Listing.find({});
    res.render("listings/index.ejs", { AllListing });
});

// NEW LISTING ROUTE
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// SHOW ROUTE
app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

// EDIT ROUTE
app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

// UPDATE ROUTE
app.put("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
});

// DELETE ROUTE
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

// CREATE ROUTE
app.post(
    "/listings",
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

// ROOT ROUTE
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// 404 HANDLER
app.use((req, res, next) => {
    next(new ExpressErr(404, "Page Not Found!"));
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    let { statusCode = 500, msg = "Something went wrong" } = err;
    res.status(statusCode).send(msg);
});

// SERVER
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});