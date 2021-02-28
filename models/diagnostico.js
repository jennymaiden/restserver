const {Schema, model}  = require('mongoose');

const diagnosticoSchema = new Schema({
    _id: ObjectId,
    idLatencia: { type: Schema.ObjectId, ref: "Latencia" } ,
    mensaje: String,
    fecha: Date
});

module.exports = model('Diagnostico', diagnosticoSchema);