const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config();
const cors = require("cors");

const authRoute = require("./routes/auth");

const app = express();
const url = process.env.MONGODB_URI;
app.use(cors()); // Enable CORS

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

  app.use("/auth",authRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}...`);
});
