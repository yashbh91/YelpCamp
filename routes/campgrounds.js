const express=require("express");
const router=express.Router();
const Campground=require("../modules/campground");
const Comment=require("../modules/comment");
const middleware=require("../middleware");
const passport=require("passport");
const localStrategy=require("passport-local");
const localPassportMongoose=require("passport-local-mongoose");

router.get("/",function(req,res)
	   {
	Campground.find({},(err,campgrounds)=>{
		if(err)
			console.log(err);
		else
			res.render("campgrounds/campgrounds",{campgrounds:campgrounds,currentUser:req.user});
	})
})

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
})
router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var price = req.body.price;
	var description=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var campGround = {name: name, price: price, image: image, description: description, author:author}
	Campground.create(campGround,(err,campGround)=>{
		if(err)
			console.log(err);
		else
			res.redirect("campgrounds");
	})
})
router.get("/:id",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err,campground)=>{
		if(err)
			console.log(err);
		else
			res.render("campgrounds/show",{campground:campground,currentUser:req.user});
		
	})
});

router.get("/:id/edit",checkOwnership,(req,res)=>
		  {
		Campground.findById(req.params.id,(err,campground)=>{
		if(err)
			res.redirect("back");
		else
			{
				res.render("campgrounds/edit",{campground:campground});
			}
		})
})

router.put("/:id",checkOwnership,(req,res)=>{
	var campground=req.body.campground;
	Campground.findByIdAndUpdate(req.params.id,campground,(err,campground)=>{
		if(err)
			res.redirect("/campgrounds");
		else
			{
				req.flash("success","Successfully edited campground");
				res.redirect("/campgrounds/"+req.params.id)}
	})
})

router.delete("/:id",checkOwnership,(req,res)=>{
		Campground.findByIdAndRemove(req.params.id,(err)=>{
		if(err)
			res.redirect("back");
		else
			{
			res.redirect("/campgrounds");
			}
		}
)})

function checkOwnership(req,res,next){
	if(req.isAuthenticated())
	{
		Campground.findById(req.params.id,(err,campground)=>{
		if(err){
			req.flash("error","Campground not found");
			res.redirect("/campgrounds");
		}
		else
			{
				if(campground.author.id.equals(req.user._id))
					next();
				else{
					req.flash("error","You are not permitted to do that");
					res.redirect("/campgrounds")
				}
			}
		}
	);
	}
	else{
		req.flash("error","You are not permitted to do that");
		res.redirect("back");
	}
};


module.exports=router;