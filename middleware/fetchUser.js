const jwt = require('jsonwebtoken');
const User = require("../models/user")

const fetchUser = async (req,res,next) => {
    const token = req.header("token");
    console.log(token);
    if(token === null){
        res.status(401).json({error: "Please Authenticate using valid token token not present"})
    }
    try{
        const data = jwt.verify(token, process.env.JWT_Secret)
        req.user = await User.findById(data.user.id).select("-password");
        console.log(req.user);
        next();
    }catch{
        res.status(401).json({error: "Please Authenticate using valid token error"})
    }
}
module.exports = fetchUser
