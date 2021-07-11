const cookieParser = require('cookie-parser');
const jwt=require("jsonwebtoken");
const User=require("../models/User");
const Halisaha=require("../models/Halisaha");
const {userControl}=require("../helpers/userControl/userControl")

const {isUserAuth}=require("../helpers/authorization/tokenHelpers")

const home=async(req,res,next)=>{
    console.log(req.query)
    const {JWT_SECRET_KEY}=process.env;
    const token=req.cookies.access_token
    console.log("tokeakkdfakfdkaksfdkasfd"+token)

    if(token){
        jwt.verify(token,"gizlikelime",async(err,decoded)=>{
            console.log(decoded)
            if(err){
                 console.log(err) 
            }
            else{
                let user=await User.findById(decoded.id)
              
                
                res.render("home",{
                    user:user,
                    
                })
                
            }
           
        })
    }
    else{
        const user=""
         res.render("home",{
            user,
           
        })
    }
  
    
    
    

   
      
    
    
};
module.exports={
     home
}