/**
 * api/clients
 */



const {Router, response} = require('express');
const {check} = require('express-validator');
const { createClient, updateClient, deleteClient, allClient, searchClient, findById } = require('../controllers/auth_clients');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validateInputs } = require('../middlewares/validate-inputs');

const router = Router();


router.post('/new',[validarJWT,
    check('name','name is required').not().isEmpty(),
check('father_surname','father surname is required').not().isEmpty(),validateInputs], createClient);

router.patch('/update',[    
    check('name','name is required').not().isEmpty(),
    check('father_surname','father surname is required').not().isEmpty(),
    check('uid','uid is required').not().isEmpty(),
    validarJWT,validateInputs], updateClient);

router.delete('/delete',[    
    check('uid','uid is required').not().isEmpty(),
    validarJWT,
    validateInputs
], deleteClient);


router.get('/all',[    
    validarJWT,
], allClient);

router.get('/findById',[validarJWT], findById);


router.get('/search',[validarJWT], searchClient)

module.exports = router;