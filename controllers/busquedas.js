const { response } = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medicos');
const Hospital = require('../models/hospitales');

const getTodo = async(req, res) => {
    const todo = req.params.busqueda;
    const regex = new RegExp(todo, 'i');
    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({nombre: regex}),
        Medico.find({nombre: regex}),
        Hospital.find({nombre: regex})
    ]);

    res.json({
        status: 'success',
        usuarios,
        medicos,
        hospitales
    });
}

const getDocumentosConleccion = async(req, res) => {
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'medicos': 
            data = await Medico.find({nombre: regex}).populate('usuario', 'nombre img').populate('hospital', 'nombre img');
            break;
        case 'hospitales': 
            data = await Hospital.find({nombre: regex}).populate('usuario', 'nombre img');
            break;
        case 'usuarios': 
            data = await Usuario.find({nombre: regex});
            break;
        default: 
            return res.status(400).json({
                status: 'error',
                message: 'La tabla solo puede ser usuarios/medicos/hospitales'
            });
    }

    return res.status(200).json({
        status: 'success',
        resultados: data
    });
}

module.exports = {
    getTodo,
    getDocumentosConleccion
}