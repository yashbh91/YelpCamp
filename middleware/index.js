const Campground=require("../modules/campground");
const Comment=require("../modules/comment");
const middlewareObj={};
middlewareObj.checkOwernership=function(req,res,next){
	if(req.isAuthenticated())
	{
		Campground.findById(req.params.id,(err,campground)=>{
		if(err)
			res.redirect("back");
		else
			{
				if(campground.author.id.equals(req.user._id))
					next();
				else(
					res.redirect("back")
				)
			}
		})
	};
};

middlewareObj.checkCommentOwernership=function(req,res,next){
	if(req.isAuthenticated())
	{
		Comment.findById(req.params.comment_id,(err,comment)=>{
		if(err)
			res.redirect("back");
		else
			{
				if(comment.author.id.equals(req.user._id))
					next();
				else(
					res.redirect("back")
				)
			}
		})
	};
}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated())
		return next();
	req.flash("error","Please Log In first");
	res.redirect("/login")
	
}
console.log(middlewareObj.checkOwernership);
module.exports=middlewareObj;
