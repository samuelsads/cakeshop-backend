/**
 * api/orders
 */


const {Router, response} = require('express');
const { check } = require('express-validator');
const { createOrder, updateOrder, deleteOrder, allOrders } = require('../controllers/auth_orders');
const { validarJWT } = require('../middlewares/validar-jwt');
const { updateClient } = require('../controllers/auth_clients');

const router  = Router();


router.post('/new',[validarJWT],createOrder);

router.patch('/update',[validarJWT],updateOrder);

router.delete('/delete',[validarJWT],deleteOrder);

router.get('/all',[validarJWT],allOrders);

module.exports  = router;