const {Schema, model}  = require('mongoose');

const latenciaSchema =  Schema({
    
    _id: ObjectId,
    muestra: [{ type: Schema.ObjectId, ref: "Muestra" }],
    idParametros: { type: Schema.ObjectId, ref: "Parametros" } 
});

module.exports = model("Latencia", latenciaSchema);