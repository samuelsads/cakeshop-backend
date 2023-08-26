const {Schema, model}  = require('mongoose');


const OrderSchema = Schema({
    description:{type:String, required: true},
    price:{type:Number, required: true},
    order_delivery_date:{type:Date, required: true},
    discount:{type:Number, required: true},
    additional_things:{type:String, required: false},
    delivered:{type:Boolean, default:false},
    paid:{type:Boolean, required:true},
    advance_payment:{type:Number, required: false},
    advance_payment_type:{type:Number, required:true},
    total_products:{type:Number, required:true},
    client_id:{type:Schema.Types.ObjectId, ref:'Clients', required: true},
    user_id:{type:Schema.Types.ObjectId, ref:'User', required:true}
    
},{timestamps:true});

OrderSchema.pre('save', function(next) {
    if (this.order_delivery_date) {
      this.order_delivery_date.setHours(0, 0, 0, 0); 
    }
    next();
  });

OrderSchema.method('toJSON',function(){
    const {__v,_id,...object} = this.toObject();
    object.uid = _id;
    return object;
});


module.exports  = model('Orders',OrderSchema);