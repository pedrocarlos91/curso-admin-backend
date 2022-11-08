const Hospital = require('../models/hospitales');
const { response } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const getHospitales = async (req, res) => {
    const hospitales = await Hospital.find().populate('usuario', 'nombre img');
    
    res.json({
        status: 'success',
        hospitales
    })
}

const crearHospital = async (req, res) => {
    const {nombre} = req.body;
    const uid = req.uid;
    const hospital = new Hospital ({
        usuario: uid,
        ...req.body
    });

    try {
        const hospitalCreada = await hospital.save();
        res.json({
            status: 'success',
            hospital: hospitalCreada
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({
            status: 'error',
            message: error.message
        });
    } 
}

const actualizarHospital = async(req, res = response) => {
    const hospitalId = req.params.id;
    const uid = req.uid;
    try {
        const hospital = await Hospital.findById(hospitalId);
        if(!hospital) {
            res.status(404).json({
                status: 'error',
                message: 'Este hospital no existe'
            });
        }

        const cambios = {
            ...req.body,
            usuario: uid
        }
        

        const hospitalActualizada = await Hospital.findByIdAndUpdate(hospitalId, cambios, {new: true});
        res.json({
            status: 'success',
            hospitalActualizada
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
    const hospitalId = req.params.id;
    try {
        const hospitalDB = await Hospital.findById(hospitalId);
        if(!hospitalDB) {
            res.status(404).json({
                status: 'error',
                message: 'Este usuario no existe'
            });
        }

        
        const hospitalDeleted = await Hospital.findByIdAndDelete(hospitalId);
        res.json({
            status: 'success',
            hospitalDeleted
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