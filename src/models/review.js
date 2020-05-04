const mongoose = require('mongoose')
const User = require('./user')
const Tour = require('./tour')

const schema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must have user associated with it"]
    },
    tour:{
        type: mongoose.Schema.ObjectId,
        ref:"Tour",
        // required:[true, "Review must contain tour ID"]

    },
    content: {
        type: String,
        required: [true,"review must have a montent"],
        minlength: 5
    },
    rating: {
        type: Number,
        required: [true, "Review needs a rating"],
        min:1,
        max:5
    }
},{
    timestamp: true,
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})

const Review = mongoose.model("Review", schema);
module.exports = Review