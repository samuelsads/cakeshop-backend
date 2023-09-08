

const {response} = require('express');
const Orders  = require('../models/orders');
const { DateTime } = require('luxon'); 




const createOrder = async (req, res  = response)=>{

    const {uid} = req;
    req.body.user_id  = uid;


    try {
        const order  = new Orders(req.body);

       await  order.save(); 
    return res.json({success:true,  "msg":"Datos guardados correctamente"});
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, msg:'Hable con el administrador'});
    }
   
}


const updateOrder = async (req, res  = response)=>{

    try {
        const orderDB  = await Orders.findById(req.body.uid);

        orderDB.description  = req.body.description;
        orderDB.price= req.body.price;
        orderDB.order_delivery_date  = req.body.order_delivery_date;
        orderDB.discount  = req.body.discount;
        orderDB.additional_things  = req.body.additional_things;
        orderDB.delivered = req.body.delivered;
        orderDB.client_id = req.body.client_id;
        await orderDB.save(); 
    return res.json({success:true,  "msg":"Datos actualizados correctamente"});
    } catch (error) {
        res.status(500).json({status:false, msg:'Hable con el administrador'});
    }
   
}



const deleteOrder = async(req, res  = response)=>{
    
    try {
        await Orders.deleteOne({_id: req.body.uid});
        
        return res.json({success:true,  msg:"Datos eliminados correctamente"});
    } catch (error) {
        res.status(500).json({status:false, msg:'Hable con el administrador'});
    }

}


const allOrders = async(req, res  = response)=>{
    const start = Number(req.query.start)|| 0;
    const limit = Number(req.query.limit)|| 0;
    const today = new Date();
    try {
       const orders=  await Orders.find({delivered:{$in:(req.query.delivered)},order_delivery_date: { $gte: today },})
       .populate('client_id','name father_surname mother_surname').populate('user_id', 'name father_surname mother_surname')
       .sort({order_delivery_date:1})
       .skip(start).limit(limit);
        return res.json({success:true,   data: orders});
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, msg:'Hable con el administradors'});
    }

}


const total=async(req,res = response)=>{
   

try {


    const today = DateTime.now().toFormat('yyyy-MM-dd');
    
    const tomorrow =  DateTime.now().plus({ days: 1 }).toFormat('yyyy-MM-dd');
    
    const orderToday  = await Orders.countDocuments({order_delivery_date:{$gte:today, $lt:tomorrow},delivered:req.query.delivered});
    

    const nextDay =  DateTime.now().plus({ days: 1 }).toFormat('yyyy-MM-dd');
    const tomorrow1 =  DateTime.now().plus({ days: 2 }).toFormat('yyyy-MM-dd');

    const orderTomorrow  = await Orders.countDocuments({order_delivery_date:{$gte:nextDay, $lt:tomorrow1},delivered:req.query.delivered});

    const orderTotal = await  Orders.countDocuments({delivered:req.query.delivered});


    return res.json({success:true, today:orderToday, tomorrow: orderTomorrow, total: orderTotal});
} catch (error) {
    console.log(error);
    res.status(500).json({status:false, msg:'Hable con el administradors'});
}
  
}


module.exports ={createOrder,updateOrder,deleteOrder,allOrders, total}