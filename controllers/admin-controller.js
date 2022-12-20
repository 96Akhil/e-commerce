const Product = require("../models/productmodel");
const Users = require("../models/userModel");
var objectId = require('mongodb').ObjectId;

const loadAdmin = function (req, res) {
  try {
    res.render("admin/adminHome", { admin: true });
  } catch (error) {
    console.log(error.message);
  }
};

const verifyAdmin = async function (req,res){
  try{
    const email = req.body.email;
    const password = req.body.password;

    const adminData = await Users.findOne({email:email});

    if(adminData){
      const passwordMatch = await bcrypt.compare(password,adminData.password);

      if(passwordMatch){
        if(adminData.is_admin === 0){
          res.render("admin",{loginmessage:"Not a valid user!"});
        }
        else{
          res.redirect("/admin/adminHome")
        }
      }
    }
  }
  catch(error){
    console.log(error.message);
  }
}

const addProducts = function (req, res) {
  try {
    res.render("admin/addproduct", { admin: true });
  } catch (error) {
    console.log(error.message);
  }
};

const productToDatabase = async function (req, res) {
  try {
    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      image: req.file.filename,
    });

    const productData = await product.save();

    if (productData) {
      res.render("admin/addproduct", {
        admin: true,
        successmessage: "Product has been added successfully!",
      });
    } else {
      res.render("admin/addproduct", {
        admin: true,
        successmessage: "Product hasn't been added",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadProducts = async function (req, res, next) {
  try {
    const productfind = await Product.find({})
      .lean()
      .exec((err, productData) => {
        if (productData) {
          console.log(productData);
          res.render("admin/products", { products: productData, admin: true });
        }
      });
  } catch (error) {
    console.log(error.message);
  }
};

const usersList = async function(req,res){

  try {
    const userFind = await Users.find({}).lean().exec(function(err,userData){
      if(userData){console.log(userData);
        res.render("admin/usersList",{users:userData,admin:true})
      }
    })
  } catch (error) {
    console.log(error.message);
  }

}

const productDelete = async function(req,res){

  try {

    function remove(data){
      return new Promise (function(resolve,reject){
        Product.deleteOne({_id:objectId(proId)}).then(function(response){
          resolve(response);
        })
      })
    }

    let proId = req.params.id;
    console.log(proId);

    remove(proId).then(function(response){
      res.redirect('/admin/products');
    })

  } catch (error) {
    console.log(error.message)
  }

}

const productEdit = async function(req,res){
  try {
    function getProductDetails(data){
      return new Promise(function(resolve,reject){
        Product.findOne({_id:objectId(data)}).lean().then(function(products){
          resolve(products);
        })
      })
    }

    let editProductData = await getProductDetails(req.params.id);
    res.render("admin/editProduct",{editProductData,admin: true});
    console.log(editProductData);
  } catch (error) {
    console.log(error.message);
  }
}

const updateProduct = async function(req,res){
  try {
   function updateProductData(proId,proDetails){
      return new Promise(function(resolve,reject){
        Product.updateOne({_id:objectId(proId)},{
          $set:{
            name:proDetails.name,
            category:proDetails.category,
            price:proDetails.price,
            quantity:proDetails.quantity,
            description:proDetails.description,
            image:proDetails.image
          }
        }).then(function(response){
          resolve()
        })
      }) 
    }

    updateProductData(req.params.id,req.body).then(
      function(){
        res.redirect("/admin/products");
      }
    )
  } catch (error) {
    console.log(error.message);
  }
}

const userEdit = async function(req,res){
  try {
    res.render("admin/editUser");
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  loadAdmin,
  loadProducts,
  addProducts,
  productToDatabase,
  usersList,
  productDelete,
  productEdit,
  updateProduct,
  userEdit
};
