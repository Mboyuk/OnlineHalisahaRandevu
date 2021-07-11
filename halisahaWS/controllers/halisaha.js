const Halisaha=require("../models/Halisaha");
const jwt=require("jsonwebtoken");
const halisahaRandevu=require("../models/HalisahaRandevu");
const User = require("../models/User");
const Message=require("../models/Message");
const CustomError=require("../helpers/error/CustomError");
const asyncErrorWrapper=require("express-async-handler");
const router = require("../routers/auth");
const { isArray, error } = require("jquery");
const { find } = require("../models/Halisaha");
const HalisahaRandevu = require("../models/HalisahaRandevu");
const Reklam = require("../models/ReklamYonetimi");
const {isUserAuth}=require("../helpers/authorization/tokenHelpers")
const {validateUserInput,comparePassword}=require("../helpers/input/inputHelpers");
const { reklam } = require("./admin");


const halisaha=(req,res,next)=>{
    res.render("halisaha")
}
const halisaha_get=async(req,res,next)=>{

    // const {name,content,city}=req.body;
    // console.log(name);

    // console.log(content)


    // const halisaha=await Halisaha.create({
    //     name,
    //     content,
    //     city
    // })
    //  await halisaha.save();
    // res.render("halisaha")
}
const halisaha_getir=async(req,res,next)=>{
    const city=req.params.city;

    const halisaha= await Halisaha.find({city:city}).sort({"avgPoint":-1}).limit(5)  //.sort({pointAvg:-1});,{pointAvg:{$avg:"point.point"}}
    const token=req.cookies.access_token

    console.log("---------------------------------------------");
    console.log(halisaha);
    console.log("---------------------------------------------");
    if(token){
        jwt.verify(token,"gizlikelime",async(err,decoded)=>{
            if(err){
                 console.log(err) 
            }
            else{
 
                const user=await User.findById(decoded.id)

               
                
                if(halisaha==""){
                    halisaham=[{
                        name:"yok",
                        content:"boşşş"

                    }]
                    var avrPointArray=[];
                    const reklam=await Reklam.findOne({sehir:city})
                   
                    res.render("halisahasayfasi",{
                        halisaha:halisaham,
                        user,
                        avrPointArray,
                        reklam

                        
                    })
                }
                else{

                   var avrPointArray=[];
                   console.log("9999999999999999999999999999999999999999999999999999999999999999999")
                    console.log(halisaha)
                    halisaha.forEach(element=>{
                        const arr= element.point.point;
                        console.log(element)
                        const arrLength=element.point.point.length;
                        if(arrLength>0){
                            const puan=arr.reduce(myFunc)
                            function myFunc(total, num) {
                                return total + num;
                            }
                             avrPointArray.push((puan/arrLength).toFixed(2))
                        }else{
                            avrPointArray.push(0);
                        }
                    })
                    console.log(avrPointArray)

                   
                    const reklam=await Reklam.findOne({sehir:city})

                    res.render("halisahasayfasi",{
                        halisaha,
                        user,
                        avrPointArray,
                        reklam
                        
                       
                    })
                }
   
            }
           
        })
    }
    else{
        if(halisaha==""){
            halisaham=[{
                name:"yok",
                content:"boşşş"
            }]
            var avrPointArray=[];
            const reklam=await Reklam.findOne({sehir:city})
           const  user=""
            res.render("halisahasayfasi",{
                halisaha:halisaham,
                user,
                avrPointArray,
                reklam
                
            })
        }
        else{
            var avrPointArray=[];
            console.log(halisaha)
            halisaha.forEach(element=>{
                const arr= element.point.point;
                console.log(element)
                const arrLength=element.point.point.length;
                if(arrLength>0){
                    const puan=arr.reduce(myFunc)
                    function myFunc(total, num) {
                        return total + num;
                    }
                     avrPointArray.push((puan/arrLength).toFixed(2))
                }
            })
         const  user=""
         const reklam=await Reklam.findOne({sehir:city})
            res.render("halisahasayfasi",{
                halisaha,
                user,
                avrPointArray,
                reklam
               
            })
        }
    }

   
}

