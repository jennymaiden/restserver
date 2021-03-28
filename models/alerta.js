
const {Schema, model}  = require('mongoose');

const alertaSchema = new Schema({
    _id: ObjectId,
    idLatencia: { type: Schema.ObjectId, ref: "Latencia" } ,
    mensaje: String,//El nombre de la alerta que genera la terminación de una muestra
    fecha: Date, //Fecha en que finaliza la muestra y arroja la muestra, es decir, la fecha en que se crea el alerta
    estado: { type: Schema.Boolean, ref: false }, //True si falla y false si fue exitoso (Mostrar el idono en verde o rojo en caso de falla)
    leido: { type: Schema.Boolean, ref: false } //True si leyo ya alerta y false si a un no lo ha echo
});

module.exports = model('Alerta', alertaSchema);