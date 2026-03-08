
const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "https://i.pinimg.com/736x/c7/be/b4/c7beb487b2b54736cfcb842d02463724.jpg",
        set: (v) => v === '' ? "https://i.pinimg.com/736x/c7/be/b4/c7beb487b2b54736cfcb842d02463724.jpg" : v,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    }

});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;

