const Hospital = require('../models/hospitales');
const { response } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const getHospitales = async (req, res) => {
    const hospitales = await Hospital.find({}, 'nombre img usuario');
    
    res.json({
        status: 'success',
        hospitales
    })
}

const crearHospital = async (req, res) => {
    const {nombre} = req.body;
    const hospital = new Hospital (req.body);
    try {

        await hospital.save();
        res.json({
            status: 'success',
            hospital
        });
    } catch (error) {
        res.status(403).json({
            status: 'error',
            message: error.message
        });
    } 
}

const actualizarHospital = async(req, res = response) => {
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
        delete campos.email;

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

const deleteHospital = async(req, res = response) => {
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    deleteHospital
}