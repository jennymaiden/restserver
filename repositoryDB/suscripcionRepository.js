const  Suscripcion  = require("../models/Suscripcion");

/**
 * Guardar la suscripcion*/
const guardarSuscripcion= async(suscripcionModelo)=>{
    const suscripcionDB = await Suscripcion.save(suscripcionModelo);
    if (!suscripcionDB){
        throw new Error('No se pudo guardar la suscripcion en la BD');
    }
    return suscripcionDB;

}

module.exports = {
    guardarSuscripcion
}
