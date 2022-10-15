const Medico = require('../models/medicos');
const { response } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const getMedicos = async (req, res) => {
    const medicos = await Medico.find({}, 'nombre img usuario');
    
    res.json({
        status: 'success',
        medicos
    })
}

const crearMedico = async (req, res) => {
    const {nombre} = req.body;
    const medico = new Medico (req.body);
    try {

        await medico.save();
        res.json({
            status: 'success',
            medico
        });
    } catch (error) {
        res.status(403).json({
            status: 'error',
            message: error.message
        });
    } 
}

const actualizarMedico = async(req, res = response) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Medico.findById(uid);
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

        const medicoActualizado = await Medico.findByIdAndUpdate(uid, campos, {new: true});
        res.json({
            status: 'success',
            medicoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const deleteMedico = async(req, res = response) => {
    const uid = req.params.id;
    try {
        const medico = await Meidico.findById(uid);
        if(!medico) {
            res.status(404).json({
                status: 'error',
                message: 'Este medico no existe'
            });
        }

        
        const medicoDeleted = await Medico.findByIdAndDelete(uid);
        res.json({
            status: 'success',
            medicoDeleted
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    deleteMedico
}