const halisaha_control_get=async(req,res,next)=>{
    // const id=req.params.id;
    const user=await User.findById(req.user.id);
    //  const halisaha=await Halisaha.findOne({user:id})
    //  if(!halisaha){
    //     return next(new CustomError("öyle bir halisahanız yok ",403));
    //  }
    // console.log("halisaha id"+halisaha.user)
    // console.log("user id"+user.id)
    // if(user.role!="manager"){
    //     return next(new CustomError("only manager can acces yhis route ",403));

    // }
    // // if(user.id!=halisaha.user){
    // //     return next(new CustomError("böyle bir halisahanız yok ",403));
    // // }

    
    // console.log("id halisaha"),
    // console.log(id);
    // console.log(halisaha)
    res.render("halisaha",{
        user
    })
}
const halisaha_control_post=async(req,res,next)=>{
    const information=req.body;
  
    const id=req.params.id;
    const halisaha=await Halisaha.create({
        ...information,
        user:req.user.id
    })
     await halisaha.save();

     const halisaham=await Halisaha.findOne({user:req.user.id})
     const name=halisaham.slug;
     const Halisahaid=halisaham.id;

     const halisahaRandevu=await HalisahaRandevu.create({

        name:name,
        halisaha:Halisahaid

     })

    res.redirect(`/halisaha/${req.user.id}/edit`)
}
const halisaha_edit_get=async(req,res,next)=>{
    
   const ozellik=req.query.ozellik;
   const silinecekOzellik=req.query.sil;
   const fiyat=req.query.fiyat;
   console.log(silinecekOzellik)
    let user =await User.findById(req.user.id)

    
    let halisaha=await Halisaha.findOne({user:user.id})
  
    if(!halisaha){
        return next(new CustomError("böyle bir halisahanız yok ",403));
    }
    else{
        const halisahaRandevu=await HalisahaRandevu.findOne({halisaha:halisaha.id});
        const halisahaOzellikleri=["Dus","Ayakkabi","Bufe","Eldiven","Kafeterya","Otopark","Wifi","Servis","Acik-saha","Kapali-saha"]
        var deger=true;
        if(ozellik){
            if(Array.isArray(ozellik)){
                ozellik.forEach(element=>{
                    if(!halisahaOzellikleri.includes(element)){
                        deger=false;
                    }
                    if(halisaha.ozellik.includes(element)){
                        deger=false
                    }
                })
            }else{
                if(!halisahaOzellikleri.includes(ozellik)){
                    deger=false;
                }
                if(halisaha.ozellik.includes(ozellik)){
                    deger=false
                }
            }
           

            if(deger==true){
                console.log("iceriyooorrrr")
                if(Array.isArray(ozellik)){
                    ozellik.forEach(ozellik => {
                        halisaha.ozellik.push(ozellik)
                    });
                }
                else{
                    halisaha.ozellik.push(ozellik)
                }
            }else{
                console.log("falseseeeeeeeeeeeeeeeeeeee")
            }
            await halisaha.save();
           
        
        }
        

        if(silinecekOzellik){
            
            if(Array.isArray(silinecekOzellik)){
               halisaha= await Halisaha.findOneAndUpdate(
                    {
                        user:user.id
                    },
                    {
                        $pull:{
                            ozellik:{
                                $in:silinecekOzellik
                            }
                           
                        }
                    },
                    {
                        multi:true,
                        new :true,
                        runValidators:true
                    }


                )
            }else{
                halisaha= await Halisaha.findOneAndUpdate(
                    {
                        user:user.id
                    },
                    {
                        $pull:{
                            ozellik:silinecekOzellik
                           
                        }
                    },
                    {
                        
                        new :true,
                        runValidators:true
                    }


                )
            }

        }
        if(fiyat){
            halisaha=await Halisaha.findOneAndUpdate(
                {
                    user:user.id
                },
                {
                    fiyat:fiyat
                },
                {
                        
                    new :true,
                    runValidators:true
                }
            )

        }
        console.log(halisaha)
       
        
        

        const saat=["08:00-09:00","09:00-10:00","10:00-11:00","11:00-12:00","12:00-13:00","13:00-14:00","14:00-15:00","15:00-16:00","16:00-17:00","17:00-18:00","18:00-19:00","19:00-20:00","20:00-21:00","21:00-22:00","22:00-23:00"] ;


        const arr= halisaha.point.point;
        const arrLength=halisaha.point.point.length;
        if(arrLength>0){
            const puan=arr.reduce(myFunc)
            function myFunc(total, num) {
                return total + num;
            }
             var avrPoint=Number((puan/arrLength).toFixed(2));
        }
        console.log(avrPoint)


        

        
        res.render("edit-halisaha",{
            user,
            halisaha,
            name:halisaha.name,
            errorss:false,
           
            saat,
            halisahaRandevu,
            halisahaOzellikleri,
            avrPoint
        })
    }
   
}
const halisaha_edit_post=async(req,res,next)=>{
    const {pass,tarih,clock,control}=req.body;
    const email=req.user.email
    let errors=[]
    console.log(req.body)
    if(!pass || !tarih || !clock ){
        errors.push({msg:"lütfen gerekli yerleri doldurunuz"})
    }
    console.log(typeof(tarih))


    const user=await User.findOne({email}).select("+password");
    let halisaha=await Halisaha.findOne({user:user.id})
    var halisahaRandevu=await HalisahaRandevu.findOne({halisaha:halisaha.id});
    if(!comparePassword(pass,user.password)){
        //errors.push({msg:"E-posta veya şifre hatalı..."})
        errors.push({msg:"E-posta veya şifre hatalı..."})
      
       
    }else{
        if(req.body.bosmu){
           if(req.body.bosmu=="bos"){
                halisahaRandevu.user.push(user.id);
                halisahaRandevu.saat.push(clock);
                halisahaRandevu.tarih.push(tarih);
                await halisahaRandevu.save()
                console.log(halisahaRandevu)
            }else if(req.body.bosmu=="dolu"){
                halisahaRandevu.tarih.forEach(async(element,index)=>{
                    if(element==tarih){
                        
                        if(clock==halisahaRandevu.saat[index]){
                            console.log(clock+" "+ element)
                            await HalisahaRandevu.findOneAndUpdate(
                                {
                                    halisaha:halisaha.id
                                },
                                {
                                    $unset:{
                                        [`saat.${index}`]:1,
                                        [`tarih.${index}`]:1,
                                        [`user.${index}`]:1,
                                    }
                                }
                            )
                             HalisahaRandevu.findOneAndUpdate(
                                {
                                    halisaha:halisaha.id
                                },
                                {
                                    $pull:{
                                        [`saat.${index}`]:null,
                                        [`tarih.${index}`]:null,
                                        [`user.${index}`]:null,
                                    }
                                },
                                {
                                    new :true,
                                    runValidators:true
                                }
                            )
                            
                            console.log("adfasdfasdf")

                        }
                    }
                })
                    
            }
        }else{
            errors.push({msg:" Güncelleme yapılmadı"})
        }
        // halisahaRandevu.user.push(user.id);
        // halisahaRandevu.saat.push(saat);
        // halisahaRandevu.tarih.push(tarih);

    }
    halisahaRandevu=await HalisahaRandevu.findOne({halisaha:halisaha.id});
    

    const saat=["08:00-09:00","09:00-10:00","10:00-11:00","11:00-12:00","12:00-13:00","13:00-14:00","14:00-15:00","15:00-16:00","16:00-17:00","17:00-18:00","18:00-19:00","19:00-20:00","20:00-21:00","21:00-22:00","22:00-23:00"] ;
    const halisahaOzellikleri=["dus","ayakkabi","bufe","eldiven","kafeterya","otopark","wifi","servis","acik-saha","kapali-saha"]

    // const {editInformation,ozellik}=req.body;

    // //const ozellik=req.body.ozellik;
    
    // let user =await User.findById(req.user.id)
    // const halisaha=await Halisaha.findOneAndUpdate({user:req.user.id},editInformation,{
    //     new :true,
    //     runValidators:true
    // });
    // if(ozellik){
    //     if(Array.isArray(ozellik)){
    //         ozellik.forEach(ozellik => {
    //             halisaha.ozellik.push(ozellik)
    //         });
    //     }
    //     else{
    //         halisaha.ozellik.push(ozellik)
    //     }
        
    // }
  
   // halisaha.ozellik.push(ozellik)
   const arr= halisaha.point.point;
        const arrLength=halisaha.point.point.length;
        if(arrLength>0){
            const puan=arr.reduce(myFunc)
            function myFunc(total, num) {
                return total + num;
            }
             var avrPoint=Number((puan/arrLength).toFixed(2));
        }
    await halisaha.save();
    res.render("edit-halisaha",{
        user,
        halisaha,
        errorss:false,
        saat,
        errors,
        halisahaRandevu,
        halisahaOzellikleri,
        avrPoint
    })
}
const halisahaArama=async(req,res,next)=>{
    const token=req.cookies.access_token
    if(token){
        jwt.verify(token,"gizlikelime",async(err,decoded)=>{
            if(err){
                 console.log(err) 
            }
            else{
                
                const user=await User.findById(decoded.id)

               
                let city=req.params.city;
                const ozellik=req.query.ozellik;
                let halisaham=[];
                let errors="";
                let popy=false;
                let popy2=true;
                let popy3=false;
                let halisaha=await Halisaha.find({city:city})
                let a=["dus","ayakkabi"]
                console.log(req.query.ozellik)
                if(req.query.ozellik){
                    popy3=true
                    let dizi=req.query.ozellik
                    if(Array.isArray(req.query.ozellik)){
                        for(let j in halisaha){
                            var k=0;
                                for(let i in dizi){
                                    
                                    
                                    if(halisaha[j].ozellik.includes(dizi[i])){   
                                        k++;
                                        if(!halisaham.includes(halisaha[j])){
                                            halisaham.push(halisaha[j])
                                        }  
                                    }
                                    else{
                                        if(k!=0){
                                            halisaham.pop();
                                            break;
                                        }
                                        
                                    }
                                }
                        }
                    }
                    else{
                        if(req.query.siralama){
                            console.log(req.query.siralama)
                            popy2=false;
                            if(req.query.siralama=="Azalan puan"){
                                halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik}).sort({"avgPoint":-1});
                                console.log(halisaha)
                            }else if(req.query.siralama=="Artan puan"){
                                halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik}).sort({"avgPoint":1});
                            }else if(req.query.siralama=="Artan yorum"){
                                halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik}).sort({"commentLength":1});
                            }else if(req.query.siralama=="Azalan yorum"){
                                halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik}).sort({"commentLength":-1});
                            }else if(req.query.siralama=="Azalan fiyat"){
                                halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik}).sort({"fiyat":-1});
                            }else if(req.query.siralama=="Artan fiyat"){
                                halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik}).sort({"fiyat":1});
                            }


                        }else{
                            popy2=false;
                            halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik});
                        }
                        // popy2=false;
                        //      halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik});
                        
                    }
                }
                else{
                    if(req.query.siralama){
                        console.log(req.query.siralama)
                        if(req.query.siralama=="Azalan puan"){
                            halisaha=await Halisaha.find({city:city}).sort({"avgPoint":-1});
                        }else if(req.query.siralama=="Artan puan"){
                            halisaha=await Halisaha.find({city:city}).sort({"avgPoint":1});
                        }else if(req.query.siralama=="Artan yorum"){
                            halisaha=await Halisaha.find({city:city}).sort({"commentLength":1});
                        }else if(req.query.siralama=="Azalan yorum"){
                            halisaha=await Halisaha.find({city:city}).sort({"commentLength":-1});
                        }else if(req.query.siralama=="Azalan fiyat"){
                            halisaha=await Halisaha.find({city:city}).sort({"fiyat":-1});
                        }else if(req.query.siralama=="Artan fiyat"){
                            console.log("------------------------------------------------------------")
                            halisaha=await Halisaha.find({city:city}).sort({"fiyat":1});
                        }
                    }
                }
                console.log("halisahaaammmmmmmmmmm");
                console.log(halisaham)

                if(halisaham.length>=1){

                    halisaha=halisaham
                    
                    
                }
                else{
                    popy=true;
                }
                console.log(popy+" "+popy2)
                if(popy && popy2 && popy3){
                    console.log(popy+" "+popy2)
                    errors="Uygun hali saha bulunamadı. Tüm Hali sahalar listeleniyor"
                }
                if(halisaha.length==0){
                    errors="Uygun hali saha bulunamadı..."
                    console.log(errors)
                }
                
                // const arr= halisaha.point.point;
                // console.log(halisaha)
                // const arrLength=halisaha.point.point.length;
                // if(arrLength>0){
                //     const puan=arr.reduce(myFunc)
                //     function myFunc(total, num) {
                //         return total + num;
                //     }
                //      var avrPoint=(puan/arrLength).toFixed(2);
                // }
                console.log(req.query)
                              res.render("halisahaArama",{
                    halisaha,
                    user,
                    errors,
                    
                   
                })
                
                
               
                
                
            }
           
        })
    }
    else{
        let city=req.params.city;
        const ozellik=req.query.ozellik;
        let halisaham=[];
        let errors="";
        let popy=false;
        let popy2=true;
        let popy3=false;
        let halisaha=await Halisaha.find({city:city})
        let a=["dus","ayakkabi"]

        if(req.query.ozellik){
            popy3=true
            let dizi=req.query.ozellik
            if(Array.isArray(req.query.ozellik)){
                for(let j in halisaha){
                    var k=0;
                        for(let i in dizi){
                            
                            
                            if(halisaha[j].ozellik.includes(dizi[i])){   
                                k++;
                                if(!halisaham.includes(halisaha[j])){
                                    halisaham.push(halisaha[j])
                                }  
                            }
                            else{
                                if(k!=0){
                                    halisaham.pop();
                                    break;
                                }
                                
                            }
                        }
                }
            }
            else{
                if(req.query.siralama){
                    console.log(req.query.siralama)
                    popy2=false;
                    if(req.query.siralama=="Azalan puan"){
                        halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik}).sort({"avgPoint":-1});
                        console.log(halisaha)
                    }else if(req.query.siralama=="Artan puan"){
                        halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik}).sort({"avgPoint":1});
                    }else if(req.query.siralama=="Artan yorum"){
                        halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik}).sort({"commentLength":1});
                    }else if(req.query.siralama=="Azalan yorum"){
                        halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik}).sort({"commentLength":-1});
                    }else if(req.query.siralama=="Azalan fiyat"){
                        halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik}).sort({"fiyat":-1});
                    }else if(req.query.siralama=="Artan fiyat"){
                        halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik}).sort({"fiyat":1});
                    }



                }else{
                    popy2=false;
                    halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik});
                }
                // popy2=false;
                //      halisaha=await Halisaha.find({city:city}).where({ozellik:req.query.ozellik});
                
            }
        }
        else{
            if(req.query.siralama){
                console.log(req.query.siralama)
                if(req.query.siralama=="Azalan puan"){
                    halisaha=await Halisaha.find({city:city}).sort({"avgPoint":-1});
                }else if(req.query.siralama=="Artan puan"){
                    halisaha=await Halisaha.find({city:city}).sort({"avgPoint":1});
                }else if(req.query.siralama=="Artan yorum"){
                    halisaha=await Halisaha.find({city:city}).sort({"commentLength":1});
                }else if(req.query.siralama=="Azalan yorum"){
                    halisaha=await Halisaha.find({city:city}).sort({"commentLength":-1});
                }else if(req.query.siralama=="Azalan fiyat"){
                    halisaha=await Halisaha.find({city:city}).sort({"fiyat":-1});
                }else if(req.query.siralama=="Artan fiyat"){
                    halisaha=await Halisaha.find({city:city}).sort({"fiyat":1});
                }
            }
        }

        if(halisaham.length>=1){
            console.log("asdfasdfasdfsd******************************************f")
            halisaha=halisaham
        }
        else{
            popy=true;
        }
        console.log(popy+" "+popy2)
        if(popy && popy2 && popy3){
            console.log(popy+" "+popy2)
            errors="Uygun hali saha bulunamadı. Tüm Hali sahalar listeleniyor"
        }
        if(halisaha.length==0){
            errors="Uygun hali saha bulunamadı..."
            console.log(errors)
        }
        const user=""
        res.render("halisahaArama",{
            halisaha,
            user,
            errors
        })
    }

    
}
const halisahaArama_post=async(req,res,next)=>{
    let errors="";
    const token=req.cookies.access_token
    if(token){
        jwt.verify(token,"gizlikelime",async(err,decoded)=>{
            if(err){
                 console.log(err) 
            }
            else{
                
                const user=await User.findById(decoded.id)
                const city=req.params.city;
                console.log(city)
                let query=Halisaha.find({city:city});
                if(req.body.search){
                    const searchObject={};
            
                    const regex=new RegExp(req.body.search,"i");
                    searchObject["name"]=regex;
                    query=query.where(searchObject);
                }
                const halisaha=await query;
                console.log("*****************************************************************************")
                console.log(halisaha)
                res.render("halisahaArama",{
                    halisaha,
                    user,
                    errors
                })
            }
        })
    }else{

        const user=""
        const city=req.params.city;
        console.log(city)
        let query=Halisaha.find({city:city});
        if(req.body.search){
            const searchObject={};
    
            const regex=new RegExp(req.body.search,"i");
            searchObject["name"]=regex;
            query=query.where(searchObject);
        }
        const halisaha=await query;
        console.log("*****************************************************************************")
        console.log(halisaha)
        res.render("halisahaArama",{
            halisaha,
            user,
            errors
        })
    }

   
   
}

