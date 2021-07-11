const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const MessageSchema=new Schema({
    name:{
        type:String
    },
    email:{
        type:String,
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    content:{
        type:String
    }
   


   

})

module.exports=mongoose.model("Message",MessageSchema);