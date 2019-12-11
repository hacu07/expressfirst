const { ReplSet } = require('mongodb-topology-manager'); /**/
const mongoose = require('mongoose')    // para MongoDB
const express = require('express')      // para peticiones
const app = express()
const car = require('./routes/car')
const user = require('./routes/user')
const company = require('./routes/company')
const sale = require('./routes/sale')
const auth = require('./routes/auth')
//Para usar los datos de tipo JSON -- IMPORTANTE
app.use(express.json());
// cada vez que usa el modulo car indica el endpoint direccionandolo a los metodos de car.js, user.js, etc.
app.use('/api/cars/', car)
app.use('/api/user/', user)
app.use('/api/company/', company)
app.use('/api/sale/', sale)
app.use('/api/auth/', auth)
const port = process.env.PORT || 3004
app.listen(port, () => console.log('Escuchando puerto:' +port))

run().catch(error => console.error(error));

//Conecta a BD - Devuelve una promise
/*mongoose.connect('mongodb://localhost/carsdb',{useNewUrlParser:true, useFindAndModify:false, useCreateIndex: true})
    .then( ()=>console.log('Conectado a MongoDB') )
    .catch( erro => console.log('No se ha conectado a MongoDB') )*/

/*
mongoose.connect('mongodb://127.0.0.1:27017/?replicaSet=rs0',{useNewUrlParser:true, useFindAndModify:false, useCreateIndex: true})
    .then( ()=>console.log('Conectado a MongoDB'))
    .catch( erro => console.log(erro) )
    */

async function run() {
    console.log(new Date(), 'start');
    const bind_ip = '127.0.0.1';
    // name is "rs0".
    const replSet = new ReplSet('mongod', [
        { options: { bind_ip: bind_ip, port: port, dbpath: './db-1' } }
    ], { replSet: 'rs0' });

    // Initialize the replica set
    console.log("inicia purga ");
    await replSet.purge();
    await replSet.start();
    console.log(new Date(), 'Replica set started...');

    const uri = 'mongodb://'+bind_ip+':'+ port +'/carsdb    ';
    mongoose.connect(uri,{useNewUrlParser:true, useFindAndModify:false, useCreateIndex: true})
    .then( ()=>{
            console.log('Conectado a MongoDB')            
        }
    )
    .catch( erro => console.log(erro) )
}