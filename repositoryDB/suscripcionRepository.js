const  Suscripcion  = require("../models/Suscripcion");

/**
 * Guardar la suscripcion*/
const guardarSuscrip= async(suscripcionModelo)=>{
    //Borrar las suscripciones que haigan
    await Suscripcion.deleteMany();
    //Guardar el actual
    const suscripcionDB = await suscripcionModelo.save();
    if (!suscripcionDB){
        throw new Error('No se pudo guardar la suscripcion en la BD');
    }
    return suscripcionDB;

}

/**
 * Consultar el la suscripción*/
async function  obtenerSuscripcion (){
    const suscripcionDB = await Suscripcion.find(
        function (err, data) {
            if (err){
                throw new Error('Ocurrio un error en la consulta obtenerSuscripcion ${err}');
            }
            return data;

        });

    return suscripcionDB;

}

module.exports = {
    guardarSuscrip,
    obtenerSuscripcion
}
