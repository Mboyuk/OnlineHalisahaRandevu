const express=require("express");

const {admin_get,admin_post,message_req_get,message_req_post,user_control_get,user_control_post,reklam,reklam_ekle,reklam_city_get,reklam_city_post,imagedelete}=require("../controllers/admin")
const reklamImageUploads = require("../middlewares/libraries/reklamImageUploads");
const{getAccessToRoute,getAdminAccess}=require("../middlewares/authorization/auth");
const router=express.Router();

router.get("/",[getAccessToRoute,getAdminAccess],admin_get);
router.post("/",[getAccessToRoute,getAdminAccess],admin_post)

router.get("/message",[getAccessToRoute,getAdminAccess],message_req_get);
router.post("/message",[getAccessToRoute,getAdminAccess],message_req_post)
router.get("/:id/user",[getAccessToRoute,getAdminAccess],user_control_get);
router.post("/:id/user",[getAccessToRoute,getAdminAccess],user_control_post);
router.get("/reklam",[getAccessToRoute,getAdminAccess],reklam)
router.post("/reklam",[getAccessToRoute,getAdminAccess],reklam_ekle)

router.get("/reklam/:sehir/ekle",[getAccessToRoute,getAdminAccess],reklam_city_get);
router.post("/reklam/:sehir/ekle",[getAccessToRoute,getAdminAccess,reklamImageUploads.single("reklam_image")],reklam_city_post);

router.post("/reklam/imagedelete/delete",[getAccessToRoute,getAdminAccess],imagedelete)
module.exports=router;