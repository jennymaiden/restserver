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
module.exports= {
    obtenerRecomengacionByFalla
}
