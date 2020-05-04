const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.login = async function (req ,res){
    try{
        const { email, password} = req.body;
        if(!email && !password) throw new Error("Email and password are required")
        //authenticate user
        const user = await User.loginWithEmail(email, password);
        const token = await user.generateToken()
        
        res.status(200).json({status: "Success", data: {user, token}})
    } catch (err){
        console.log("login errors", err) // =>> to see the stack
        res.status(400).json({status:"fail here", message: err.message})
    }
}
exports.logout = async function (req, res){
    try{
        const token = req.headers.authorization.replace("Brearer ", "");
        req.user.tokens = req.user.tokens.filter(el => el !== token);
        await req.user.save();
        res.status(204).json({status:"Success", data:null})
    } catch (err) {
        res.status(401).json({ status: "fail", message: err.message });
    }
}
//authenticate with JWT
exports.auth = async( req, res , next )=> {
    //check if the token is there
    if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer"))
    return res.status(401).json({status: "fail", message: "Unauthorized for you"});
    
    //remove "Bearer"
    const token = req.headers.authorization.replace("Bearer ", "");
    try{
        //verify JWT. 2nd arg is secret key/signature
        const decoded = jwt.verify(token, process.env.SECRET)
        //find user with token
        const user = await User.findOne({_id: decoded.id, tokens: token})

        if(!user) throw new Error("Unauthorized")

        //attach user obj to req obj
        req.user = user;
    } catch (err){
        return res.status(401).json({status:"Fail", message: err.message})
    };
    next()
}