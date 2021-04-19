const {Schema, model}  = require('mongoose');

const recomendacionSchema = new Schema({

    falla: String,
    causa: String,
    solucion: String
});

module.exports = model('Recomendacion', recomendacionSchema);
