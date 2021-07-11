const multer=require("multer");
const path=require("path");
const CustomError=require("../../helpers/error/CustomError");


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        const rootDir=path.dirname(require.main.filename);
        cb(null,path.join(rootDir,"/public/halisahaVideo"));
    },
    filename:function(req,file,cb){
        const extension=file.mimetype.split("/")[1];
        const name=file.originalname.split(".")[0];
        req.savedHalisahaVideo="video_"+name+"."+extension;
        cb(null,req.savedHalisahaVideo);
    }
});

const fileFilter=(req,file,cb)=>{
    let allowedMimeTypes=["video/mp4","image/gif","video/mkv","image/png"];
    if(!allowedMimeTypes.includes(file.mimetype)){
        return cb(new CustomError("please provide a valid image file ",400),false);

    }
    return cb(null,true);
};
const halisahaVideoUploads=multer({storage,fileFilter});
module.exports=halisahaVideoUploads;