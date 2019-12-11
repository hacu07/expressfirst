function authorize(roles = []){
    // Si el parametro que se envio es un string y no un arreglo
    if(typeof roles === 'string'){
        roles = [roles] // lo convierte en arreglo
    }

    return[
        (req, res, next) =>{
            if(!roles.includes(req.user.role)) return res.status(403).send('No tienes el Rol Permitido para acceder a este recurso')
            next()
        }
    ]
}

module.exports = authorize