
require("dotenv").config()
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const { userTours } = require("./src/controllers/UserController")
const { auth, login, logout } = require("./src/controllers/authController")
const { readTours } = require("./src/controllers/tourController")
const { createCategory, readCategory } = require("./src/controllers/categoryController")
const { createReview, readReviews, deleteReview } = require('./src/controllers/reviewController')
const validateTour = require('./src/middleware/validateTour')

const express = require("express")
const app = express();
const router = express.Router();


mongoose.connect(process.env.DB_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("successfully connected to database")).catch(err => console.log(err, ))

app.use(bodyParser.urlencoded({ extended: false })); app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(router);

app.get("/", (req, res) => { res.status(200).json({ status: "ok", data: [] }) })

//Routers
const userRouter = require("./src/routers/userRouter")
const tourRouter = require("./src/routers/tourRouter")
router.use("/users", userRouter)
router.use("/tours", tourRouter)



router.post("/login", login);//no auth here!
router.get("/logout", auth, logout);


router.route("/tours/category")
    .post(createCategory)
    .get(readCategory)


router.route("/tours/:id/reviews")
    .post(auth, validateTour, createReview)
    .get(auth, readReviews)//all reviews for a single tour
    .delete(auth, deleteReview)


app.listen(process.env.PORT, () => {
    console.log("app is running on port ", process.env.PORT);
})