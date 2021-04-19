/**
 * En este archivo de repositorio de graficas se manejaran los queries necesarios para
 * consultar la información a mostrar en las grafícas**/
const  Latencia  = require("../models/latencia");
const  Muestra  = require("../models/muestra");

/**
 * Consulta por el id de la latecia traer el array o la lista de los id de las muestras**/
const  arrayIdMuestras = async(idLatencia)=>{
    const latencia = await Latencia.findById(idLatencia);
    if (!latencia){
        throw new Error('El id de la latencia no esta en la BD');
    }
    return latencia.muestra;

}

/**
 * Consulta por id a la muestra para traer todos los objetivos **/
const obtenerMuestra = async (idMuestra)=>{
    const muestra =await Muestra.findById(idMuestra);
    if(!muestra){
        throw new Error('El id de la muestra no esta en la BD');
    }
    return muestra;
}

module.exports={
    arrayIdMuestras,
    obtenerMuestra
}