const {Schema, model}  = require('mongoose');



const ClientSchema = Schema({
    name:{type:String, required: true},
    father_surname:{type:String, required:true},
    mother_surname:{type:String, required:false},
    user_id:{type:Schema.Types.ObjectId, ref:'User', required:true}
},{timestamps:true});


ClientSchema.method('toJSON',function(){
    const {__v,_id,...object} = this.toObject();
    object.uid = _id;
    return object;
});


module.exports  = model('Clients',ClientSchema);