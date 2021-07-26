/**
 * Este controlador tenda los servicios de consultar las alertas*/
const { response, request } = require('express');
const {listarAlertas, actualizarAlerta} = require('../microservices/alertasService');


/**
 *Servicio para listar alertas
 * Listar las alertas que se tengan con su estados
 * adicionar el contador de esas alertas cuales estan leidas y cuales no
 */
const verAlertas = async (req= request, res = response) =>  {
    try{
        console.log(' *********** verAlertas ************');
        const listAlerta = await listarAlertas();
        console.log(' ***********FIN  verAlertas ************');
        res.status( 200 ).json({
            msg: "OK",
            listAlerta
        });

    }catch (error){
        console.log(error);
        console.log(' *********** FIN ERROR verAlertas ************');
        res.status( 500 ).json({
            msg: 'ocurrio un error'
        });

    }
}

const verActualizarAlerta = async (req= request, res = response) =>  {
    try{
        console.log(' *********** actualizarAlerta ************');
        const idAlerta = req.params.idAlerta;
        await actualizarAlerta(idAlerta);
        console.log(' ***********FIN  actualizarAlerta ************');
        res.status( 200 ).json({
            msg: "OK"
        });

    }catch (error){
        console.log(error);
        console.log(' *********** FIN ERROR actualizarAlerta ************');
        res.status( 500 ).json({
            msg: 'ocurrio un error'
        });

    }
}

module.exports = {
    verAlertas,
    verActualizarAlerta
}
