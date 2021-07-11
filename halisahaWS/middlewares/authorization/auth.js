const CustomError=require("../../helpers/error/CustomError");
const jwt=require("jsonwebtoken");
const {isTokenIncluded,getAccessTokenFromHeader}=require("../../helpers/authorization/tokenHelpers")
const asyncErrorWrapper=require("express-async-handler");
const User=require("../../models/User");


const getAccessToRoute=(req,res,next)=>{
    const {JWT_SECRET_KEY}=process.env;
    
    if(!isTokenIncluded(req)){
      res.redirect("/auth/login")
        
    }
    const accessToken=getAccessTokenFromHeader(req);
    jwt.verify(accessToken,JWT_SECRET_KEY,(err,decoded)=>{
        if(err){
            return next(new CustomError("you are not autheorizse to access this route",401));
            
        }
        req.user={
            id:decoded.id,
            name:decoded.name,
            email:decoded.email,
            
        }
        next();
    })
    

};
const getAdminAccess=asyncErrorWrapper( async(req,res,next)=>{
    const {id}=req.user;
    const user=await User.findById(id);

    if(user.role!="admin"){
        return next(new CustomError("onlu admin can acces yhis route ",403));

    }
    next();

});
const getManagerAccess=asyncErrorWrapper( async(req,res,next)=>{
    const {id}=req.user;
    const user=await User.findById(id);

    if(user.role!="manager"){
        return next(new CustomError("only manager can acces yhis route ",403));

    }
    next();

});
const getUserAccess=asyncErrorWrapper( async(req,res,next)=>{
    const {id}=req.user;
    const user=await User.findById(id);

    if(user.role!="user"){
        return next(new CustomError("only user can acces yhis route ",403));

    }
    next();

});
const getQuestionOwnerAccess=asyncErrorWrapper( async(req,res,next)=>{
    const userId=req.user.id;
    const questionId=req.params.id;

    const question=await Question.findById(questionId);
    if(question.user!=userId){
        return next(new CustomError("only owner can handle this operation",403));

    }
    next();

});
module.exports={
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getManagerAccess,
    getUserAccess
}