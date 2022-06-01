const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");

dotenv.config();

app.use(express.json());

mongoose 
    .connect(process.env.MONGO_URL, {})   
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.log(err));

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.get('/', (req,res) => {
    res.send('Api running at port 3080');
});

app.listen(3080, () => {
    console.log("Backend server is running!");
});