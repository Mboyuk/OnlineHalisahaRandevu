const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const HalisahaRandevuSchema=new Schema({

    name:{
        type:String
    },
    halisaha:{
        type:mongoose.Schema.ObjectId,
        ref:"Halisaha"
    },
    user:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],
    tarih:[
        {
            type:String
        }
    ],
    saat:[
        {
            type:String
        }
    ]

})


module.exports=mongoose.model("HalisahaRandevu",HalisahaRandevuSchema);