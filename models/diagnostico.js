const {Schema, model}  = require('mongoose');

const diagnosticoSchema = new Schema({

    idLatencia: { type: Schema.ObjectId, ref: "Latencia" } ,
    estadistica: String,
    falla:String,
    idRecomendaciones: { type: Schema.ObjectId, ref: "Latencia" }
});

module.exports = model('Diagnostico', diagnosticoSchema);
