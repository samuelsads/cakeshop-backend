

const { response } = require('express');
const Orders = require('../models/orders');
const Payment = require('../models/payments');
const { DateTime } = require('luxon');
const mongoose = require('mongoose');



const createOrder = async (req, res = response) => {

    const { user_id } = req;
    req.body.user_id = user_id;


    try {
        const order = new Orders(req.body);
        await order.save();
        return res.json({ success: true, "msg": "Datos guardados correctamente", id: order._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Hable con el administrador' });
    }

}

const deliveredOrder = async (req, res = response) => {
    try {
        const orderDB = await Orders.findById(req.body.uid);
        orderDB.delivered = true;
        if (!orderDB.paid) {
            return res.json({ success: false, "msg": "La orde que intenta finalizar no se ha terminado de pagar" });
        }
        orderDB.save();
        return res.json({ success: true, "msg": "Datos guardados correctamente" });
    } catch (e) {
        res.status(500).json({ status: false, msg: 'Hable con el administrador' });
    }

}


const updateOrder = async (req, res = response) => {
    const { user_id } = req;
    try {
        const orderDB = await Orders.findById(req.body.uid);



        const totalPayments = await Payment.aggregate([
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
            req.body.advance_payment = totalPayments[0].total;

            if(totalPayments[0].total  == orderDB.price){
                req.body.paid = true;
            }
        }

        orderDB.description = req.body.description;
        orderDB.price = req.body.price;
        orderDB.order_delivery_date = req.body.order_delivery_date;
        orderDB.advance_payment = req.body.advance_payment;
        orderDB.advance_payment_payment_type = 1;
        orderDB.discount = req.body.discount;
        orderDB.additional_things = req.body.additional_things;
        orderDB.delivered = req.body.delivered;
        orderDB.client_id = req.body.client_id;
        orderDB.paid = req.body.paid;
        orderDB.total_products = req.body.total_products;
        orderDB.user_id = user_id;

        await orderDB.save();
        return res.json({ success: true, "msg": "Datos actualizados correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, msg: 'Hable con el administrador' });
    }

}



const deleteOrder = async (req, res = response) => {

    try {
        await Orders.deleteOne({ _id: req.body.uid });

        return res.json({ success: true, msg: "Datos eliminados correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Hable con el administrador' });
    }

}


const allOrders = async (req, res = response) => {
    const start = Number(req.query.start) || 0;
    const limit = Number(req.query.limit) || 0;
    const today = DateTime.now().toFormat('yyyy-MM-dd');
    try {
        const orders = await Orders.find({ delivered: { $in: (req.query.delivered) }, order_delivery_date: { $gte: today }, })
            .populate('client_id', 'name father_surname mother_surname').populate('user_id', 'name father_surname mother_surname')
            .sort({ order_delivery_date: 1 })
            .skip(start).limit(limit);
        return res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Hable con el administradors' });
    }

}


const total = async (req, res = response) => {


    try {


        const today = DateTime.now().toFormat('yyyy-MM-dd');

        const tomorrow = DateTime.now().plus({ days: 1 }).toFormat('yyyy-MM-dd');

        const orderToday = await Orders.countDocuments({ order_delivery_date: { $gte: today, $lt: tomorrow }, delivered: req.query.delivered });


        const nextDay = DateTime.now().plus({ days: 1 }).toFormat('yyyy-MM-dd');
        const tomorrow1 = DateTime.now().plus({ days: 2 }).toFormat('yyyy-MM-dd');

        const orderTomorrow = await Orders.countDocuments({ order_delivery_date: { $gte: nextDay, $lt: tomorrow1 }, delivered: req.query.delivered });

        const orderTotal = await Orders.countDocuments({ delivered: req.query.delivered });


        return res.json({ success: true, today: orderToday, tomorrow: orderTomorrow, total: orderTotal });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Hable con el administradors' });
    }

}


module.exports = { createOrder, updateOrder, deleteOrder, allOrders, total, deliveredOrder }