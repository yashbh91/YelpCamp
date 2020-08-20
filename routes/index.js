const express=require("express");
const router=express.Router();
const Campground=require("../modules/campground");
const Comment=require("../modules/comment");
const passport=require("passport");
const localStrategy=require("passport-local");
const localPassportMongoose=require("passport-local-mongoose");
const User=require("../modules/users");

router.get("/",function(req,res)
	   {
	res.render("landing");
})

router.get("/register",(req,res)=>{
	res.render("register");
});

router.post("/register",(req,res)=>{
	User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
		if(err)
			{
				req.flash("error",err.message);
				res.render("register");
			}
			passport.authenticate("local")(req,res,()=>{
				req.flash("success","Welcome to YelpCamp "+user.username);
				res.redirect("/campgrounds");
			});
	})
})

router.get("/login",(req,res)=>{
	res.render("login");
});

router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/register"
	})
		 ,(req,res)=>{});

router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Successfully Logged Out");
	res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login")
	
}
module.exports=router;