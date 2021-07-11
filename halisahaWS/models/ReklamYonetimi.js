const mongoose=require("mongoose");
const slugify=require("slugify");
const Schema=mongoose.Schema;

const ReklamSchema=new Schema({
    sehir:{
        type:String
    },
   
    reklam_image:[{
        type:String
    }],
    reklam_halisaha_id:[{
        type:mongoose.Schema.ObjectId,
        ref:"Halisaha"
    }],
    reklam_halisaha_name:[{
        type:String,
        
    }],
    // reklam_halisaha_name1:[{
    //     type:String,
        
    // }],


   

})
// ReklamSchema.pre("save",function(next){
//     if(!this.isModified("reklam_halisaha_name")){
//         next();
//     }
//     this.reklam_halisaha_name1=this.makeSlug();
//     next();
// });
// ReklamSchema.methods.makeSlug=function(){
//     return slugify(this.reklam_halisaha_name, {
//         replacement: '-',  // replace spaces with replacement character, defaults to `-`
//         remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
//         lower: true,      // convert to lower case, defaults to `false`
//     });
// };

module.exports=mongoose.model("Reklam",ReklamSchema);