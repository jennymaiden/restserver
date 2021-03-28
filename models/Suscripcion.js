
const {Schema, model}  = require('mongoose');

const suscripcionSchema = new Schema({
    _id: ObjectId,
    llavePublica : String, //La llave publica que necesito para la suscripción
    llavePrivata : String,
    endpoint : String
});

module.exports = model('Suscripcion', suscripcionSchema);