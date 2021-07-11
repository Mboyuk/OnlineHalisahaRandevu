const Message=require("../models/Message")
const User = require("../models/User")
const Halisaha = require("../models/Halisaha")
const Reklam=require("../models/ReklamYonetimi");
const admin_get=async(req,res,next)=>{
    const halisaha=await Halisaha.find();
    const users=await User.find();
    const user=await User.findById(req.user.id)
    res.render("admin",{
        users,
        halisaha,
        user
    })
}


const admin_post=(req,res,next)=>{
    res.render("admin")
}
const message_req_get=async(req,res,next)=>{
    let errors="";
    const user=await User.findById(req.user.id)
    const message=await Message.find();
    console.log(message)
    if(!message){
       
        res.render("admin_message",{
            message,
            errors:"mesaj yok",
            user,
        })     
    }
    else{
        
        res.render("admin_message",{
            message,
            errors,
            user
        })
    }

}
const message_req_post=(req,res,next)=>{
    
}
const user_control_get=async(req,res,next)=>{
    const {id}=req.params;
    console.log(id)
    const userm=await User.findById(id);
    console.log(userm);
    const user=await User.findById(req.user.id)
    res.render("admin_user_control",{
        userm,
        user
    })
}
const user_control_post=async(req,res,next)=>{
    const {id}=req.params;
    const role=req.body.role;
    console.log(role);
    console.log(id)
    const user=await User.findById(req.user.id)
   
    let userm= await User.findById(id);
    userm.role=role;
     userm= await userm.save();
    console.log(user) 
    res.render("admin_user_control",{
        userm,
        user
    })

}

const reklam=async(req,res,next)=>{

    var reklam=await Reklam.find();
    console.log(reklam)
    const user=await User.findById(req.user.id)

    res.render("reklamlar",{
        reklam,
        user
    })
}

const reklam_ekle=async(req,res,next)=>{

    const user=await User.findById(req.user.id)


    

    res.render("reklamlar",{
        reklam,
        user
    })
}

const reklam_city_get=async(req,res,next)=>{
    const user=await User.findById(req.user.id)
    var halisaha=await Halisaha.find()
    var reklam=await Reklam.findOne({sehir:req.params.sehir});
    console.log(reklam)
    if(!reklam){
        reklam={
            reklam_image:["default.jpg"],
            sehir:"karaman"
        };
        res.render("reklamEkle",{
            reklam,
            user,
            halisaha
        })
    }else{
        res.render("reklamEkle",{
            reklam,
            user,
            halisaha
        })
    }
    
   

}
const reklam_city_post=async(req,res,next)=>{
    const user=await User.findById(req.user.id)

    var reklam=await Reklam.findOne({sehir:req.params.sehir});

    var halisaham=await Halisaha.findById(req.body.halisaha_id);
    const halisaha=await Halisaha.find()

    console.log(req.body.halisaha_id)
    console.log(reklam)
    if(reklam){

        reklam.reklam_image.push(req.savedReklamImage);
        reklam.reklam_halisaha_id.push(req.body.halisaha_id);
        reklam.reklam_halisaha_name.push(halisaham.name);
        reklam.save();
        
    }else{
        reklam=await Reklam.create(
           
            {
                sehir:req.params.sehir,
                reklam_image:req.savedReklamImage,
                reklam_halisaha_id:req.body.halisaha_id,
                reklam_halisaha_name:halisaham.name
                
            }
        )
    }

    res.render("reklamEkle",{
        reklam,
        user,
        halisaha
    })
}
const imagedelete=async(req,res,next)=>{
    console.log("a---------------------------");
    console.log(req.body.sehir)
    console.log(req.body.fotosl)
    var halisaham=await Halisaha.findById(req.body.halisaha_id);
    const reklam=await Reklam.findOneAndUpdate(
        {sehir:req.body.sehir},
        {
            $pull:{
                reklam_image:req.body.fotosl,
                reklam_halisaha_id:req.body.halisaha_id,
                reklam_halisaha_name:halisaham.name


            }

        }

    )
    reklam.save()
    res.redirect(`/admin/reklam/${req.body.sehir}/ekle`)


}


module.exports={
    admin_get,
    admin_post,
    message_req_get,
    message_req_post,
    user_control_get,
    user_control_post,
    reklam,
    reklam_ekle,
    reklam_city_post,
    reklam_city_get,
    imagedelete

}