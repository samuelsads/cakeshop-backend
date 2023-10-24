const { response } = require('express');
const Payments = require('../models/payments');
const Orders = require('../models/orders');
const mongoose = require('mongoose');
var total = 0.0;
const createPayment = async (req, res = response) => {

  const { user_id } = req;
  
  req.body.user_id = user_id;


  try {

    const orderDB = await Orders.findById(req.body.order_id);
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
    
    if (totalPayments.length > 0) {
      total = totalPayments[0].total;
      if ((totalPayments[0].total + req.body.payment) > orderDB.price) {
        return res.json({ success: false, "msg": "El total del pago supera el precio del producto" });

      }

      req.body.advance_payment = totalPayments[0].total;
    }
    const payment = new Payments(req.body);
    await payment.save();


    if ((total + payment.payment) == orderDB.price) {
      orderDB.advance_payment = (totalPayments[0].total + payment.payment);
      orderDB.paid = true;
      orderDB.save();
    }
    return res.json({ success: true, "msg": "Datos guardados correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Hable con el administrador' });
  }

}


const allPaymentsByOrder = async (req, res = response) => {
  const orderId = req.query.id;
  try {
    const clients = await Payments.find({ order_id: orderId }).populate('user_id').populate('order_id');
    return res.json({ success: true, data: clients });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Hable con el administrador' });
  }


}

module.exports = { createPayment, allPaymentsByOrder }