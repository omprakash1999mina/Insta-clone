const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// const session = require("express-session");
const cookieSession = require("cookie-session")
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
dotenv.config();

const routes = require("./routes");
const db_url = process.env.DB_URL;
const PORT = process.env.PORT || 5000;
const passport = require("passport");
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys:["HeyHowareusjfcytgn"],
  httpOnly:true
}))
// app.use(session({ secret: "thisismyfirstinstagramcloneapp" }));
require("./controllers/auth/oAuth");

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", routes);

mongoose
  .connect(db_url)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
    // console.log("first");
  });

app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});
