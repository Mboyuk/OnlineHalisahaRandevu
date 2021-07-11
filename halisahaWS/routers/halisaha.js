const express=require("express");

const {halisaha,halisaha_get,halisaha_getir,halisaha_control_get,halisaha_control_post,halisaha_edit_get,halisaha_edit_post,halisahaArama,halisahaGoruntule,halisaha_istek_get,halisaha_istek_post,halisahaGoruntule_post,halisahaRezervasyon_get,halisahaRezervasyon_post,halisahaImageUpload,halisahaImageDelete,halisahaArama_post,videoUpload,halisaha_edit_message}=require("../controllers/halisaha")
const{getAccessToRoute,getManagerAccess,getUserAccess}=require("../middlewares/authorization/auth");
const halisahaImageUploads = require("../middlewares/libraries/halisahaImageUploads");
const halisahaVideoUpload = require("../middlewares/libraries/halisahaVideoUpload");
const router=express.Router();



router.get("/",halisaha);

router.post("/:city",halisaha_get)
router.get("/:city",halisaha_getir)

router.get("/:city/:id/:slug",halisahaGoruntule)

router.get("/:city/:id/:slug/:tarih/:saat/reservation",getAccessToRoute,halisahaRezervasyon_get)
router.post("/:city/:id/:slug/:tarih/:saat/reservation",getAccessToRoute,halisahaRezervasyon_post)

router.get("/:city/halisahaArama",halisahaArama)
router.post("/:city/halisahaArama",halisahaArama_post)

router.get("/register/control",[getAccessToRoute,getManagerAccess],halisaha_control_get);
router.post("/register/control",[getAccessToRoute,getManagerAccess],halisaha_control_post);

router.get("/register/req",[getAccessToRoute,getUserAccess],halisaha_istek_get);
router.post("/register/req",[getAccessToRoute,getUserAccess],halisaha_istek_post);

router.get("/:id/edit",[getAccessToRoute,getManagerAccess],halisaha_edit_get);
router.post("/:id/edit",[getAccessToRoute,getManagerAccess],halisaha_edit_post);
router.post("/:id/edit/message/edit-message",[getAccessToRoute,getManagerAccess],halisaha_edit_message);

router.post("/imageupload/upload",[getAccessToRoute,getManagerAccess,halisahaImageUploads.array("halisaha_image",5)],halisahaImageUpload)
router.post("/imagedelete/delete",getAccessToRoute,getManagerAccess,halisahaImageDelete)


router.post("/:id/edit/video/video-upload",[getAccessToRoute,getManagerAccess,halisahaVideoUpload.single("video-upload")],videoUpload);
module.exports=router;