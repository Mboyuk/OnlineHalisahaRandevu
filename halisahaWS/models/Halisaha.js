const mongoose=require("mongoose");
const slugify=require("slugify");
const Schema=mongoose.Schema;



const HalisahaSchema=new Schema({

    name:{
        type:String
    },

    content:{
        type:String
    },

    slug:{
        type:String
    },
    city:{
        type:String
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    ozellik:[
        {
            type:String,
        }
    ],
    image:[{
        type:String
    }],
    comment:{
        user:[{
            type:mongoose.Schema.ObjectId,
            ref:"User"

        }],
        comContent:[{
            type:String
        }],
        profileImage:[{
            type:String
        }] 
    },
    point:{
        user:[{
            type:mongoose.Schema.ObjectId,
            ref:"User"
        }],
        point:[{
            type:Number,
            default:0,
            min:0
        }]
    },
    avgPoint:{
        type:Number,
        default:0
    },
    commentLength:{
        type:Number,
        default:0
    },
    adress:{
        type:String
    },
    socialMedia:{
        type:String
    },
    phoneNumber:{
        type:String
    },
    video:{
        tarih:[{
            type:String,
           
        }],
        saat:[{
            type:String,
        }],
        video_upload:[{
            type:String,
        }]
    },
    fiyat:{
        type:Number
    }

       

   

    




})
HalisahaSchema.pre("save",function(next){
    if(!this.isModified("name")){
        next();
    }
    this.slug=this.makeSlug();
    next();
});
HalisahaSchema.methods.makeSlug=function(){
    return slugify(this.name, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
    });
};

module.exports=mongoose.model("Halisaha",HalisahaSchema);