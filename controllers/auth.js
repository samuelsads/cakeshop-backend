
const {response}= require('express');

const bcrypt  = require('bcryptjs');

const User = require('../models/user');
const { generarJWT } = require('../helpers/jwt');
const createUser = async(req,res =response)=>{

    const {email,password} = req.body;
    
    try {

        const existEmail = await User.findOne({email});
        
        if(existEmail){
            return res.status(400).json({
                success:false,
                msg:'Credenciales no validas'
            });
        }

        const user = new User(req.body);

        const salt  = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        console.log(user.id);

        const token = await generarJWT(user.id);

        res.json({success:true,   user, token});
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, msg:'Hable con el administrador'});
    }


    
}


module.exports={createUser}