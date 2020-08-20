const express=require("express");
const router=express.Router({mergeParams:true});
const Campground=require("../modules/campground");
const Comment=require("../modules/comment");
const middleware=require("../middleware");
const passport=require("passport");
const localStrategy=require("passport-local");
const localPassportMongoose=require("passport-local-mongoose");

router.get("/new",(req,res)=>{
	Campground.findById(req.params.id,(err,campground)=>{
		if(err)
			console.log(err);
		else
		{
			res.render("comments/new",{campground:campground,currentUser:req.user});
		}
	})
})

router.post("/",(req,res)=>{
	Campground.findById(req.params.id,(err,campground)=>{
		if(err)
		{
			console.log(err);
			res.redirect("/campgrounds")
		}
		else
		{
			Comment.create(req.body.comment,(err,comment)=>{
				if(err)
					req.flash("error","Something went wrong");
				else
					{
						comment.author.id=req.user._id;
						comment.author.username=req.user.username;
						comment.save();
						campground.comments.push(comment);
						campground.save();
						req.flash("success","Successfully added a coment");
						res.redirect("/campgrounds/"+campground._id);
					}
			})
		}
	})
})

router.get("/:comment_id/edit",checkCommentOwnership,(req,res)=>{
	Comment.findById(req.params.comment_id,(err,comment)=>{
		if(err)
			req.flash("error","Something went wrong");
		else
		{
			res.render("comments/edit",{campground_id:req.params.id,comment:comment});
		}
	})
})

router.put("/:comment_id",checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,comment)=>{
		if(err)
			req.flash("error","Something went wrong");
		else{
			req.flash("success","Successfully edited a coment");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

router.delete("/:comment_id",checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err)
			console.log(err);
		else{
			req.flash("success","Successfully deleted a coment");
			res.redirect("/campgrounds/"+req.params.id);
		}
		
			
	});

})

function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated())
	{
		Comment.findById(req.params.comment_id,(err,comment)=>{
		if(err)
			res.redirect("back");
		else
			{
				if(comment.author.id.equals(req.user._id))
					next();
				else{
					req.flash("error","You are not permitted to do that");
					res.redirect("back")
					}
			}
		})
	};
}

module.exports=router;