const multer=require("multer");
const path=require("path");
const CustomError=require("../../helpers/error/CustomError");


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        const rootDir=path.dirname(require.main.filename);
        cb(null,path.join(rootDir,"/public/videos"));
    },
    filename:function(req,file,cb){
        const extension=file.mimetype.split("/")[1];
        req.savedVideo="video_"+req.user.id+"."+extension;
        cb(null,req.savedVideo);
    }
});

const fileFilter=(req,file,cb)=>{
    let allowedMimeTypes=["video/mp4","image/gif","video/mkv","image/png"];
    if(!allowedMimeTypes.includes(file.mimetype)){
        return cb(new CustomError("please provide a valid image file ",400),false);

    }
    return cb(null,true);
};
const videoUploads=multer({storage,fileFilter});
module.exports=videoUploads;