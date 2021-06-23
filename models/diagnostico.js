const {Schema, model}  = require('mongoose');

const diagnosticoSchema = new Schema({

    idLatencia: { type: Schema.ObjectId, ref: "Latencia" } ,
    estadistica: String,
    falla:Boolean,
    idRecomendacion: { type: Schema.ObjectId, ref: "Recomendacion" },
    QoE: String // Sera un string tipo json { HTTP: true, SMTP: true, REDSOCIAL: true, PELICULAS: false, RTSP: false, JUEGOS: false}
});

module.exports = model('Diagnostico', diagnosticoSchema);
