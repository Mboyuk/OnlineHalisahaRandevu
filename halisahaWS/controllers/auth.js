const express=require("express");
const app=express();
const asyncErrorWrapper=require("express-async-handler");
const User=require("../models/User");
const jwt=require("jsonwebtoken");
const bodyParser=require("body-parser");
const { sentjwttoClient}=require("../helpers/authorization/tokenHelpers");
const{getAccessToRoute}=require("../middlewares/authorization/auth");
const CustomError=require("../helpers/error/CustomError");
//app.use(bodyParser.urlencoded({extended:false}));
const sendEmail=require("../helpers/librires/sentEmail");
const querystring = require('querystring');
const {validateUserInput,comparePassword}=require("../helpers/input/inputHelpers");
const Halisaha=require("../models/Halisaha")





const register_get=(req,res,next)=>{
    
   res.render("register")  
   
};
const register_post=(req,res,next)=>{

    const {name,email,password,password2,surname,nickname}=req.body;

    let errors=[];
    if(!name || !email || !password || !password2 || !surname || !nickname){
        errors.push({msg:"Lütfen boş yerleri doldurunuz..."})
    }
    if(password!==password2){
        errors.push({msg:"Şifreler eşleşmiyor..."})
    }
    if(password.length<6){
        errors.push({msg:"Şifreniz 6 karakreden küçük olamaz..."})
    }
    if(errors.length>0){
        res.render("register",{

            errors,
            name,
            email,
            password,
            password2,
            

        })
    }
    else{ 
        User.findOne({email,email})
        .then(async(user)=>{
            if(user){
                errors.push({msg:"Email zaten kayıtlı..."});
                res.render("register",{
                    errors,
                    name,
                    email,
                    password,
                    password2,
                    user
                })
            }
            else{
                // const user=new User(req.body)
                // user.save()
                // .then((result)=>{
                //    // sentjwttoClient(user,res);
                //     res.redirect("login");
                // })
                // .catch((err)=>{
                //     console.log(err);
                // })
               

                const {name,email,password,surname,nickname}=req.body;
                const user= await User.create({
                    name:name,
                    email:email,
                    password:password,
                    surname:surname,
                    nickname:nickname
                    
                });
                const verifyEmailToken=user.getVerifyEmailTokenFromUser();
                console.log("verifyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
                console.log(verifyEmailToken)
                user.save();



                const verifyEmaildUrl=`http://localhost:5000/auth/verifyEmail?verifyEmailToken=${verifyEmailToken}`;

                const emailTemplate=`
                <h3>Email Onay</h3>
                <p>Bu <a href='${verifyEmaildUrl}' target='_blank'>link</a> Onay emailidir. Onaylamak için lütfen linke tıklayınız</p>

                
                `;
                try{
                    let errors=[];
                    await sendEmail({
                        from:process.env.SMTP_USER,
                        to:email,
                        subject:"Onay emaili",
                        html:emailTemplate
                    });
                    errors.push({msg:"Onay E-maili başarıyla gönderildi"})
                    res.render("login",{
                        errors
                    })
                //    return res.status(200).json({
                //         success:true,
                //         message:"token sent to your email"
                //     });
                }catch(err){
                    let errors=[];
                    user.verifyEmailToken=undefined;
                    
                    await user.save();
                    errors.push({msg:"Kurtarma emaili gönderilemedi"});
                    res.render("register",{
                        errors,
                    })
                }

               // res.redirect("login")
            }
        })
        
     
    }
      
    
    
 };
 
const login_get=(req,res,next)=>{

    res.render("login")
      
    
    
};
 
const login_post=async (req,res,next)=>{

    const {email,password}=req.body;
    let errors=[];
    if(!email || !password )
    {
        errors.push({msg:"Lütfen ilgili yerleri doldurunuz..."})
    }

    if(errors.length>0){
        res.render("login",{
            errors,         
            email,
            password,
           
        })
       
    }
    else{     
        let errors=[];
        try{
            // const user=await User.login(email,password)
            // console.log("userrrrrrrrrrrrrr"+user)
            // sentjwttoClient(user,res);
            const {email,password}=req.body;
            if(!validateUserInput(email,password)){
                return next(new CustomError("please check your inputs",400));
            }
            
            const user=await User.findOne({email}).select("+password");
            console.log("user firis"+user)
            if(!user){
                errors.push({msg:"Kullanıcı kayıtlı değil"})
                
            }

            if(!comparePassword(password,user.password)){
                //errors.push({msg:"E-posta veya şifre hatalı..."})
                
                throw  Error(" E-posta veya şifre hatalı...")
               
            }
            if(user.status!="Active"){
               throw Error("lütfen e postanızı onaylayın")
            }
           
                sentjwttoClient(user,res);
                res.redirect("/home")  
            
        }
        catch(e){
            console.log(e);
            errors.push({msg:e});
            res.render("login",{

                errors,
                email,
                password,
               
                
    
            })
      
        }
    }
      
    
    
};
const dashboard=async(req,res,next)=>{
    console.log("aliiiiiiiiiiii")
    console.log(req.user)
    let user=await User.findById(req.user.id)
    res.render("edit-profile",{
        user:user
    })
    console.log("asdfasdfasdf"+req)
}
const edit_profile=async(req,res,next)=>{
    const editInformation=req.body;
    

    const user=await User.findByIdAndUpdate(req.user.id,editInformation,{
        new :true,
        runValidators:true
    });
    
    res.render("edit-profile",{
        user:user
    })
    
}

const edit_photo_get=async(req,res,next)=>{
    let user=await User.findById(req.user.id)
    res.render("edit-photo",{
        user:user
    })

}
const edit_photo_post=async(req,res,next)=>{

    const user=await User.findByIdAndUpdate(req.user.id,{
        "profile_image":req.savedProfileImage
    },
    {
        new:true,
        runValidators:true
    });
    console.log("user photo")
    console.log(user)
    res.render("edit-photo",{
        user
    })
}

const preTransactions=async(req,res,next)=>{
    const dizi=[];
    const id=req.user.id;
    console.log(id)
    const user=await User.findById(id);
    const uzunluk= user.preTransactions.halisaha.length
    const oncekiRandevularim= user.preTransactions.halisaha;
    const yorumHakkiId=user.yorumHakki.halisahaYorumId;
    const yorumHakkiSayisi=user.yorumHakki.yorumHakkiSayisi;
    const tarih=user.preTransactions.tarih;
    const saat=user.preTransactions.saat;
    var halisaha=await Halisaha.find();
    var videoArray=[];
    var halisaham=[];
    var halisahaName=[];
    var halisahaSaat=[];
    var halisahaTarih=[];
    console.log("-----------------------------------------")
    oncekiRandevularim.forEach((element,index) => {
        halisaha.forEach((element2,index2)=>{
            if(element==element2.id){
                for(let i=0;i<element2.video.saat.length;i++){
                    if(saat[index]==element2.video.saat[i] && tarih[index]==element2.video.tarih[i]){
                        console.log("gosterildi")
                        videoArray.push(element2.video.video_upload[i]);
                        halisahaName.push(element2.name);
                        halisahaSaat.push(saat[index]);
                        halisahaTarih.push(tarih[index])
                        if(!halisaham.includes(element2)){
                            halisaham=halisaham+element2;
                        }
                       
                    }   
                }
               

            }
        })
    });
   
    console.log("------------------------------------------")
    console.log(videoArray)
    console.log(halisahaName);
    console.log(halisahaSaat);
    console.log(halisahaTarih)



    // const yorumlarim=await Halisaha.find({"comment.user":id});
    // console.log(yorumlarim)

    // oncekiRandevularim.forEach(element => {
    //     yorumlarim.forEach(element2=>{
    //         if(element2.id==element){
    //             dizi.push(true);
    //         }
    //         else{
    //             dizi.push(false)
    //         }
    //     })
      
       
      
    // });
    console.log(dizi)
    
    console.log(user.profile_image)
    console.log(oncekiRandevularim)
    res.render("pre-transactions",{
        user:user,
        uzunluk,
        dizi,
        yorumHakkiId,
        yorumHakkiSayisi,
        halisaham,
        videoArray,
        halisahaName,
        halisahaSaat,
        halisahaTarih

    })
}
const preTransactions_post=async(req,res,next)=>{
   
    const {puan,halisahaId,comment}=req.body;
    const point=Number(puan);
    console.log(req.body)
    const id=req.user.id;
    console.log(req.user)

    const user=await User.findById(id);
    const uzunluk= user.preTransactions.halisaha.length
    const halisaha=await Halisaha.findById(halisahaId);

   

    halisaha.comment.user.push(req.user.id);
    halisaha.comment.comContent.push(comment);
    halisaha.comment.profileImage.push(user.profile_image);
    halisaha.point.user.push(req.user.id);
    halisaha.point.point.push(point);


    halisaha.avgPoint=(((halisaha.avgPoint* (halisaha.point.user.length-1))+Number(puan))/ halisaha.point.user.length);
    halisaha.commentLength=halisaha.commentLength+1;
    
   


    const index= user.yorumHakki.halisahaYorumId.indexOf(halisahaId)
    var a= user.yorumHakki.yorumHakkiSayisi[index];
    console.log(a)
    

    //user.yorumHakki.yorumHakkiSayisi.index=(Number(a)+1);
   var userm=await User.findByIdAndUpdate(//AndUpdate
      
            req.user.id,
       
        {
            $set:{
                [`yorumHakki.yorumHakkiSayisi.${index}`]:(Number(a)-1)
            }
        },
        {
            new :true,
            runValidators:true

        }
    )
    console.log(userm)
   userm= await userm.save()
    const yorumHakkiId=userm.yorumHakki.halisahaYorumId;
    const yorumHakkiSayisi=userm.yorumHakki.yorumHakkiSayisi;
    console.log("*******************************************************************")
    console.log(yorumHakkiSayisi)
   
    await halisaha.save();
    console.log(halisaha)

    res.redirect("/auth/pre-transactions")
}

const forgotPassword=asyncErrorWrapper(async (req,res,next)=>{
    let errors=[];
    const resetEmail=req.body.email;
    const user= await User.findOne({email:resetEmail});
    if(!user){
       // return next(new CustomError("there is no user with that email",400));
        errors.push({msg:"Böyle bir kullanıcı yok"})
        res.render("forgotPassword",{
            errors
        })

    }
    const resetPasswordToken=user.getResetPasswordTokenFromUser();
   
    await user.save();

    const resetPasswordUrl=`http://localhost:5000/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate=`
    <h3>reset your password</h3>
    <p>this <a href='${resetPasswordUrl}' target='_blank'>link</a> will expire in 1 hour</p>

    
    `;
    try{
        let errors=[];
        await sendEmail({
            from:process.env.SMTP_USER,
            to:resetEmail,
            subject:"reset your email",
            html:emailTemplate
        });
        errors.push({msg:"Kurtarma E-maili başarıyla gönderildi"})
        res.render("login",{
            errors
        })
    //    return res.status(200).json({
    //         success:true,
    //         message:"token sent to your email"
    //     });
    }catch(err){
        let errors=[];
        user.resetPasswordToken=undefined;
        user.resetpasswordExpire=undefined;
        await user.save();
        errors.push({msg:"Kurtarma emaili gönderilemedi"});
        res.render("forgotPassword",{
            errors,
        })
    }

   
    

});
const forgotPassword_get=asyncErrorWrapper(async (req,res,next)=>{

   res.render("forgotPassword")
  
   
    

});

var resetPasswordToken=undefined;
const resetpassword_get=async(req,res,next)=>{
     resetPasswordToken=req.query.resetPasswordToken;
     
    console.log(req.query)
    res.render("resetpassword")
}
const resetPassword=asyncErrorWrapper(async (req,res,next)=>{
    //const{resetPasswordToken}=req.query;
    let errors=[];
    const {password}=req.body;
    if(!password){
        errors.push({msg:"Lütfen ilgili yerleri doldurunuz..."})
    }
    if(password.length<6){
        errors.push({msg:"Şifreniz 6 karakreden küçük olamaz..."})
    }
    if(errors.length>0){
        res.render("resetpassword",{

            errors,

        })
    }
    console.log("passaaaaa")
    console.log(resetPasswordToken);
    console.log(req.query);
    
    
    if(!resetPasswordToken){
        return next(new CustomError("please provide a valid token",400));
    }
    let user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()}
        
    });
    console.log("usererreer");
    console.log(user)
   
    if (!user) {
        errors.push({msg:"Şifre onaylama mailinin süresi dolmuştur. Lütfen Tekrar Mail İsteyin"})
        res.render("resetPassword",{
            errors
        })
        // return next(new CustomError("Invalid Token or Session Expired",400));
    }
   
    user.password= password;
    
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    user =await user.save();
    console.log("sonra user");
    res.redirect("login")
});
const verifyEmail=async(req,res,next)=>{
  
    const verifyEmailToken=req.query.verifyEmailToken;
    console.log("verify email token");
    console.log(verifyEmailToken)

    if(!verifyEmailToken){
        return next(new CustomError("please provide a valid token",400));
    }
    let user=await User.findOne({
        verifyEmailToken,
       
        
    });
    if(!user){
        return next(new CustomError("boyle bir user yok"))
    }
    user.status="Active";
    user.verifyEmailToken=undefined;
    user =await user.save();
    res.render("verifyEmail")
}

const resetpassword_get_profile=async(req,res,next)=>{
    console.log(req.user)
    const user=await User.findById(req.user.id)

    res.render("reset-password",{
        user
    })
}
const resetpassword_post_profile=async(req,res,next)=>{
    try {
        
        console.log(req.body)
        const {email,password,Ypassword,YpasswordO}=req.body;
        let errors=[];
        if(!email || !password || !Ypassword || !YpasswordO){
            errors.push({msg:"lütfen boş yerleri doldurunuz"})
            
        }
        if(Ypassword!==YpasswordO){
            errors.push({msg:"şifreler uyuşmuyor"})
        }
        if(Ypassword.length<6){
            errors.push({msg:"şifre uzunluğu min 6 karakter"})
        }
        if(password===Ypassword){
            errors.push({msg:"Yeni şifre Eski şifreyle aynı olamaz"})
        }
        if(errors.length>0){
            res.render("reset-password",{
                errors,
                user:req.user
            })
        }else{
            const user=await User.findOne({email}).select("+password");
        console.log("user firis"+user)

        if(!user){
            errors.push({msg:"Kullanıcı kayıtlı değil"})
                    
        }

        if(!comparePassword(password,user.password)){
                //errors.push({msg:"E-posta veya şifre hatalı..."})
                    
            throw  Error(" E-posta veya şifre hatalı...")
                
        }
        user.password=Ypassword;
        await user.save();
        res.redirect("edit-profile")
        }
        



    } catch (e) {
        let errors=[];
        errors.push({msg:e});
            res.render("reset-password",{

                errors,
                user:req.user
                
                
    
            })
        
    }
    

            

}



const logout=(req,res,next)=>{
    
    res.cookie("access_token","",{maxAge:1})
   
    
    res.redirect("/home");
}

module.exports={
    register_get,
    register_post,
    login_get,
    login_post,

    logout,
    dashboard,
    edit_profile,
    edit_photo_get,
    edit_photo_post,
    forgotPassword,
    resetPassword,
    forgotPassword_get,
    resetpassword_get,
    verifyEmail,
    resetpassword_get_profile,
    resetpassword_post_profile,
    preTransactions,
    preTransactions_post
    
}