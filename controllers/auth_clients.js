const {response} = require('express');
const Client =require('../models/client');


const createClient = async(req, res  = response)=>{
    const {user_id} = req;
    
    req.body.user_id  = user_id;
    try {
        const client  = new Client(req.body);

    await client.save(); 
    return res.json({success:true,  "msg":"Datos guardados correctamente"});
    } catch (error) {
        res.status(500).json({success:false, msg:'Hable con el administrador'});
    }
   


    return res.json({success:true, data: req.body});
}

const updateClient = async(req, res  = response)=>{

    try {
        const clientDB = await Client.findById(req.body.uid);
        clientDB.name  = req.body.name;
        clientDB.father_surname = req.body.father_surname;
        clientDB.mother_surname  = req.body.mother_surname;
        await clientDB.save();
        return res.json({success:true,  msg:"Datos actualizados correctamente"});
    } catch (error) {
        res.status(500).json({success:false, msg:'Hable con el administrador'});
    }

}

const deleteClient = async(req, res  = response)=>{
    
    try {
        await Client.deleteOne({_id: req.body.uid});
        
        return res.json({success:true,  msg:"Datos eliminados correctamente"});
    } catch (error) {
        res.status(500).json({success:false, msg:'Hable con el administrador'});
    }

}


const allClient = async(req, res  = response)=>{
    const start = Number(req.query.start)|| 0;
    const limit = Number(req.query.limit)|| 0;
    try {
       const clients=  await Client.find().skip(start).limit(limit);
        return res.json({success:true,   data: clients});
    } catch (error) {
        res.status(500).json({success:false, msg:'Hable con el administrador'});
    }

}


const searchClient = async(req, res = response)=>{
    try {
        const searchQuery = req.query.search;
        const regex = new RegExp(searchQuery, 'i');
        
    const clients = await Client.find({
        $or: [
          { name: regex },
          { father_surname: regex },
          { mother_surname: regex },
          {
            $or: [
              {
                $expr: {
                  $regexMatch: {
                    input: { $concat: ["$name", " ", "$father_surname", " ", "$mother_surname"] },
                    regex,
                  },
                },
              },
            ],
          },
        ],
      });
      
         return res.json({success:true,   data: clients});
     } catch (error) {
        console.log(error);
         res.status(500).json({success:false, msg:'Hable con el administrador'});
     }
}

module.exports  ={createClient, updateClient, deleteClient, allClient, searchClient}