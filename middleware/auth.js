// Valia que el token obtenido del cliente es correcto
const jwt = require('jsonwebtoken')

function auth(req,res,next){
    // obtiene token enviado por el cliente
    const jwtToken = req.header('Authorization')
    // si no lo envio...
    if(!jwtToken) return res.status(401).send('Acceso denegado. No token.')

    try{
        // verifica el token (ingresa semilla como segundo parametro almacenada en variable de entorno)
        const payload = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT_CAR_API)

        req.user = payload
        next() // lama al siguiente middleaware
    }catch(e){
        res.status(400).send('Acceso denegado. Token no valido.')
    }
}

module.exports = auth