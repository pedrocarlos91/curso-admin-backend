const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await Usuario.findOne({email});
            if (!user) {
            return res.status(404).json({
                status: error,
                message: 'Usuario o contraseña no válidos'
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(404).json({
                status: error,
                message: 'Usuario o contraseña no válidos'
            });
        }

        const token = await generarJWT(user.id);

        res.json({
            status: 'success',
            token
        })

    } catch (error) {
        res.status(403).json({
            status: 'error',
            message: error.message
        });
    } 
}

const googleSignIn = async (req, res) => {

    try {
        const { email, name, picture } = await googleVerify(req.body.token);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if( !usuarioDB ) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            status: 'success',
            email, name, picture,
            token
        });

    } catch(error) {
        console.log(error);
        res.status(400).json({
            status: 'error',
            message: 'Token Google no correcto'
        });
    }
    
}

const renewToken = async(req, res = response) => {
    const uid = req.uid;
    const token = await generarJWT(uid.id);

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}