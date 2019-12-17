const express = require('express');
const app = express();
const mongoose = require("mongoose");

const User = require("./models/User")
app.set("view engine", "pug");
app.set("views", "views")
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("error",function(e){console.error(e);});


app.get('/', async (req, res) => {
  const users = await User.find();
  res.render("index", { users})
});

app.get('/register', async (req, res) => {
  const users = await User.find();
  res.render("register", { users})
});

app.post('/register', async (req, res, next) => {
  const data ={
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  try {
    const user = new User(data);
    await user.save();
  } catch(e) {
    return next(e)
  }
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login")
});

app.post("/login", async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body.email, req.body.password);
    if (user) {
      return res.redirect("/");
    }else {
      res.redirect("/login")
    }
  } catch (e) {
    return next(e)
  }
});

app.get("/logout", (req, res) => {
  res.session = null;
  res.clearCookie("session");
  res.clearCookie("session.sig");
  res.redirect("/login");
});

app.listen(3000, () => console.log('Listening on port 3000!'));
