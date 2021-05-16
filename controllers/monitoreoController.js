const { response, request } = require('express');
const Parametro = require('../models/parametros');

const { tarea , crearTarea} = require('../microservices/cronJobs')
const {ejecutarPing, ping,guardarParametros, crearLatencia} = require('../microservices/envioPaquetes');


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
    const body = req.body;
    parametroModel = guardarParametros(body);
    console.log("el id del los parametros ingrasados es"+ parametroModel._id);
    latenciaModel = crearLatencia(parametroModel._id);
    console.log("El id de la latencia es :"+latenciaModel._id);
    //Crear tarea programada
    boolTarea = crearTarea(body,parametroModel._id,latenciaModel._id);

    //dias = calcularDiasAusencia(fechaInicio,fechaFin )
    
    res.status(200).json({
        msg: "get API monitoreoProgramado 1",
        parametroModel,
        latenciaModel,
        tarea: boolTarea
    });
}

module.exports = {
    monitoreoTiempoReal,
    monitoreoProgramado
}
