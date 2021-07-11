const jwt=require("jsonwebtoken");
const User=require("../../models/User");

const sentjwttoClient=(user,res)=>{
    const token=user.generateJwtFromUser();
    const {JWT_COOKIE,NODE_ENV}=process.env;
    return res
    .status(200)
    .cookie("access_token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+parseInt(JWT_COOKIE)*100*60*10*60),//1 saaat*JWT_COOKIE
        secure:NODE_ENV=== true
    })
    
};
const isTokenIncluded=req=>{
    console.log("+++++++++"+req.cookies.access_token)
    return (
        req.cookies.access_token

    );
};
const getAccessTokenFromHeader=req=>{
    const authorization=req.cookies.access_token;
    console.log()
    return authorization;
}

const isUserAuth=(token)=>{
    if(token){
        jwt.verify(token,"gizlikelime",async(err,decoded)=>{
            if(err){
                 console.log(err) 
            }
            else{
                
                const user=await User.findById(decoded.id)
                console.log(user);
               
                return user
                
                
               
                
                
            }
           
        })
    }
}
module.exports={
    sentjwttoClient,
    isTokenIncluded,
    getAccessTokenFromHeader,
    isUserAuth

};