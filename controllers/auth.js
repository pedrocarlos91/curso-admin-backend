const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

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

module.exports = {
    login
}