const express=require("express");
const cookieParser=require("cookie-parser");
const dotenv=require("dotenv");
const router=require("./routers/index")
const connectionDatabase=require("./helpers/database/connectionDatabase")
const path=require("path");
const bodyParser=require("body-parser");
const{getAccessToRoute}=require("./middlewares/authorization/auth");

const app=express();

// const http = require('http').Server(app);
// const io = require('socket.io')(http);

dotenv.config({
    path:"./config/env/config.env"
});
const port=process.env.PORT;
connectionDatabase();


app.set("view engine","ejs")


app.use(express.urlencoded({extended:true}))
//app.use(express.static(path.join(__dirname,"public")));

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
app.use(express.static('public'))

app.use(cookieParser());
app.use(express.json());

app.use("/",router);

// app.use(getAccessToRoute)



// app.get("/lives",(req,res)=>{
//     const user=req.user;
//     console.log(user)
//     // var activeUsers = new Set();
//     // io.on('connection', (socket) => {
        
//     //     console.log('a user connected');
       
//     //     socket.on("chat message", function (data) {
//     //         socket.broadcast.emit("chat message",data)
//     //         io.emit("chat message",{
//     //             data,
//     //             user:user.name
//     //         });
//     //     });
//     //     socket.emit("user",user.name)

//     //   });

//     res.render("live-videos",{
//         user,
//     })
// })

const server=app.listen(port, () => {
    console.log(`Listening app at http://localhost:${port}`)
})
const socket = require("socket.io");
const io = socket(server);
const activeUsers = new Set();

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("new user", function (data) {
    socket.userId = data.userName;
    socket.renk=data.renk
    activeUsers.add(data.userName);
    io.emit("new user", [...activeUsers]);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });

  socket.on("chat message", function (data) {
    io.emit("chat message", data);
  });
  
//   socket.on("typing", function (data) {
//     socket.broadcast.emit("typing", data);
//   });
});



