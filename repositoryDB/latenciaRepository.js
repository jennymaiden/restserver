/**
 * Repositorio de las consultas que se realizaran a la colección de latencia*/
const  Latencia  = require("../models/latencia");

/**
 * Obtener el objeto latencia por el id*
 * */
const getLatencia = async (idLatencia)=>{

    const latenciaData =await Latencia.findById(idLatencia, function (err,data) {
        if (err){
            throw new Error('Ocurrio un error en la consulta getLatencia ${err}');
        }
        // console.log('la latencia es : '+data);
        return data;
    });
    return latenciaData;
}

/**
 *  Obtener la ultima latencia */
const getLastLatencia = async () => {
    const response = await Latencia.find().sort({$natural:-1}).limit(1);
    return response;
}

module.exports={
    getLatencia,
    getLastLatencia
}
