const multer=require("multer");
const path=require("path");
const CustomError=require("../../helpers/error/CustomError");


const storage=multer.diskStorage({
    
    destination:function(req,file,cb){
        const rootDir=path.dirname(require.main.filename);
        cb(null,path.join(rootDir,"/public/reklamImage"));
    },
    filename:function(req,file,cb){
        const extension=file.mimetype.split("/")[1];
       
        console.log("---------------------------------------------------------------------------")
        const name=file.originalname.split(".")[0];
        console.log(name);
       
        
        req.savedReklamImage="reklam_image_"+req.params.sehir+"_"+req.body.isim+"."+extension;

        cb(null,req.savedReklamImage);
    }
});

const fileFilter=(req,file,cb)=>{
    let allowedMimeTypes=["image/jpg","image/gif","image/jpeg","image/png"];
    if(!allowedMimeTypes.includes(file.mimetype)){
        return cb(new CustomError("please provide a valid image file ",400),false);

    }
    return cb(null,true);
};
const reklamImageUploads=multer({storage,fileFilter});
module.exports=reklamImageUploads;