const halisaha_istek_get=async(req,res,next)=>{
    let errors=""
   
    const user=await User.findById(req.user.id)
    res.render("halisahaistek",{
        errors,
        user,
    })
}
const halisaha_istek_post=async(req,res,next)=>{
    let errors="";
    const userm=req.user;
    const {content}=req.body;
    const user=await User.findById(req.user.id)
    if(!content){
        errors="lütfen gerekli yerleri doldurunuz"
    }
    else{
        const message=await Message.create({
            name:userm.name,
            email:userm.email,
            user:userm.id,
            content:content
            
        })
    }
    

    res.redirect("/home")
}

const halisahaGoruntule=async(req,res,next)=>{
    const token=req.cookies.access_token
    const {id,slug}=req.params;
    console.log(id+" "+slug)

    if(token){
        jwt.verify(token,"gizlikelime",async(err,decoded)=>{
            if(err){
                 console.log(err) 
            }
            else{
                
                const user=await User.findById(decoded.id)
        
                try{
                    const halisahaRandevu=await HalisahaRandevu.findOne({halisaha:id});
                  
                    if(!halisahaRandevu){
                        throw Error
                    }
                    var halisaha=await Halisaha.findById(id)
                 

                  
                    // const startIndex=(page-1)*limit;

                    // const endIndex=page*limit;
                    const arr= halisaha.point.point;
                    const arrLength=halisaha.point.point.length;
                    if(arrLength>0){
                        const puan=arr.reduce(myFunc)
                        function myFunc(total, num) {
                            return total + num;
                        }
                         var avrPoint=Number((puan/arrLength).toFixed(2));
                    }
                    console.log(arr)
                   
                   
                    console.log(avrPoint)
                    
                   
                    //const halisahaRandevu={tarih:["14-6","15-6","16-6","17-6","15-6","17-6"],saat:["11:00-12:00","11:00-12:00","11:00-12:00","17:00-18:00","09:00-10:00","13:00-14:00"]}
                  
                    const saat=["08:00-09:00","09:00-10:00","10:00-11:00","11:00-12:00","12:00-13:00","13:00-14:00","14:00-15:00","15:00-16:00","16:00-17:00","17:00-18:00","18:00-19:00","19:00-20:00","20:00-21:00","21:00-22:00","22:00-23:00"] ;
                    const halisahaOzellikleri=["Dus","Ayakkabi","Bufe","Eldiven","Kafeterya","Otopark","Wifi","Servis","Acik-saha","Kapali-saha"]

                    const page=parseInt( req.query.page) || 1;
                    const limit=parseInt( req.query.limit) || 4;
                    const startIndex=(page-1)*limit;
                    const endIndex=page*limit;

                   const halisahaYorumlar=halisaha.comment.comContent
                   const halisahaResim=halisaha.comment.profileImage
                   const halisahaYorumlarUser=halisaha.comment.user;
                   var userName=[];
                    const allUser=await User.find();
                    halisahaYorumlarUser.forEach(element=>{
                        for(const i in allUser){
                           

                            if(element==allUser[i].id){
                              
                                userName.push(allUser[i].name);
                                break;
                            }
                        }
                    })
                
                    console.log(userName)



                   const maxPage=Math.ceil(halisahaYorumlar.length/4);

                   const gosterilecekYorum= halisahaYorumlar.slice(startIndex,endIndex);
                   const gosterilecekResim= halisahaResim.slice(startIndex,endIndex);
                   const gosterilecekYorumUser=userName.slice(startIndex,endIndex)

                 

                    res.render("halisaha_table",{
                        halisahaRandevu,
                        saat,
                        halisaha,
                        errors:false,
                        user,
                        halisahaYorumlar,
                        halisahaResim,
                        maxPage,
                        gosterilecekYorum,
                        gosterilecekResim,
                        gosterilecekYorumUser,
                        page,
                        avrPoint,
                        halisahaOzellikleri
                  
                    })
                }catch(e){
                   
                    res.render("halisaha_table",{
                        errors:true,
                        user
                  
                    })
                }
                
            }
           
        })
    }
    else{
        try{
            const halisahaRandevu=await HalisahaRandevu.findOne({halisaha:id});
          
            if(!halisahaRandevu){
                throw Error
            }
            const halisaha=await Halisaha.findById(id)
          
            //const halisahaRandevu={tarih:["14-6","15-6","16-6","17-6","15-6","17-6"],saat:["11:00-12:00","11:00-12:00","11:00-12:00","17:00-18:00","09:00-10:00","13:00-14:00"]}
        
            const saat=["08:00-09:00","09:00-10:00","10:00-11:00","11:00-12:00","12:00-13:00","13:00-14:00","14:00-15:00","15:00-16:00","16:00-17:00","17:00-18:00","18:00-19:00","19:00-20:00","20:00-21:00","21:00-22:00","22:00-23:00"] ;
            const halisahaOzellikleri=["Dus","Ayakkabi","Bufe","Eldiven","Kafeterya","Otopark","Wifi","Servis","Acik-saha","Kapali-saha"]

            const arr= halisaha.point.point;
            console.log(halisaha)
            const arrLength=halisaha.point.point.length;
            if(arrLength>0){
                const puan=arr.reduce(myFunc)
                function myFunc(total, num) {
                    return total + num;
                }
                 var avrPoint=(puan/arrLength).toFixed(2);
            }
            console.log(arr)
           
           
            console.log(avrPoint)


            const page=parseInt( req.query.page) || 1;
            const limit=parseInt( req.query.limit) || 4;
            const startIndex=(page-1)*limit;
            const endIndex=page*limit;

           const halisahaYorumlar=halisaha.comment.comContent
           const halisahaResim=halisaha.comment.profileImage

           const halisahaYorumlarUser=halisaha.comment.user;
           var userName=[];
            const allUser=await User.find();
            halisahaYorumlarUser.forEach(element=>{
                for(const i in allUser){
                   

                    if(element==allUser[i].id){
                      
                        userName.push(allUser[i].name);
                        break;
                    }
                }
            })
        
            console.log(userName)



           const maxPage=Math.ceil(halisahaYorumlar.length/4);

           const gosterilecekYorum= halisahaYorumlar.slice(startIndex,endIndex);
           const gosterilecekResim= halisahaResim.slice(startIndex,endIndex);
           const gosterilecekYorumUser=userName.slice(startIndex,endIndex)

         

           const user=""
            res.render("halisaha_table",{
                halisahaRandevu,
                saat,
                halisaha,
                errors:false,
                user,
                halisahaYorumlar,
                halisahaResim,
                gosterilecekYorum,
                gosterilecekResim,
                gosterilecekYorumUser,
                page,
                maxPage,
                avrPoint,
                halisahaOzellikleri
          
            })
        }catch(e){
           const user=""
            res.render("halisaha_table",{
                errors:true,
                user
          
            })
        }
    }

   
   
   

   

}
const halisahaGoruntule_post=(req,res,next)=>{
    const a=req.params;

    
   
    res.send("halisaha_table")

}

