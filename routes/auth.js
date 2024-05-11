const express = require("express");
const router = express.Router();
const User = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/sendEmail")
const fetchUser = require("../middleware/fetchUser");
const crypto = require("crypto");

router.post("/createuser", async (req, res) => {

    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "User with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id,
            }
        }
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        res.status(200).json({ sucess: true, authtoken });
    } catch (error) {
        res.status(500).json("Internal server error");
    }

})

router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Login with correct credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ error: "Login with correct credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        const name = user.name;
        res.status(200).json({ name, sucess: true, authtoken });

    } catch (error) {
        res.status(500).json(error);
    }

})

router.get("/getUser", fetchUser, async (req, res) => {

    try {
        const user = req.user
        if(!user){
            res.status(400).send("Login to access coins");
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

router.post("/password/forgot", async (req, res) => {

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            sucess: false,
            message: "Invalid email" })
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});
    const resetPasswordUrl = `https://crypto-tracker-frontend-indol.vercel.app/password/reset/${resetToken}`
    const message = `Your password reset token is:- \n\n ${resetPasswordUrl} \n\nif you have not requested this email then, please ignore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: `Crypto Tracker Password Recovery`,
            message,
        });
        res.status(200).json({
            sucess: true,
            message: `Password reset link sent to ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500).send("Internal server error");
    }
})


router.post('/password/reset', async (req, res) => {

    const {password, confirmPassword, token} = req.body;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Reset Password Token is invali or has been expired"
        })
    }
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password does not match"
        })
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user.password = secPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successfully"
    })
})

module.exports = router
