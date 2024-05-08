const mongoose = require("mongoose");
const connectToMongodb = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}
module.exports = connectToMongodb;
