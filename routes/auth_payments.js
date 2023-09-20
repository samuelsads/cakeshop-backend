/**
 * api/payments
 */

const {Router, response} = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { createPayment, allPaymentsByOrder } = require('../controllers/auth_payments');


const router = Router();


router.post("/new",[validarJWT],createPayment );

router.get("/all",[validarJWT],allPaymentsByOrder );

module.exports  = router;