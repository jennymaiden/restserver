/**
 * Controlador para mostrar la grafica segun la ultima
 * muestra de latencia tomada */
const { response, request } = require('express');
const { obtenerUltimaLatencia } = require("../microservices/graficaService");
const {listarMuestrasByParametro,
    ordenarMuestrasByCliente} = require('../microservices/diagnosticoService');

const verGrafica = async(req= request, res = response) =>  {

    //Consultar la ultima latencia tomada
    try {
        const latencia = await obtenerUltimaLatencia();
        console.log('la latencia es ',latencia[0]);
        console.log('el id parametro es ',latencia[0].idParametros);
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
            msg: err
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
