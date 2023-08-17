
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


        const token = await generarJWT(user.id);

        res.json({success:true,   user, token});
    } catch (error) {
        res.status(500).json({status:false, msg:'Hable con el administrador'});
    }
}


const login=async(req, res= response)=>{

    const {email, password} =req.body;

    try {   
        const userDB = await User.findOne({email});

        if(!userDB){
            return res.status(404).json({
                status:false,
                msg:'Error al iniciar sesión'
            });
        }


        const validPassword  = bcrypt.compareSync(password, userDB.password);

        if(!validPassword){
            return res.status(404).json({
                status:false,
                msg:'Error al iniciar sesión'
            });
        }
        
        const token = await generarJWT(userDB.id);
        
        return res.json({success:true,   user:userDB, token});

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status:false,
            msg:'Hable con el administrador'
        });
    }
}



const renewToken  = async(req, res = response)=>{

    try {
        const {uid}  = req;
        const userDB = await User.findById(uid);


        if(!userDB){
            return res.status(404).json({
                status:false,
                msg:'Error al iniciar sesión'
            });
        }
        


        const token = await generarJWT(userDB.id);

        return res.json({success:true,   user:userDB, token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status:false,
            msg:'Hable con el administrador'
        });
    }

   
}


module.exports={createUser, login, renewToken}