const jwt=require("jsonwebtoken");
const User=require("../../models/User");

const userControl=(req,res,next)=>{
    const token=req.cookies.access_token
    if(token){
        jwt.verify(token,"gizlikelime",async (err,decodedToken)=>{
            if(err){
                console.log(err)
               // res.locals.userm=null
               return Error;
            }
            else{
                console.log(decodedToken)
                let user=await User.findById(decodedToken.id)
                console.log("yyyssserrr"+user)
                return next(user)
            }
        })
    }
    else{
        return next(new Error("asdfasfd")) ;
    }
    
}
module.exports={
    userControl
}

