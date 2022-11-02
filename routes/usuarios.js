/**
 * Ruta /api/usuarios
 * 
 */


const {Router} = require('express');
const {check} = require('express-validator');
const {getUsuarios, crearUsuario, actualizarUsuario, deleteUsuario} = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);
router.post('/', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La password es obligatoria').not().isEmpty(),
        validarCampos
    ],
 crearUsuario);

router.put('/:id', 
[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El rol es obligatorio').not().isEmpty(),
    validarCampos
], 
actualizarUsuario);

router.delete('/:id', validarJWT, deleteUsuario);

module.exports = router;