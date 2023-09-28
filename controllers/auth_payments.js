const {response} = require('express');
const Payments = require('../models/payments');
const Orders  = require('../models/orders');
const mongoose = require('mongoose');

const createPayment = async (req, res  = response)=>{

    const {user_id} = req;
    
    req.body.user_id  = user_id;

    
    try {
       
          const orderDB  = await Orders.findById(req.body.order_id);
          console.log("precio");
          console.log(orderDB.price);
          console.log(req.body.order_id);
        const totalPayments = await Payments.aggregate([
            {
              $match: { order_id: new mongoose.Types.ObjectId(req.body.order_id) }
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$payment' }
              }
            }
          ]);
        const  total = 0.0;
        console.log(totalPayments);
          if (totalPayments.length > 0) {
            console.log("total pagado");
            console.log(totalPayments[0].total);
            if((totalPayments[0].total+req.body.payment) >orderDB.price){
               return  res.json({success:false,  "msg":"El total de pagos supera el precio del producto"});
            }
            req.body.advance_payment = totalPayments[0].total;
          } 
      const payment  = new Payments(req.body);
       await  payment.save(); 
    return res.json({success:true,  "msg":"Datos guardados correctamente"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, msg:'Hable con el administrador'});
    }
   
}


async function getTotalPaymentsForOrder(orderId) {
    try {
      // Utiliza una agregación para calcular la suma de los pagos para un order_id específico.
      const totalPayments = await Payment.aggregate([
        {
          $match: { order_id: mongoose.Types.ObjectId(orderId) }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$payment' }
          }
        }
      ]);
  
      if (totalPayments.length > 0) {
        return { total: totalPayments[0].total };
      } else {
        return { total: 0 }; // No hay pagos para el order_id especificado.
      }
    } catch (error) {
      return { error: 'Ha ocurrido un error al obtener los pagos' };
    }
  }

const allPaymentsByOrder = async(req, res  = response)=>{
   const orderId = req.query.id;
    try {
       const clients=  await Payments.find({order_id:orderId});
        return res.json({success:true,   data: clients});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, msg:'Hable con el administrador'});
    }


}

module.exports  = {createPayment,allPaymentsByOrder}