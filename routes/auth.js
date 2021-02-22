/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario, loginUsuario, revalidarToken, subscribeUsuario } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.post(
    '/register', 
    [
        check('username', 'El nickname es obligatorio').not().isEmpty(),
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'La clave debe de ser de 6 caracteres').isLength({ min: 6 }),
        check('genderId', 'El género es obligatorio').isNumeric(),
        validarCampos
    ],
    crearUsuario 
);

router.post(
    '/login',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        check('roomId', 'La sala es obligatorio').isNumeric(),
        validarCampos
    ],
    loginUsuario 
);

router.post(
    '/subscribe',
    [],
    subscribeUsuario 
);


router.get('/renew', validarJWT ,revalidarToken );




module.exports = router;