const halisahaRezervasyon_get=async(req,res,next)=>{
    const {id,tarih,saat}=req.params;
    var isReservOk=false;
    let errors=[];
    const date=new Date();
    const hour=date.getHours()
    var gun=date.getDate();
    const user=await User.findById(req.user.id)
 

    if(gun<parseInt(tarih.split("-")[0])){
        console.log("rezervasyon yapabilir")
        isReservOk=true;
    }else if(gun=parseInt(tarih.split("-")[0])){
        if((hour+2)<=parseInt(saat.split(":")[0])   ){
            console.log("rezervasyon yapabilirrrr")
            isReservOk=true;
        }else{
            errors.push({msg:"2 saat önce rezervasyon yapabilirsiniz"})
        }
    }else{
        console.log("hataaaaa")
    }
  
    

    res.render("halisahaRezervasyon",{
        tarih,
        saat,
        isReservOk,
        errors,
        user
    })
}

const halisahaRezervasyon_post=async(req,res,next)=>{
    const {id,tarih,saat,city,slug}=req.params;
   // const userId=req.user.id;
   
   try {
        var halisahaRandevum=await HalisahaRandevu.findOne({halisaha:id});
        halisahaRandevum.tarih.forEach((element,index)=>{
            if(element==(tarih)){
              

                if(halisahaRandevum.saat[index]==saat){
                   
                    throw error;

                }
            }
        })

        const date=new Date();
   
  
    
        const halisahaRandevu=await HalisahaRandevu.findOneAndUpdate({halisaha:id},slug,{
            new :true,
            runValidators:true
        });
        halisahaRandevu.tarih.push(tarih);
        halisahaRandevu.saat.push(saat);
        halisahaRandevu.user.push(req.user.id)
        await halisahaRandevu.save();

        const user=await User.findById(req.user.id);
        user.preTransactions.halisaha.push(id);
        user.preTransactions.saat.push(saat);
        user.preTransactions.tarih.push(tarih);
        user.preTransactions.name.push(slug);
        user.preTransactions.createAt.push(Date.now());
        if(user.yorumHakki.halisahaYorumId.includes(id)){
        const index= user.yorumHakki.halisahaYorumId.indexOf(id)
        var a= user.yorumHakki.yorumHakkiSayisi[index];


        //user.yorumHakki.yorumHakkiSayisi.index=(Number(a)+1);
        const userm=await User.findByIdAndUpdate(//AndUpdate
            
                req.user.id,
            
            {
                $set:{
                    [`yorumHakki.yorumHakkiSayisi.${index}`]:(Number(a)+1)
                }
            }
        )

            // await userm.save()
        


        }else{
            user.yorumHakki.halisahaYorumId.push(id)
            user.yorumHakki.yorumHakkiSayisi.push(1)
        }
    
        await user.save()
        // console.log("user234"+user)

        // console.log("halisaha randevu")
        // console.log(halisahaRandevu)

    
        res.redirect(`/halisaha/${city}/${id}/${slug}`)


   } catch (error) {
       res.render("hata")

   }

   
  

   
    
}
const halisahaImageUpload=async(req,res,next)=>{

    console.log("halisaha ımageeeeeeeeee")
    console.log(req.body.halisaha_image)
    console.log(req.query.halisaha_image)
    console.log(req.files)
    const halisaha=await Halisaha.findOne(
        {user:req.user.id},
    );

    req.files.forEach((element,index)=>{
        halisaha.image.push(element.filename);
    })
    await halisaha.save()
    console.log(halisaha)
   
    res.redirect(`/halisaha/${req.user.id}/edit`)
}
const halisahaImageDelete=async(req,res,next)=>{

    console.log(req.body.fotosl)

    const halisaha=await Halisaha.findOneAndUpdate(
        {user:req.user.id},
        {
            $pull:{
                image:req.body.fotosl
            }

        }

    )


    res.redirect(`/halisaha/${req.user.id}/edit`)
}

