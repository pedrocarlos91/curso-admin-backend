const Medico = require('../models/medicos');
const Hospital = require('../models/hospitales');
const { response } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const getMedicos = async (req, res) => {
    const medicos = await Medico.find({}, 'nombre img usuario')
                                .populate('usuario', 'nombre email img')
                                .populate('hospital', 'nombre img');
    
    res.json({
        status: 'success',
        medicos
    })
}

const crearMedico = async (req, res) => {
    const {nombre, hospital} = req.body;
    const uid = req.uid;
    const medico = new Medico ({
        usuario: uid,
        ...req.body
    });
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
    const uid = req.uid;
    const id = req.params.id;


    try {
        const medico = await Medico.findById(id);
        if(!medico) {
            res.status(404).json({
                status: 'error',
                message: 'Este medico no existe'
            });
        }

        const cambios = {
            ...req.body,
            usuario: uid
        }

        if(cambios.hospital) {
            const hospital = await Hospital.findById(cambios.hospital);
            if(!hospital) {
                res.status(404).json({
                    status: 'error',
                    message: 'Este hospital no existe'
                });
            }
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambios, {new: true});
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
    const id = req.params.id;
    try {
        const medicoId = await Medico.findById(id);
        if(!medicoId) {
            res.status(404).json({
                status: 'error',
                message: 'Este medico no existe'
            });
        }

        
        const medicoDeleted = await Medico.findByIdAndDelete(id);
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