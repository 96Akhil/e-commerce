const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Number,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice:{
        type:Number
    },
  },
});

userSchema.methods.addToCart = function (product) {
  let cart = this.cart;

  if (cart.items.length === 0) {
    cart.items.push({ productId: product._id, quantity: 1 });
    cart.totalPrice = product.price;
  } else {
    const isExisting = cart.items.findIndex(function (objInItems) {
      return (
        new String(objInItems.productId).trim() ==
        new String(product._id).trim()
      );
    });

    if (isExisting == -1) {

        cart.items.push({ productId: product._id, quantity: 1 });
        cart.totalPrice = cart.totalPrice + product.price;
     
    } else {

        exisitingProductInCart = cart.items[isExisting];
        exisitingProductInCart.quantity += 1;
        cart.totalPrice = cart.totalPrice + product.price;
        // cart.totalPrice += product.price;
      
    }
  }
  return this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
