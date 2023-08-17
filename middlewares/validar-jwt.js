const jwt  = require('jsonwebtoken');


const validarJWT= (req, res = response, next)=>{

    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            status:false,
            msg:'Error'
        });
    }


    try {

        const {uid}  = jwt.verify(token, process.env.JWT_KEY);


        req.uid = uid;
        
        next(); 
    } catch (error) {
        return res.status(401).json({
            status:false,
            msg:'Token no valido'
        });
    }


    
}


module.exports={
    validarJWT
}