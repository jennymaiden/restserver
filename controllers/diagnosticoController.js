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


/**
 * Servicio de mostrar el diagnostico
 * SE DEBE CREAR UNA AGREGACIÓN ENTRE PARAMETROS, LATENCIA, MUESTRA, DIAGNOSTICO
 * TABLA: listar las muestras si alguna tiene mensaje de error o no
 * RESUMEN: mostrar el diagnostico las posibles fallas y las soluciones que se pueden dar
 */
const verDiagnostico = async(req= request, res = response) =>  {
    try{
        const idLatencia = req.params.idLatencia;
        const parametro = await obtenerParametros(idLatencia);
        diagnostico = await obtenerDiagnostico(idLatencia);

        if (diagnostico.length == 0){
            diagnostico = await crearDiagnostico(idLatencia);
        }
        // Buscar las recomendaciones
        const recomendacion = await obtenerRecomendacion('60c9878d4ede7fab2a8683c7');
        console.log('la recomendacion es  :: '+recomendacion);

        res.status( 200 ).json({
            msg: "OK",
            parametro,
            diagnostico,
            recomendacion
        });
    }catch (error) {
        // throw error;
        res.status( 500 ).json({
            msg: error
        });
    }
}

module.exports = {
    verDiagnostico
}
