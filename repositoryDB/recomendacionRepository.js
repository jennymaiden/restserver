const  Recomendaciones  = require("../models/recomendacione");

/**
 * Consultar la coleccion de recomendaciones por la falla*/
const obtenerRecomengacionByFalla = async(fallaP)=>{
    try{
        const recomendacionDB = await Recomendaciones.find({ falla: fallaP},
            function (err, docs) {
                if (err){
                    throw new Error('Ocurrio un error en la consulta ' + err);
                }
                return docs;
            });

        return recomendacionDB;
    }catch (error){
        return error;
    }
}

const obtenerRecomendacion =  async (idRecomendacion)=>{

    try{
        const recomendacionData =await Recomendaciones.findById(idRecomendacion);
        if(!recomendacionData){
            throw new Error('Ocurrio un error en la consulta obtenerRecomendacion');
        }
        return recomendacionData;

    }catch (error){
        return error;
    }
}

module.exports= {
    obtenerRecomengacionByFalla,
    obtenerRecomendacion
}
