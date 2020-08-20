const express=require('express');
const app=express();
const bodyParser=require("body-parser");
const methodOverride=require("method-override");
const passport=require("passport");
const localStrategy=require("passport-local");
const localPassportMongoose=require("passport-local-mongoose");
const mongoose = require('mongoose');
const flash=require("connect-flash");
const Campground=require("./modules/campground");
const Comment=require("./modules/comment");
const seedDB=require("./seeds");
const User=require("./modules/users");
// seedDB();

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

mongoose.set('useFindAndModify', false)

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(require("express-session")({
	secret:"Yash is great",
	resave:false,
	saveUninitialized:false
}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));

const commentRoutes=require("./routes/comments"),
	  campgroundsRoutes=require("./routes/campgrounds"),
	  authRoutes=require("./routes/index");

app.use(authRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000, function() { 
  console.log('YELP CAMP STARTED'); 
});