/**
 * En este controlador realizaremos el llamado a el submodulo de diagnostico,
 * todo lo que tiene que ver con la consulta del diagnostico
 * la creacion de la aggregacion para traer toda la informacion que se requiera para mostrar el diagnostico
 * y las consultas necesarias y el servicio de graficar ya sea en tiempo real o en programado*/
const { response, request } = require('express');
const  Diagnostico  = require("../models/diagnostico");
const { obtenerRecomendacion } = require('../repositoryDB/recomendacionRepository');
const {listarMuestrasByParametro,
    obtenerDiagnostico,
    obtenerParametros,
    crearDiagnostico } = require('../microservices/diagnosticoService');
const { obtenerUltimaLatencia } = require("../microservices/graficaService");
const { getLatencia } = require('../repositoryDB/latenciaRepository');

/**
 * Servicio de mostrar el diagnostico
 * SE DEBE CREAR UNA AGREGACIÓN ENTRE PARAMETROS, LATENCIA, MUESTRA, DIAGNOSTICO
 * TABLA: listar las muestras si alguna tiene mensaje de error o no
 * RESUMEN: mostrar el diagnostico las posibles fallas y las soluciones que se pueden dar
 */
const verDiagnostico = async(req= request, res = response) =>  {
    console.log(' *********** verDiagnostico ************');
    try{
        const idLatencia = req.params.idLatencia;
        console.log('verDiagnostico :: idlatencia '+idLatencia);
        if (idLatencia !== void 0 && idLatencia !== 'undefined'){
            console.log('entro aqui +');
            latencia = await getLatencia(idLatencia);
        }else {
            console.log('entro aqui --');
            latencia = await obtenerUltimaLatencia();
        }
        // console.log('objeto latencia :  '+latencia[0]._id);
        parametro = await obtenerParametros(latencia[0]._id);
        diagnostico = await obtenerDiagnostico(latencia[0]._id);

        if (diagnostico === null){
            diagnostico = await crearDiagnostico(latencia[0]._id);
        }
        // Buscar las recomendaciones
        recomendacion = await obtenerRecomendacion(diagnostico.idRecomendacion);

        console.log(' *********** FIN verDiagnostico ************');
        res.status( 200 ).json({
            msg: "OK",
            parametro,
            diagnostico,
            recomendacion
        });
    }catch (error) {
        // throw error;
        console.log(error);
        console.log(' *********** FIN ERROR verDiagnostico ************');
        res.status( 500 ).json({
            msg: 'ocurrio un error'
        });
    }
}

module.exports = {
    verDiagnostico
}
