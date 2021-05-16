/**
 * Repositorio de las consultas que se realizaran a la colección de parametros*/
const Parametro = require('../models/parametros');

/**
 * Obtener el objeto latencia por el id*
 * */
const getParametro = async (idParametro)=>{
    const parametroModel =await Parametro.findById(idParametro);
    if(!parametroModel){
        throw new Error('El id del parametro no esta en la BD');
    }
    return parametroModel;
}

module.exports={
    getParametro
}
