var express = require("express");
var router = express.Router();
var userController = require("../controllers/user-controller")
const auth = require('../middleware/auth');


router.get("/",userController.loadUser);

router.get("/signup",userController.userSignup);

router.post("/signup",userController.userSignupData);

router.get("/login",userController.userLogin);

router.post("/login",userController.verifyUser);

router.get("/logout",userController.userLogout);

router.get("/cart",auth.isLogin,userController.userCart);

router.get("/addtoCart/:id",userController.producttoCart);

router.get("/productView/:id",userController.productLoad);

/*here the defined router has been exported so it can be required and used in index.js
file*/
module.exports = router;
