const mongoose = require("mongoose");
const {Schema} = mongoose;
const crypto = require("crypto");

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

userSchema.methods.getResetPasswordToken = function(){

    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;

}

module.exports = mongoose.model('user',userSchema);