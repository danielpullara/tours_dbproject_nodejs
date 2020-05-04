const Tour = require('../models/tour');

async function validateTour(req, res, next) {
   const tourId = req.params.id;
   try {
       const tour = await Tour.findById(tourId);
       if(!tour) return res.status(404).json({status:"fail", error:err.message})
       req.tour = tour
       next();
   } catch (err){
       res.status(500).json({status:"fail", error: err.message})
   }
}
module.exports = validateTour

// module.exports = async (req, res, next) => {
//     if (!req.params.tid || !await Tour.exists({ _id: req.params.tid }))
//         return res.status(404).json({ status: "Fail", message: "Tour not found" });
//     next()
// }