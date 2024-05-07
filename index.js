// require('dotenv').config()
// const express = require("express");
// const app = express();
// const connectToMongodb = require('./db');
// const cors = require('cors')

// const port = process.env.PORT;

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Origin', 'https://crypto-tracker-frontend-indol.vercel.app');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     if (req.method === 'OPTIONS') {
//         res.sendStatus(200);
//     } else {
//         next();
//     }
// });

// try {
//     connectToMongodb();
//     app.use(cors({
//         origin: `https://crypto-tracker-frontend-indol.vercel.app`,
//         credentials: true
//     }))
//     app.use(express.json()) 
//     app.use("/api/user", require("./routes/auth"))
//     app.use("/api/watchlist", require("./routes/watchlist"))
//     app.listen(port, () => {
//         console.log("Connected to server")
//     })
// } catch (error) {
//     console.log(error);
// }

require('dotenv').config();
const express = require("express");
const app = express();
const connectToMongodb = require('./db');

const port = process.env.PORT;

// CORS middleware
function setCorsHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Origin', 'https://crypto-tracker-frontend-indol.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
}

app.use(setCorsHeaders);

try {
    connectToMongodb();
    app.use(express.json());
    app.use("/api/user", require("./routes/auth"));
    app.use("/api/watchlist", require("./routes/watchlist"));
    app.listen(port, () => {
        console.log("Connected to server");
    });
} catch (error) {
    console.log(error);
}
