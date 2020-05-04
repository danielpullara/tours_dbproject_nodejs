const Category = require("../models/category");

const createCategory = async (req, res) => {
    try {
        const category = await Category.create({ country: req.body.country})
        return res.status(200).json({status:"Success", data: category})
    } catch (err){
        console.log(err) // =>> to see the stack
        return res.status(400).json({status: "Failed here", message: err.message})
    }
}

const readCategory = async ( req, res) => {
    try{
        const categories = await Category.find()
          
         return res.status(200).json({ status: "Success", data: categories })
    } catch (err) {
        return res.status(404).json({status: "Failed" , message: err.message})
    }
}



module.exports = {createCategory, readCategory}
