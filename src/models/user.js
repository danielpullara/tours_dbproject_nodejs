const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User must have a name"],
        trim: true,
        minLength: 3,
    },
    email: {
        type: String,
        required: [true, "User must have an email"],
        trim: true,
        // unique: true,
        lowercase: true,
        //check if the user email is valid email
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("Invalid email address");
            }
        }
    },
    password: {
        type: String,
        required: [true, "User must have a password"]
    },
    tokens: [{
        type: String
    }] // array of tokens
}, {
    // add createdAt and updatedAt from mongoose
    timestamps: true,
    toJSON: { virtuals: true },//data which are not stored directly in our database(e.g. firstNam+lastName)
    toObject: { virtuals: true }//raw object from an instance of a class (model) without additional keys
})
//modify the response here.
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.__v;//tracks how many times document has been changed
    delete userObject.createdAt;
    delete userObject.updatedAt;
    
    return userObject;
}

const saltRounds = 10;//hash algorythm complexity

//encrypt password before storing it
userSchema.pre("save", async function (next){
    //make sure that password field is modified (or created). If not, skip
    if (!this.isModified("password")) return next();
    //hash the password
    this.password = await bcrypt.hash(this.password, saltRounds);
    next()
});

//Compare the passwords for log-in. we don't need access to the data stored in user object (which is this), we can use ES6 arrow function:
userSchema.statics.loginWithEmail = async (email, password) =>{
    //find user by email
    const user = await User.findOne({email: email})
    console.log(user)
    if(!user){
        throw new Error ("Unable to login")
    };
    //compare the password
    const match = await bcrypt.compare(password.toString(), user.password);
    if(!match){
        throw new Error ("Unable to login")
    };
    return user
}

//Issue a JWT token on successful login
userSchema.methods.generateToken = async function(){
    
    const user = this;
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {expiresIn:'7d'});
    //save in the db
    user.tokens.push(token);
    await user.save();
    return token;
};

userSchema.virtual('tours', {
    ref: "Tour",
    localField: "_id",
    foreignField: "organizer",//where User appears in Tour
    // count: true
});


const User = mongoose.model("User", userSchema)
module.exports = User