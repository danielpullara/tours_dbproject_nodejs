const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    country: {
        type: String,
        required: [true, "country name is required"],
        trim: true,
        uppercase: true
    }
})
const Category = mongoose.model("Category", categorySchema)
module.exports = Category