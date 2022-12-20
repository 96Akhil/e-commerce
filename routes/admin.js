var express = require("express");
var router = express.Router({mergeParams:true});
var adminController = require('../controllers/admin-controller');

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/product-image'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage:storage});


router.get("/",adminController.loadAdmin);

// router.post("/",adminController.verifyAdmin)

router.get("/products",adminController.loadProducts);

router.get('/addproduct',adminController.addProducts);

router.post('/addproduct',upload.single('image'), adminController.productToDatabase);

router.get("/usersList",adminController.usersList);

router.get("/deleteProduct/:id",adminController.productDelete);

router.get("/editProduct/:id",adminController.productEdit);

router.post("/editProduct/:id",upload.single('image'),adminController.updateProduct);

router.get("/editUser/:id",adminController.userEdit);

module.exports = router;
