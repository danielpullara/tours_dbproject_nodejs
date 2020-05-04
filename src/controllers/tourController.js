const Tour = require('../models/tour')


exports.createTour = async function (req, res, ) {
    try{
        const tour = await Tour.create({ ...req.body, organizer: req.user._id })
        res.status(201).json({ status: "success", data: tour });
    } catch (err) {
        console.log(err)
        res.status(401).json({ status: "fail", message: err.message });
    };
};

// Update or create a tour. If Id excists tour will be updated, otherwise created
exports.editTour = async function (req,res){
    try{
        const tour = await Tour.findOneAndUpdate(req.params.id,
            { ...req.body, user:req.user._id},
            {upsert:true, new: true, serDefaultsOnInsert: false});
        res.status(201).json({ status: "success", data: tour });
    } catch (err){
        console.log(err)
        res.status(401).json({ status: "fail", message: err.message });
    }
}

//list all tours - GIVES ERROR
exports.readTours = async function (req, res) {
    try {
        const tours = await Tour.find()
        console.log("here",tours)
        res.json({ status: "success", data: tours });
    } catch (error) {
        res.status(400).json({ status: "failure", message: error.message });
    }
};
//Delete a tour
exports.deleteTour = async function (req, res){
    
    try {
        await Tour.findOneAndDelete(req.params.id)
        return res.status(204).json({ status: "Deleted", data: null })
    } catch (err) {
        return res.status(400).json({status:"Failed", message:err.message})
    }
}
//Search tours by category
exports.searchByCategory = async function (req,res){
    const { category } = req.body
    try{
        const toursPerCat = await Tour.find({ categories: category})
        res.status(200).json({ status: "Success", data: toursPerCat})
    } catch (err){
        res.status(500).json({status:"Fail", error:err.message})
    }
}

//Search tours by tourId
exports.searchById = async function(req,res){
    try{
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({ status: "Success", data: tour })
    } catch (err){
        res.status(500).json({ status: "Fail", error: err.message })
    }
}

//list tours based on User ID
exports.searchMyTours = async function (req, res) {
    try {
        const tours = await Tour.find({ organizer: req.user.id })
        console.log(req.user.id, "Nam nam")
        res.status(200).json({ status: "Success", data: tours })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "Failzz", error: err.message })
    }
}


