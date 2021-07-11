const express=require("express");
const {home}=require("../controllers/home")
const{getAccessToRoute}=require("../middlewares/authorization/auth");



const router=express.Router();

router.get("/",home)

module.exports=router;