const { validationResult } = require("express-validator");


const validateInputs = (req, res, next)=>{
    const errores = validationResult(req);


    if(!errores.isEmpty()){
     return res.status(400).json({
         success:false,
         msg:"Datos incompletos",
         errors:errores.mapped()
     });
    }

    next();
}


module.exports ={validateInputs}