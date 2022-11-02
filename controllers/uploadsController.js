const path = require('path');
const fs = require('fs');

const {response} = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizaImagen } = require('../helpers/actualizar-image');

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            status: 'error',
            message: 'Este no es un tipo valido'
        });
    }

    // Se valida que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
                                    status: 'error',
                                    message: 'No se encontró ningún archivo'
                                });
    }

    // Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extension = nombreCortado[nombreCortado.length -1];

    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extension)){
        return res.status(400).json({
            status: 'error',
            message: 'Este no es una imágen válida'
        });
    }


    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extension }`;
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    file.mv(path, function(err) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                status: 'error',
                message: 'Hubo un error al mover la imágen'
            });
        }

        actualizaImagen(tipo, id, nombreArchivo);
            
        res.status(200).json({
            status: 'success',
            message: 'Archivo subido',
            nombreArchivo
        });
    });
}

const retornaImagen = (req, res) => {
    const tipo = req.params.tipo;
    const imagen = req.params.imagen;

    const pathImg = path.join( __dirname, `../uploads/${tipo}/${imagen}` );

    //imagen por defecto
    if(fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(path.join(__dirname, `../uploads/no-img.jpg`));
    }
}

module.exports = {
    fileUpload,
    retornaImagen
}