const express = require('express')
const Company = require('../models/company')
// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');

// Se creo modelo en models/company.js

// retorna todos los documentos obtenidos de la coleccion company 
router.get('/',async (req,res)=>{
    // 'companies' = almacena los documentos coches obtenidos de la BD
    const companies = await Company.find()
    res.send(companies)

});


// retorna documento segun id enviado por parametro
router.get('/:id', async (req,res)=>{
    const company = await Company.findById(req.params.id)   // Busca el documento por parametro id obtenido
    // si no existe...
    if(!company){
        return res.status(404).send('No hemos encontrado compañia por ese ID')
    }
    // Existe...
    res.send(company)
})


/****************************
 * METHOD: POST
 * se obtiene los parametros por req.body
 * *****************************/

/*
    Validacion de datos enviados por parametros
    con  "express-validator"
*/
router.post('/', [   
    // validacion de datos con "express-validator"
    check('name').isLength({min:1}),          // valida 
    check('country').isLength({min:2})          // mayor a 2 caracteres
], async (req, res)=>{
    // Valida si ocurrio alun error en la validacion
    const errors = validationResult(req);
    if(!errors.isEmpty()){ // encontro errores
        return res.status(422).json(
                { errors: errors.array()}
            );
    }

    //  si continua, no encontro error
    // guarda compañia en BD

    // crea objeto con datos tomados de los parametros enviados por el cliente
    const company = new Company({
        name: req.body.name,
        country: req.body.country
    })
    // guarda en bd
    const result = await company.save()

    res.status(201).send(result)
})

/*
                METHOD: PUT
    Validacion de datos enviados por parametros
    con  "express-validator"
*/
router.put('/:id', 
[   // validacion de datos con "express-validator"
    check('name').isLength({min:1}),          // valida 
    check('country').isLength({min:2})          // mayor a 2 caracteres
], async (req, res)=>{
    // Valida si ocurrio alun error en la validacion
    const errors = validationResult(req);
    if(!errors.isEmpty()){ // encontro errores
        return res.status(422).json(
                { errors: errors.array()}
            );
    }

    //  Documentacion https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    //  Valida si existe en el array el coche con el id enviado por parametros
    //  y actualiza si lo encuentra
    const company = await Company.findByIdAndUpdate(req.params.id,{
        // campos a actualizar
        name: req.body.name,
        country: req.body.country
    }, {
        new: true   // Devuele el documento con datos modificados
    })

    if(!company){ // si no encontro la compañia por id en la bd
        return res.status(404).send('La compañia con ese ID no existe.');
    }

    //  si continua, no encontro error
    //  retorna respuesta
    res.status(204).send()
})

/*********************************************
 *                  METHOD: DELETE
 * ***************************************** */
router.delete('/:id', async (req,res)=>{

    //  Valida si existe en la BD la compañia con el id enviado por parametros
    const company = await Company.findByIdAndDelete(req.params.id);

    if(!company){ // no encontro el coche por id en la bd
        return res.status(404).send('La compañia a borrar con ese ID no esta.');
    }

    res.status(200).send("compañia borrada")
})

/* EXPORTA EL MODULO */
module.exports =  router