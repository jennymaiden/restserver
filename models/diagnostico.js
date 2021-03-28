const {Schema, model}  = require('mongoose');

const diagnosticoSchema = new Schema({
    _id: ObjectId,
    idLatencia: { type: Schema.ObjectId, ref: "Latencia" } ,
    estadistica: String,
    causa: String,
    solucion: String,
});

module.exports = model('Diagnostico', diagnosticoSchema);