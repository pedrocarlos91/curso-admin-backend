const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const { validarJWT } = require('../middlewares/validar-jwt');

const getUsuarios = async (req, res) => {
    const desde = Number(req.query.desde) || 0;
    // const usuarios = await Usuario
    //                     .find({}, 'nombre email role google ')
    //                     .skip(desde)
    //                     .limit(5);
    
    // const total = await Usuario.count();

    const [usuarios, total] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip(desde)
            .limit(5),
        Usuario.count()
    ]);

    res.json({
        status: 'success',
        usuarios: usuarios,
        uid: req.uid,
        total
    })
}

const crearUsuario = async (req, res) => {
    const {email, password, nombre} = req.body;
    const usuario = new Usuario (req.body);
    try {
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        await usuario.save();
        const token = await generarJWT(usuario.id);
        res.json({
            status: 'success',
            usuario,
            token
        });
    } catch (error) {
        res.status(403).json({
            status: 'error',
            message: error.message
        });
    } 
}

const actualizarUsuario = async(req, res = response) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB) {
            res.status(404).json({
                status: 'error',
                message: 'Este usuario no existe'
            });
        }

        const campos = req.body;
        delete campos.password;
        delete campos.google;
        if (usuarioDB.google) {
            delete campos.email;
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});
        res.json({
            status: 'success',
            usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const deleteUsuario = async(req, res = response) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB) {
            res.status(404).json({
                status: 'error',
                message: 'Este usuario no existe'
            });
        }

        
        const usuarioDeleted = await Usuario.findByIdAndDelete(uid);
        res.json({
            status: 'success',
            usuarioDeleted
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    deleteUsuario
}