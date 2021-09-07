const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
var passport = require("passport");
const path = require("path");
// // const { static } = require("express")

const app = express();
app.use(morgan("dev"));

// it use for production
app.use(cors());

//boyd parser when submited
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require("./passport")(passport);

app.use(fileUpload());

// router
const postRouter = require("./routers/postRouter");
const commentRouter = require("./routers/commentRouter");
const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");

app.use(express.static("data/uploads"));

app.use("/api/user/", userRouter);

app.use("/api/post/", postRouter);
app.use("/api/post/single-post/", commentRouter);
app.use("/api/category/", categoryRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static('client/build'))
//     app.get('*', (req, res) =>  {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     })
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  mongoose.connect(
    `mongodb+srv://44447770:44447770@cluster0.ops0t.mongodb.net/blog`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("database connected");
    }
  );
});
