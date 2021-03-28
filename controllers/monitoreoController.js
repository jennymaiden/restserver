const { response, request } = require('express');
const Parametro = require('../models/parametros');
const Latencia = require("../models/latencia");
const {calculoTiempo, calcularDiasAusencia} = require('../microservices/diagnosticoService');
const {ejecutarPing, ping} = require('../microservices/envioPaquetes');


//Servicio de monitoreo en tiempo real
async function monitoreoTiempoReal(req = request, res = response) {
//https://www.digitalocean.com/community/tutorials/how-to-launch-child-processes-in-node-js-es
//Pagina para validar el comando fork para comunicacion bilateral
    //obtener los parametros de entrada 
    const {fechaInicio,fechaFin, numClientes, tiempoSeg, tamanioPaquete, URL } = req.body;
    const body = req.body;
    var parametro = new Parametro(body);
    //var latencia = new Latencia();

    // let parametroSave = await parametro.save(function(err, doc) {
    //     if (err) return console.error(err);
    //     console.log("Parametro inserted succussfully!" +parametroSave);
         
    // });
    await parametro.save((function (Err, doc) {
        return function () {
          console.log(parametro._id);
          // your save callback code in here
        };
      })(parametro._id));

    console.log('los parametros guardados fueron: '+parametro._id)

    // latencia.idParametros = parametro._id;
    
    // await latencia.save(function(err, lac){
    //     if (err) return console.error(err);

    //     console.log("Latencia inserted succussfully!"+latencia);

    // });
    //console.log("id latencia es: "+latencia._id);
    ejecutarPing(numClientes, tamanioPaquete, URL,parametro._id)
    //ping(tamanioPaquete, URL);
    //https://www.npmjs.com/package/net-ping

    res.json({
        msg: "get API",
        parametro
    });
};


//Servicio de monitoreo en programado
const monitoreoProgramado = (req= request, res = response) =>  {

    //obtener los parametros de entrada 
    const {fechaInicio,fechaFin, numClientes, tiempoSeg, tamanioPaquete, URL, horaInicio,horaFin } = req.body;
    //Calcular el tiempo de la prueba
    tiempoPrueba = calculoTiempo(fechaInicio,fechaFin,horaInicio,horaFin);
    const body = req.body;
    const parametro = new Parametro(body);
    parametro.save();
    dias = calcularDiasAusencia(fechaInicio,fechaFin )
    
    res.json({
        msg: "get API monitoreoProgramado",
        parametro,
        tiempoPrueba,
        dias
    });
}

module.exports = {
    monitoreoTiempoReal,
    monitoreoProgramado
}