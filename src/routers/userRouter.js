const router = require('express').Router()
const { auth } = require("../controllers/authController")

const { createUser, getUsers, updateProfile } = require("../controllers/UserController")

router
    .route("/me")
    .put(auth, updateProfile)
    //+ readProfile here

router
    .route("/:id")
    // + readUser here

router
    .route("/")
    .post(createUser)//register user
    .get(auth, getUsers)// all users

module.exports = router