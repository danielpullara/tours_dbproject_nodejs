// const User = require ('../models/user')
const Review = require('../models/review')

exports.createReview = async function (req,res){
    // const { content, rating} = req.body
    try {
        const review = await Review.findOneAndUpdate(
            { user: req.user._id, tour: req.tour._id },
            {...req.body, user:req.user._id },
            {upsert:true, new: true, setDefaultsOnInsert:false});
    
        res.status(201).json({status:"Success", data:review})
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message })
    }
}

//read all reviews for a tour
exports.readReviews = async function (req, res) {
    try{
        const reviews = await Review.find({tour:req.params.id})
        //1st arg is the field, 2nd what to return in resx
        .populate("user", "id name")
        .populate("tour", "-guides -categories -organizer -createdAt -updatedAt")
        return res.status(200).json({status:"ok", data:reviews})
    } catch (err){
        console.log(err)
        res.status(500).json({status:"fail", error: err.message})
    }
}

//Delete single review
exports.deleteReview = async function (req,res){
    try{
        const deletedReview = await Review.findOneAndDelete({ tour: req.params.id, user:req.user.id})
        res.status(204).json({status:"Deleted", data:null})
    } catch (err) {
        res.status(500).json({status:"Failed", error:err.message})
    }
}