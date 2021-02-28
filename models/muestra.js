const {Schema, model}  = require('mongoose');

const muestraSchema = new Schema({
    
    NumeroPaquete: Number,
    tiempoRespuesta: Number,
    TTL: Number,
    tamanio: Number,
    msgError: String
});

module.exports = model('Muestra', muestraSchema);