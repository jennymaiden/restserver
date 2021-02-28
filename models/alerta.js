
const {Schema, model}  = require('mongoose');

const alertaSchema = new Schema({
    _id: ObjectId,
    idLatencia: { type: Schema.ObjectId, ref: "Latencia" } ,
    mensaje: String,
    causa: String,
    solucion: String,
    fecha: Date,
    leido: { type: Schema.Boolean, ref: false }
});

module.exports = model('Alerta', alertaSchema);