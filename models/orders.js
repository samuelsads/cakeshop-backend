const {Schema, model}  = require('mongoose');


const OrderSchema = Schema({
    description:{type:String, required: true},
    price:{type:Number, required: true},
    order_delivery_date:{type:Date, required: true},
    discount:{type:Number, required: true},
    additional_things:{type:String, required: false},
    delivered:{type:Boolean, default:false},
    client_id:{type:Schema.Types.ObjectId, ref:'Clients', required: true},
    user_id:{type:Schema.Types.ObjectId, ref:'User', required:true}
    
},{timestamps:true});

OrderSchema.method('toJSON',function(){
    const {__v,_id,...object} = this.toObject();
    object.uid = _id;
    return object;
});


module.exports  = model('Orders',OrderSchema);