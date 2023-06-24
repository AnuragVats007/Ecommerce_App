const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

//Register a user...
exports.registerUser = catchAsyncErrors(async (req,res,next) => {
    const {name, email, password} = req.body;
    const user = await User.create({
        name, email, password, 
        avatar:{
            public_id: "this is a public id",
            url: "this is url",
        }
    });
    sendToken(user, 201 ,res);
});

//Login User...
exports.loginUser = catchAsyncErrors(async (req,res,next) => {
    const {email, password} = req.body;
    // checking if both info provided...
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200,res);
});

//Logout User...
exports.logout =  catchAsyncErrors(async (req,res,next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "Logged out",
    });
});

//Forgot password...
exports.forgotPassword = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    // get Reset Password Token...
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/password/reset/${resetToken}`;
    const message = `Your password reset token is:- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce password Recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500));
    }
});

// reset password
exports.resetPassword = catchAsyncErrors(async (req,res,next) => {
    // creating token hash...
    const resetPasswordToken = crypto.createHash("sha256").update(req.params,token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt:Date.now()},
    });

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has been expired",400));
    }

    if(req.body.password !== req.cody.confirmPassword){
        return next(new ErrorHandler("Password do not match",404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
});

//get User Details...
exports.getUserDetails = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});

// update user password...
exports.updatePassword = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Incorrect old password", 401));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password and confirm password do not match", 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});


// update user profile
exports.updateProfile = catchAsyncErrors(async (req,res,next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }
    // we'll add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,
    }); 
});

// Get all users... (admin)
exports.getAllUser = catchAsyncErrors(async (req,res,next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    })
});

// Get single user... (admin)
exports.getSingleUser = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        user,
    })
});


// update user role --admin
exports.updateRole = catchAsyncErrors(async (req,res,next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }
    // we'll add cloudinary later
    
    const user = await User.findByIdAndUpdate(req.params.id, newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
    }); 
});

// delete user profile  -- admin
exports.deleteUser = catchAsyncErrors(async (req,res,next) => {

    // we'll remove cloudinary later

    const user = await User.findById(req.user.id);
    if(!user){
        return next(new ErrorHandler(`User not found with id ${req.params.id}`, 404));
    }
    
    await User.findByIdAndRemove({_id: req.params.id});

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    }); 
});