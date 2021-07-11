
const express=require("express")
const app=express();
const User=require("../models/User")
const http = require('http').Server(app);
const io = require('socket.io')(http);



const liveVideo=(req,res,next)=>{
    
   const user=req.user
   

    res.render('live-video',{
        video:user.video
    });
}
const liveVideo_post=async(req,res,next)=>{
    
   
    const user=await User.findByIdAndUpdate(req.user.id,{
        "video":req.savedVideo
    },
    {
        new:true,
        runValidators:true
    });

    res.render('live-video');
}
const liveVideos=async(req,res,next)=>{

    const user=await User.findById(req.user.id);
    console.log(user)
    // var activeUsers = new Set();
    // io.on('connection', (socket) => {
        
    //     console.log('a user connected');
       
    //     socket.on("chat message", function (data) {
    //         socket.broadcast.emit("chat message",data)
    //         io.emit("chat message",{
    //             data,
    //             user:user.name
    //         });
    //     });
    //     socket.emit("user",user.name)

    //   });

    res.render("live-videos",{
        user,
    })
}

module.exports={
    liveVideo,
    liveVideo_post,
    liveVideos
}