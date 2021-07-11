const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const crypto=require("crypto");
const jwt=require("jsonwebtoken");


const Schema=mongoose.Schema;

const UserSchema=new Schema({

    name:{
        type:String,
        required:[true,"isminizi giriniz"],
        
    },
    surname:{
        type:String,
        required:[true,"soyisim giriniz"],
    },
    nickname:{
        type:String,
        required:[true,"kullanıcı adı giriniz"],
    },
    role:{
        type:String,
        default:"user",
        enum:["user","manager","admin"]
    },

    password:{
        type:String,
        required:[true,"sifre giriniz"],
        select : false,
        minlength : 6,
    },
    email:{
        type:String,
        required:true
    },
    profile_image : {
        type : String,
        default : "default.jpg"
    },
    video:{
        type : String,
        default : "default.mp4"
    },
    resetPasswordToken : {
        type:String
    },
    resetPasswordExpire:{
        type:Date
    },
    status: {
        type: String, 
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    verifyEmailToken:{
        type:String
    },
    preTransactions:{
        halisaha:[{
              
            type:mongoose.Schema.ObjectId,
            ref:"Halisaha",
        }],
        name:[{
            type:String
        }],
        saat:[{
            type:String
        }],
        tarih:[{
            type:String
        }],
        createAt:[{
            type:Date
        }]
    },
    yorumHakki:{
        halisahaYorumId:[{
            type:mongoose.Schema.ObjectId,
            ref:"Halisaha"
        }],
        yorumHakkiSayisi:[{
            type:Number,

        }]
    },
  





   

})

// userSchema.statics.login=async function(email,password){
//     const user=await this.findOne({email})
//     //console.log(user+"seeeeeeeeeeeeeeee")
//     // console.log(user+"kakakaka");
//     if(user){
//         // console.log("kullanici var");
//         console.log("kullanici var");
//         const auth=await bcrypt.compare(password,user.password);
//         console.log(auth);
//         if(auth){
//             // console.log("43034sdjkfjsdjf")
//             return user
//         }
//         else{
//             throw Error("E-posta veya parola hatalı... Lütfen kontrol edip tekrar deneyiniz...");
//         }
//     }
//     else{
//         throw Error("Kullanıcı kayıtlı değil");
//     }

// }
UserSchema.methods.generateJwtFromUser=function(){
    const {JWT_SECRET_KEY,JWT_EXPIRE}=process.env;
    const payload={
        
        id:this.id,
        name:this.name,
        email:this.email,
        
    }
    const token=jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn:JWT_EXPIRE
    });
    console.log("------------------"+token)
    return token;
};

UserSchema.methods.getResetPasswordTokenFromUser=function(){
    const randomHexString=crypto.randomBytes(15).toString("hex");

    const {RESET_PASSWORD_EXPIRE}=process.env;
    const resetPasswordToken=crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");
    this.resetPasswordToken=resetPasswordToken;
    this.resetPasswordExpire=Date.now()+360000000;
    console.log("User daye"+Date.now());
    console.log("User reset p expire"+this.resetPasswordExpire);
    return resetPasswordToken;

}
UserSchema.methods.getVerifyEmailTokenFromUser=function(){
    const randomHexString=crypto.randomBytes(15).toString("hex");

    
    const verifyEmailToken=crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");
    this.verifyEmailToken=verifyEmailToken;
   console.log(this.verifyEmailToken);
   console.log("///////////////////////////////////////////////////////////");
   console.log(verifyEmailToken)
    return verifyEmailToken;

}

UserSchema.pre("save",function(next){
    if(!this.isModified("password")){
        next();
    }
      bcrypt.genSalt(10,(err,salt)=>{
          if(err) next(err);
          bcrypt.hash(this.password,salt,(err,hash)=>{
              if(err) next(err);
              this.password=hash;
              next();
          });
      })
  });

module.exports=mongoose.model("User",UserSchema);
