const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if(!token) {
        return res.status(401).json({
            status: 'error',
            message: 'No se encontró la autorización'
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;

        next();

    } catch(error) {
        return res.status(401).json({
            status: 'error',
            message: 'Token no válido'
        })
    }
    
}

module.exports = {
    validarJWT
}