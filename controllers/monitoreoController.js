const { response, request } = require('express');
const Parametro = require('../models/parametros');


//Servicio de mostrar el diagnostico
const verDiagnostico = (req= request, res = response) =>  {
    const idLatencia = req.params.idLatencia;
    res.json({
        msg: "get API"
    });
}

//Servicio para mostrar las alertas
const verAlertas = (req= request, res = response) =>  {
    const params = req.query; //Obtener los query params 
    res.json({
        msg: "get API"
    });
}

//Servicio de monitoreo en tiempo real
const monitoreoTiempoReal = (req = request, res = response) =>  {
    //obtener los parametros de entrada 
    const {fechaInicio,fechaFin, numClientes, tiempoSeg, tamanioPaquete, URL } = req.body;
    res.json({
        msg: "get API"
    });
}


//Servicio de monitoreo en programado
const monitoreoProgramado = (req= request, res = response) =>  {

    //obtener los parametros de entrada 
    //const {fechaInicio,fechaFin, numClientes, tiempoSeg, tamanioPaquete, URL } = req.body;
    const body = req.body;
    const parametro = new Parametro(body);
    res.json({
        msg: "get API monitoreoProgramado",
        parametro
    });
}

module.exports = {
    monitoreoTiempoReal,
    verDiagnostico,
    verAlertas,
    monitoreoProgramado
}