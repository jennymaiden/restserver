/**
 * Repositorio de las consultas que se realizaran a la colección de latencia*/
const  Latencia  = require("../models/latencia");

/**
 * Obtener el objeto latencia por el id*
 * */
const getLatencia = async (idLatencia)=>{
    const latencia =await Latencia.findById(idLatencia);
    if(!latencia){
        throw new Error('El id de la latencia no esta en la BD');
    }
    return latencia;
}

module.exports={
    getLatencia
}
