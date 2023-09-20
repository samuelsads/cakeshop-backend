const {response} = require('express');
const Payments = require('../models/payments');

const createPayment = async (req, res  = response)=>{

    const {user_id} = req;
    
    req.body.user_id  = user_id;

    
    try {
        const payment  = new Payments(req.body);

       await  payment.save(); 
    return res.json({success:true,  "msg":"Datos guardados correctamente"});
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, msg:'Hable con el administrador'});
    }
   
}

const allPaymentsByOrder = async(req, res  = response)=>{
   const orderId = req.query.id;
    try {
       const clients=  await Payments.find({order_id:orderId});
        return res.json({success:true,   data: clients});
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, msg:'Hable con el administrador'});
    }


}

module.exports  = {createPayment,allPaymentsByOrder}