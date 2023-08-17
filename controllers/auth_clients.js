const {response} = require('express');
const Client =require('../models/client');


const createClient = async(req, res  = response)=>{
    const {uid} = req;
    
    req.body.user_id  = uid;
    try {
        const client  = new Client(req.body);

    client.save(); 
    return res.json({success:true,  "msg":"Datos guardados correctamente"});
    } catch (error) {
        res.status(500).json({status:false, msg:'Hable con el administrador'});
    }
   


    return res.json({success:true, data: req.body});
}

const updateClient = async(req, res  = response)=>{

    try {
        const clientDB = await Client.findById(req.body.uid);
        clientDB.name  = req.body.name;
        clientDB.father_surname = req.body.father_surname;
        clientDB.mother_surname  = req.body.mother_surname;
        clientDB.save();
        return res.json({success:true,  msg:"Datos actualizados correctamente"});
    } catch (error) {
        res.status(500).json({status:false, msg:'Hable con el administrador'});
    }

}

const deleteClient = async(req, res  = response)=>{
    
    try {
        await Client.deleteOne({_id: req.body.uid});
        
        return res.json({success:true,  msg:"Datos eliminados correctamente"});
    } catch (error) {
        res.status(500).json({status:false, msg:'Hable con el administrador'});
    }

}


const allClient = async(req, res  = response)=>{
    const start = Number(req.query.start)|| 0;
    const limit = Number(req.query.limit)|| 0;
    try {
       const clients=  await Client.find().skip(start).limit(limit);
        return res.json({success:true,   data: clients});
    } catch (error) {
        res.status(500).json({status:false, msg:'Hable con el administrador'});
    }

}

module.exports  ={createClient, updateClient, deleteClient, allClient}