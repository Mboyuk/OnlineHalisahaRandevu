const express=require("express");

const {register_get,register_post,login_get,login_post,logout,dashboard,edit_profile,edit_photo_get,edit_photo_post,forgotPassword,forgotPassword_get,resetPassword,resetpassword_get,verifyEmail,resetpassword_get_profile,resetpassword_post_profile,preTransactions,preTransactions_post}=require("../controllers/auth")
const {userControl}=require("../helpers/userControl/userControl")
const{getAccessToRoute}=require("../middlewares/authorization/auth");
const profileImageUpload = require("../middlewares/libraries/profilImageUpload");


const router=express.Router();

router.get("/register",register_get)
router.post("/register",register_post)
router.get("/login",login_get)
router.post("/login",login_post)
router.get("/logout",logout);
router.get("/edit-profile",getAccessToRoute,dashboard)
router.post("/edit-profile",getAccessToRoute,edit_profile)
router.get("/edit-photo",getAccessToRoute,edit_photo_get)
router.post("/edit-photo",[getAccessToRoute,profileImageUpload.single("profile_image")],edit_photo_post)

router.get("/pre-transactions",getAccessToRoute,preTransactions)
router.post("/pre-transactions",getAccessToRoute,preTransactions_post)

router.post("/forgotpassword",forgotPassword);
router.get("/forgotpassword",forgotPassword_get);
router.post("/resetpassword",resetPassword);
router.get("/resetpassword",resetpassword_get);
router.get("/verifyEmail",verifyEmail);
router.get("/reset-password",getAccessToRoute,resetpassword_get_profile);
router.post("/reset-password",getAccessToRoute,resetpassword_post_profile);



module.exports=router;