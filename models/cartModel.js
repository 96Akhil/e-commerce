const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    product:{
        type:Array,
        default:[]
    }
})

const Cart = mongoose.model("Cart",cartSchema);

module.exports = Cart;