function date(req,res,next){
    console.log("Time:", Date.now())
    next()
}

// exporta para uso en otros archivos
module.exports = date