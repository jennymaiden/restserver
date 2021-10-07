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

/**w
 * Filtrar en la colección de muestras por el idParametro para
 * traer todas las muestras relacionadas **/
async function  listMuestrasByParametro (idParametro){
    console.log('el id parametro es ',idParametro);
    const muestrasList = await Muestra.find({ idParametros: idParametro},
        function (err, data) {
            if (err){
                throw new Error('Ocurrio un error en la consulta listMuestrasByParametro ${err}');
            }
            // console.log('muestras ... '+data);
            return data;

        });

    return muestrasList;
}

const listMuestrasByParametro1 = async (idParametro)=>{
    console.log('el id parametro es ',idParametro);
    const muestras = await Muestra.aggregate([{ $match: { 'idParametros': idParametro } }]);
    if(!muestras){
        throw new Error('El id del parametro no corresponde  no esta en la BD');
    }
    return muestras;
}

module.exports={
    arrayIdMuestras,
    obtenerMuestra,
    listMuestrasByParametro,listMuestrasByParametro1
}
