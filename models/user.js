const {Schema, model}  = require('mongoose');


const UserSchema = Schema({
    name:{type:String, required: true},
    father_surname:{type:String, required: true},
    mother_surname:{type:String, required: true},
    email:{type:String, required: true, unique:true},
    password:{type:String, required: true},
    role:{type:Number, required: true},
    
},{timestamps:true});

UserSchema.method('toJSON',function(){
    const {__v,_id, password,...object} = this.toObject();
    object.uid = _id;
    return object;
});


module.exports  = model('User',UserSchema);