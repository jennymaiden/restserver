
const {Schema, model}  = require('mongoose');

const suscripcionSchema = new Schema({
    auth : String, //La llave publica que necesito para la suscripción
    p256dh : String,
    endpoint : String
});

module.exports = model('Suscripcion', suscripcionSchema);
