const User = require ('../models/user')


exports.createUser = async function( req, res){
    const {name,email,password} = req.body;
    try{
        const user = await User.create({name, email, password})
        const token = await user.generateToken();
        return res.status(201).json({Status:"Success", data: { user , token }})
    } catch (err){
        console.log(err) // =>> to see the stack
        return res.status(400).json({ status: "Fail", message: err.message })
    }
}
exports.getUsers = async function (req, res){

    try{
        const userList = await User.find()
        return res.status(201).json({status: "Success", data: userList})
    } catch (err) {
        return res.status(404).json({status:"Success", error: err.message})
    }
}
// Update user info
exports.updateProfile = async function (req,res){
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { ...req.body, name: req.body.name, email: req.body.email },
            { new: true }
        )
        res.status(201).json({ status: "User updated", data: { user } })
    } catch (err){
        console.log("wooow", err)
        res.status(400).json({ status: "fail", message: err.message })
    }
}


// exports.readUserTours = async function (req, res, next){
//     try{
//         const userTours = await User.find({ _id: req.params.id})
//             .populate("tours", "-guides -categories ")
//             console.log("hmmm", userTours)
//         res.status(200).json({Status:"Success", data: userTours})
//     } catch (err){
//         res.status(500).json({ status: "Fail", error: "No tours to show" })
//     }
// }
//list all tours belonging to one user
exports.userTours = async function (req,res,next){
    try{
        const userTours = await User.find({ _id: req.body.organizer })
            .populate("tours", "-guides -categories ")
        console.log("hmmm", userTours)
        res.status(200).json({ Status: "Success", data: userTours })
    } catch (err) {
        res.status(500).json({ status: "Fail", error: "No tours to show" })
    }
}
