require('dotenv').config()
const express = require("express");
const app = express();
const connectToMongodb = require('./db');
const cors = require('cors')

const port = process.env.PORT;


connectToMongodb();
app.use(cors());


app.use(express.json()) 
app.use("/api/user", require("./routes/auth"))
app.use("/api/watchlist", require("./routes/watchlist"))
app.listen(port, () => {
    console.log("Connected to server")
})



