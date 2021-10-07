/**
 * Controlador para mostrar la grafica segun la ultima
 * muestra de latencia tomada */
const { response, request } = require('express');
const { obtenerUltimaLatencia } = require("../microservices/graficaService");
const {listarMuestrasByParametro,
    obtenerParametros,
    ordenarMuestrasByCliente} = require('../microservices/diagnosticoService');
const { getLatencia } = require('../repositoryDB/latenciaRepository');



const verGrafica = async(req= request, res = response) =>  {
    console.log(' *********** verGrafica ************');
    //Consultar la ultima latencia tomada
    try {
        //Validamos si llega el idLatencia en los parametros
        const idLatencia = req.params.idLatencia;
        // console.log('verGrafica :: idlatencia '+idLatencia);
        var responseLatencia = '';
        if (idLatencia !== void 0 && idLatencia !== 'undefined'){
            // console.log('entro aqui *****');
            latencia = await getLatencia(idLatencia);
            responseLatencia = latencia?latencia._id:'' ;
        }else {
            // console.log('entro aqui +++++');
            latencia = await obtenerUltimaLatencia();
            responseLatencia = latencia[0]._id;
        }
        console.log('objeto latencia :  '+responseLatencia);
        parametro = await obtenerParametros(responseLatencia);
        // console.log('parametros es : '+parametro);
         console.log('parametros ID ES : '+parametro.id);
        const listMuestras = await listarMuestrasByParametro(parametro.id);
        arreglo = await ordenarMuestrasByCliente(listMuestras);
        res.status( 200 ).json({
            msg: "OK",
            latencia,
            arreglo
        });
        console.log(' *********** FIN verGrafica ************');
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
