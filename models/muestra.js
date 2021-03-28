const {Schema, model}  = require('mongoose');

const muestraSchema = new Schema({
    
    NumeroPaquete: Number,
    tiempoRespuesta: Number,
    TTL: Number,
    tamanio: Number,
    numCliente: Number,
    msgError: String,
    idParametros: { type: Schema.ObjectId, ref: "Parametros" } 
});

module.exports = model('Muestra', muestraSchema);