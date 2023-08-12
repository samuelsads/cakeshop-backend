/**
 * api/login
 */

const {Router, response}= require('express');
const { createUser } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateInputs } = require('../middlewares/validate-inputs');


const router = Router();

router.post('/new',[
    check('name','name is required').not().isEmpty(),
    check('surname','surnames is required').not().isEmpty(),
    check('email','email is required').isEmail(),
    check('password','password is required').not().isEmpty(),
    check('role','role is required').not().isEmpty(),
    validateInputs
],createUser);

module.exports=router;