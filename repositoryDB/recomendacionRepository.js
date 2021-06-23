const  Recomendaciones  = require("../models/recomendacione");

/**
 * Consultar la coleccion de recomendaciones por la falla*/
const obtenerRecomengacionByFalla = async(fallaP)=>{
    let recomendacionDB = await Recomendaciones.find({ falla: fallaP},
        function (err, docs) {
            if (err){
                throw new Error('Ocurrio un error en la consulta ${err}');
            }

        });

    return recomendacionDB;
}

const obtenerRecomendacion =  async (idRecomendacion)=>{

    const recomendacionData =await Recomendaciones.findById(idRecomendacion);
    if(!recomendacionData){
        throw new Error('Ocurrio un error en la consulta obtenerRecomendacion');
    }
    return recomendacionData;
}

module.exports= {
    obtenerRecomengacionByFalla,
    obtenerRecomendacion
}
