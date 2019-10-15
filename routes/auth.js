
const bcrypt = require('bcrypt')
const mongoose = require("mongoose")
const express = require('express')
const User = require('../models/user')
// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');

// LOGIN

router.post('/', [   
    // validacion de datos con "express-validator"
    check('email').isEmail(),                // Si es un correo
    check('password').isLength({min: 3})
], async (req, res)=>{
    // Valida si ocurrio alun error en la validacion
    const errors = validationResult(req);
    if(!errors.isEmpty()){ // encontro errores
        return res.status(422).json(
                { errors: errors.array()}
            );
    }

    const msjError = "Usuario o contraseña incorrectos"

    //  busca por email
    let user = await User.findOne({email: req.body.email})
    //  No existe email
    if(!user) return res.status(400).send(msjError)

    // valida la contraseña: retorna true si es igual
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    // no es igual
    if(!validPassword) return res.status(400).send(msjError)

    // Genera JWT
    const jwtToken = user.generateJWT()

    res.status(201)
    .header('Authorization',jwtToken)   // envia token en el header en modo clave: valor
    .send({                             // retorna respuesta con parametros en body
        _id: user._id,
        name: user.name,
        email: user.email
    })
})

module.exports = router