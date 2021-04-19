/**
 * En este controlador realizaremos el llamado a el submodulo de diagnostico,
 * todo lo que tiene que ver con la consulta del diagnostico
 * la creacion de la aggregacion para traer toda la informacion que se requiera para mostrar el diagnostico
 * y las consultas necesarias y el servicio de graficar ya sea en tiempo real o en programado*/
const { response, request } = require('express');
const {listarMuestras, obtenerDiagnostico, obtenerParametros} = require('../microservices/diagnosticoService');


/**
 * Servicio de mostrar el diagnostico
 * SE DEBE CREAR UNA AGREGACIÓN ENTRE PARAMETROS, LATENCIA, MUESTRA, DIAGNOSTICO
 * TABLA: listar las muestras si alguna tiene mensaje de error o no
 * RESUMEN: mostrar el diagnostico las posibles fallas y las soluciones que se pueden dar
 */
const verDiagnostico = (req= request, res = response) =>  {
    const idLatencia = req.params.idLatencia;

    res.status( 200 ).json({
        msg: "get API",
        parametros: obtenerParametros(idLatencia),
        diagnostico: obtenerDiagnostico(idLatencia),
        muestras: listarMuestras(idLatencia)
    });
}

module.exports = {
    verDiagnostico
}