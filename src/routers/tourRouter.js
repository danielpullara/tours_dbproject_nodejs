const router = require('express').Router()

const { createTour, readTours, editTour, deleteTour, searchByCategory, searchById } = require("../controllers/tourController")
const { userTours } = require("../controllers/userController")

const { auth } = require("../controllers/authController")
const validateTour = require("../middleware/validateTour")

router
    .route("/:id")
    .get(auth, searchById)//single tour
    .put(auth, validateTour, editTour)
    .delete(auth, deleteTour)

router
    .route("/user")
    .get(auth, userTours)//Giver error

router
    .route("/")
    .post(auth, createTour)
    .get(auth, readTours)//list all tours
    .get(auth, searchByCategory)

module.exports = router