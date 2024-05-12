const jwt = require('jsonwebtoken');
const User = require("../models/user")

const fetchUser = async (req,res,next) => {
    const token = req.header("token");
    if(!token){
        res.status(401).json({error: "Please Authenticate using valid token"})
    }
    try{
        console.log("in try");
        const data = await jwt.verify(token, process.env.JWT_Secret || "REGDFSH64GERGERGF")
        req.user = await User.findById(data.user.id).select("-password");
        console.log("user : " ,req.user);
        next();
    }catch{
        res.status(401).json({error: "Please Authenticate using valid token"})
    }
}
module.exports = fetchUser
