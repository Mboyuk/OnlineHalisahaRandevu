const express=require("express");

const auth=require("./auth");
const home=require("./home");
const halisaha=require("./halisaha");
const admin=require("./admin");
const liveVideo=require("./liveVideo");

const router=express.Router();


router.use("/auth",auth);
router.use("/home",home);
router.use("/halisaha",halisaha)
router.use("/admin",admin)
router.use("/live",liveVideo)



module.exports=router;