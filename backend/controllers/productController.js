const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require('../utils/apiFeatures');

//create product... admin

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
});

// get all products...
exports.getAllProducts = catchAsyncErrors(async (req,res) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount
    });
});

// get product details... single product
exports.getProductDetails = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product,
        productCount
    });
});

//updare product... admin
exports.updateProduct = catchAsyncErrors(async (req,res,next) => {
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        product
    });
});

// Delete product... admin
exports.deleteProduct = catchAsyncErrors(async (req,res) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
    // await product.remove();  //depricated...
    await Product.findByIdAndRemove({_id: req.params.id});

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    }); 
});

// Creater new review or update review...
exports.createProductReview = catchAsyncErrors(async (req,res,next) => {
    const {rating, comment, productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find((rev ) => (rev.user.toString()=== req.user._id.toString()));
    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev=>rev.user === req.user._id){
                rev.rating = rating,
                rev.comment = comment; 
            }
        });
    }
    else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach(rev=>{avg += rev.rating});
    product.rating = avg/product.numOfReviews;
    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
    });
});

//GEt all reviews of a product...
exports.getProductReviews = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// Delete review
exports.deleteProductReviews = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
    const reviews = product.reviews.filter((rev) => (rev.user.toString() !== req.query.id.toString()));
    // product.reviews = reviews;
    const numOfReviews = reviews.length;
    let avg = 0;
    product.reviews.forEach(rev=>{avg += rev.rating});
    let rating;
    if(numOfReviews>0)
    rating = avg/numOfReviews;
    else
    rating = 0;
    
    // await product.save({validateBeforeSave: false}); // this is also another way of updating things...
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        rating,
        numOfReviews,
    },
    {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});