/**
 * Controlador para mostrar la grafica segun la ultima
 * muestra de latencia tomada */
const { response, request } = require('express');
const { obtenerUltimaLatencia } = require("../microservices/graficaService");
const {listarMuestrasByParametro,
    ordenarMuestrasByCliente} = require('../microservices/diagnosticoService');
const Latencia = require("../models/latencia");
const { getLatencia } = require('../repositoryDB/latenciaRepository');



const verGrafica = async(req= request, res = response) =>  {

    //Consultar la ultima latencia tomada
    try {
        //Validamos si llega el idLatencia en los parametros
        const idLatencia = req.params.idLatencia;
        console.log('verGrafica :: idlatencia '+idLatencia);

        if (idLatencia !== void 0 && idLatencia !== 'undefined'){
            console.log('entro aqui *****');
            latencia = await getLatencia(idLatencia);
        }else {
            console.log('entro aqui +++++');
            latencia = await obtenerUltimaLatencia();
        }

        const listMuestras = await listarMuestrasByParametro(latencia[0].idParametros);
        const arreglo = ordenarMuestrasByCliente(listMuestras);
        res.status( 200 ).json({
            msg: "OK",
            latencia,
            arreglo
        });
    }catch (error) {
        // throw error;
        res.status( 500 ).json({
            msg: error
        });
    }

    // obtenerUltimaLatencia()
    //     .then(latencia =>{
    //         console.log('la latencia es : '+latencia.idParametros);
    //         return listarMuestrasByParametro1(latencia.idParametros);
    //
    //     })
    //     .then(listMuestras => {
    //         const arreglo = ordenarMuestrasByCliente(listMuestras);
    //         res.status( 200 ).json({
    //             msg: "get API verGrafica",
    //             muestras : arreglo
    //         });
    //     })
    //     .catch( err => {
    //         res.status( 500 ).json({
    //             msg: err
    //         });
    //     });

}

module.exports = {
    verGrafica
}
