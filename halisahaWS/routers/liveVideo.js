const express=require("express");
const {liveVideo,liveVideo_post,liveVideos}=require("../controllers/liveVideo")
const{getAccessToRoute}=require("../middlewares/authorization/auth");
const videoUploads = require("../middlewares/libraries/videoUpload");


const router=express.Router();

router.get("/",getAccessToRoute,liveVideo)
router.post("/",[getAccessToRoute,videoUploads.single("video-upload")],liveVideo_post)

router.get("/live-videos",getAccessToRoute,liveVideos)


module.exports=router;