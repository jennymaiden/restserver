/**
 * Repositorio de las consultas que se realizaran a la colección de latencia*/
const  Latencia  = require("../models/latencia");

/**
 * Obtener el objeto latencia por el id*
 * */
const getLatencia = async (idLatencia)=>{
    try{
        const latenciaData =await Latencia.findById(idLatencia, function (err,data) {
            if (err){
                throw new Error('Ocurrio un error en la consulta getLatencia ' + err);
            }
            // console.log('la latencia es : '+data);
            return data;
        });
        return latenciaData;
    }catch (error){
        return error;
    }

}

/**
 *  Obtener la ultima latencia */
const getLastLatencia = async () => {
    try{
        const response = await Latencia.find().sort({$natural:-1}).limit(1);
        return response;
    }catch (error){
        return error;
    }
}

module.exports={
    getLatencia,
    getLastLatencia
}
