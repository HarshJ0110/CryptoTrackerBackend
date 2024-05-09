// require('dotenv').config()
// const express = require("express");
// const app = express();
// const connectToMongodb = require('./db');
// const cors = require('cors')

// const port = process.env.PORT;

// connectToMongodb();


// app.use(cors(
//   origin: *
// ));

// app.use(express.json()) 
// app.use("/api/user", require("./routes/auth"))
// app.use("/api/watchlist", require("./routes/watchlist"))
// app.listen(port, () => {
//     console.log("Connected to server")
// })


require('dotenv').config();
const express = require("express");
const cors = require('cors');
const connectToMongodb = require('./db');
const authRoutes = require("./routes/auth");
const watchlistRoutes = require("./routes/watchlist");

const app = express();
const port = process.env.PORT || 3000; 

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToMongodb();

// Routes
app.use("/api/user", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Server initialization
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

