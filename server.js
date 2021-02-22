if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
app.use(cors());
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database !"));

app.use(express.json());

// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     // res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

// const host = process.env.PORT ? '0.0.0.0' : 'localhost'
const PORT = process.env.PORT || 8081;

app.listen(PORT, "0.0.0.0", () =>
  console.log(process.env.PORT ? "Server Port" : "Local port")
);

app.get("/", (req, res) => {
  res.send("Hotels API. 2021...");
});

const hotelsRouter = require("./routes/hotels");
app.use("/hotels", hotelsRouter);

const loginRouter = require("./routes/users");
app.use("/users", loginRouter);

const BookingRouter = require("./routes/bookings");
app.use("/bookings", BookingRouter);
