const {Schema, model}  = require('mongoose');

const parametrosSchema = new Schema({
    
    fechaInicio: Date,
    fechaFin: Date,
    numClientes: Number,
    tiempoSeg: Number,
    tamanioPaquete: Number,
    URL: String
});

module.exports =  model('Parametros', parametrosSchema);