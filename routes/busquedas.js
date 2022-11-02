/**
 * Ruta /api/todo
 * 
 */

const {Router} = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {getTodo, getDocumentosConleccion} = require('../controllers/busquedas');

const router = Router();

router.get('/:busqueda', validarJWT, getTodo);
router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosConleccion);

module.exports = router;