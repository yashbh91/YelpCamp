const mongoose=require("mongoose");
const localPassportMongoose=require("passport-local-mongoose");

const userSchema=new mongoose.Schema({
	username:String,
	password:String
})

userSchema.plugin(localPassportMongoose);

module.exports=mongoose.model("User",userSchema);