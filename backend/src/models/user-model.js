import {Schema,model} from "mongoose";

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    profilePic:{
        url:String,
        publicId:String
    }
},{timestamps:true})

const User=model("User",userSchema);

export default User;