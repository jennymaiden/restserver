const {Schema, model}  = require('mongoose');

const parametrosSchema = new Schema({
    
    fechaInicio: Date,
    horaInicio: String,
    fechaFin: Date,
    horaFin: String,
    numClientes: Number,
    tiempoSeg: Number,
    tamanioPaquete: Number,
    URL: String
});

module.exports =  model('Parametros', parametrosSchema);