const videoUpload=async(req,res,next)=>{

    const halisaha=await Halisaha.findOne({user:req.user.id});
    console.log(halisaha);
    console.log(req.body.saati+"---------------------------------------------")
    halisaha.video.tarih.push(req.body.tarihi);
    halisaha.video.saat.push(req.body.saati);
    halisaha.video.video_upload.push(req.savedHalisahaVideo);
    await halisaha.save();
    console.log(halisaha.video);
    res.redirect(`/halisaha/${req.params.id}/edit`);
}
const halisaha_edit_message=async(req,res,next)=>{
    const halisaha=await Halisaha.findOne({user:req.user.id});
    halisaha.content=req.body.content;
    await halisaha.save();

    res.redirect(`/halisaha/${req.params.id}/edit`);
}



module.exports={
    halisaha,
    halisaha_get,
    halisaha_getir,
    halisaha_control_get,
    halisaha_control_post,
    halisaha_edit_get,
    halisaha_edit_post,
    halisahaArama,
    halisahaGoruntule,
    halisaha_istek_get,
    halisaha_istek_post,
    halisahaGoruntule_post,
    halisahaRezervasyon_get,
    halisahaRezervasyon_post,
    halisahaImageUpload,
    halisahaImageDelete,
    halisahaArama_post,
    videoUpload,
    halisaha_edit_message

}