const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [2, "Atleast 2 characters required"],
    },
    email:{
        type:String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password:{
        type:String,
        required: [true, "Please enter your password"],
        minLength: [8, "Atleast 8 characters required"],
        select:false,
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user", // also try default admin one...
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// JWT token...
userSchema.methods.getJWTToken = function(){
    return  jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// compare password...
userSchema.methods.comparePassword = async function(enteredPassword){
    const res = await bcrypt.compare(enteredPassword, this.password);
    return res;
}

//generating reset password token...
userSchema.methods.getResetPasswordToken = function(){
    // Generating token...
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Hashing and addong to user schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15*60*1000;
    return resetToken;
}

module.exports = mongoose.model("User", userSchema);