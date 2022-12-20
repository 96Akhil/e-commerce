const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Product = require("../models/productmodel");
const Cart = require("../models/cartModel");
var objectId = require("mongodb").ObjectId;

const securePassword = async function (password) {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadUser = async function (req, res, next) {
  try {
    let user = req.session.user;
    const userProducts = await Product.find({})
      .lean()
      .exec(function (err, productDisplay) {
        if (productDisplay) {
          res.render("user", { products: productDisplay, admin: false, user });
        }
      });
  } catch (error) {
    console.log(error.message);
  }
};

const userSignup = function (req, res) {
  try {
    res.render("user/usersignup");
  } catch (error) {
    console.log(error.message);
  }
};

const userSignupData = async function (req, res) {
  try {
    const emailCheck = req.body.email;

    const emailID = await User.findOne({ email: emailCheck });

    if (emailID) {
      res.render("user/usersignup", {
        message: "User already exists!",
      });
    } else {
      const Spassword = await securePassword(req.body.password);

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.phone,
        password: Spassword,
        is_admin: 0,
      });

      const userData = await user.save();

      if (userData) {
        res.render("user/usersignup", {
          message: "Registration is successfull!",
        });
      } else {
        res.render("user/usersignup", {
          message: "Registration is unsuccessfull!",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const verifyUser = async function (req, res) {
  try {
    function checkLogin(data) {
      return new Promise(async function (resolve, reject) {
        let loginStatus = false;
        let response = {};
        let user = await User.findOne({ email: data.email });
        if (user) {
          bcrypt.compare(data.password, user.password).then(function (status) {
            if (status) {
              response.user = user;
              response.status = true;
              resolve(response);
            } else {
              resolve({ status: false });
            }
          });
        } else {
          resolve({ status: false });
        }
      });
    }

    let userData = {
      email: req.body.email,
      password: req.body.password,
    };

    checkLogin(userData).then(function (response) {
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user = response.user;
        res.redirect("/");
      } else {
        res.render("user/userLogin", {
          usermessage: "Please check the login credentials",
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const userLogin = async function (req, res) {
  try {
    // res.render('user/userLogin');

    if (req.session.loggedIn) {
      console.log(req.session.loggedIn);
      res.redirect("/");
    } else {
      res.render("user/userLogin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const userLogout = async function (req, res) {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

const userCart = async function (req, res, next) {
  try {
    let data = req.session.user._id;

          await User.findOne({ _id: objectId(data) }).exec(async function (err, userData) {

        let userCart = await userData.populate("cart.items.productId");
        let cartItems = userCart.cart.items.map((item)=>{
          return item;
        })
        console.log(cartItems);
        console.log(typeof(cartItems))
        // console.log(typeof(userCart));
        // console.log(typeof(userCart.cart.items));
        // console.log(userCart.cart.items);
        res.render("user/cart",{cartItems} );
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

const productLoad = async function (req, res) {
  try {
    let user = req.session.user;
    let data = req.params.id;
    let loadProducts = await Product.find({ _id: objectId(data) })
      .lean()
      .exec(function (err, viewProducts) {
        if (viewProducts) {
          res.render("user/productView", { products: viewProducts, user });
        }
      });
  } catch (error) {
    console.log(error.message);
  }
};

const producttoCart = async function (req, res) {
  try {
    let data = req.params.id;
    let cartProducts = await Product.findOne({ _id: objectId(data) });
    let cartUpdate = await User.findById({ _id: req.session.user._id }).exec(
      async function (err, userData) {
        await userData.addToCart(cartProducts);
        res.redirect("/");
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadUser,
  userSignup,
  userSignupData,
  userLogin,
  verifyUser,
  userLogout,
  userCart,
  productLoad,
  producttoCart,
};
