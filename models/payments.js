const {Schema, model} = require('mongoose');


const PaymentSchema  = Schema({
    payment: {type:Number, required:true},
    payment_type:{type:Number, required: true},
    order_id:{type:Schema.Types.ObjectId, ref:'Orders', require:true},
    user_id:{type:Schema.Types.ObjectId, ref:'User', required:true}
},{timestamps:true});


PaymentSchema.method('toJSON',function(){
    const {__v,_id,...object} = this.toObject();
    object.uid = _id;
    return object;
});


module.exports  = model('Payments',PaymentSchema);