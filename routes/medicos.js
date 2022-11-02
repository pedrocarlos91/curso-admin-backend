/**
 * Ruta /api/medicos
 * 
 */


const {Router} = require('express');
const {check} = require('express-validator');
const { getMedicos, crearMedico, actualizarMedico, deleteMedico } = require('../controllers/medicos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getMedicos);
router.post('/', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('hospital', 'El hospital debe ser válido').isMongoId(),
        validarCampos
    ],
 crearMedico);

router.put('/:id', 
[
    
], 
actualizarMedico);

router.delete('/:id', validarJWT, deleteMedico);

module.exports = router;