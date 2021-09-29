const { response, request } = require('express');

const { crearTarea, ejecutarMonitoreo} = require('../microservices/cronJobs')
const {ping,guardarParametros, crearLatencia} = require('../microservices/envioPaquetes');


//Servicio de monitoreo en tiempo real
async function monitoreoTiempoReal(req = request, res = response) {
//https://www.digitalocean.com/community/tutorials/how-to-launch-child-processes-in-node-js-es
//Pagina para validar el comando fork para comunicacion bilateral
    //obtener los parametros de entrada 
    const {fechaInicio,fechaFin, numClientes, tiempoSeg, tamanioPaquete, URL } = req.body;
    const body = req.body;
    parametroModel = guardarParametros(body);
    // console.log("el id del los parametros ingrasados es"+ parametroModel._id);
    latenciaModel = crearLatencia(parametroModel._id);

    var stream = fs.createReadStream(__dirname + '/data.txt');
    stream.pipe(res);
    //Ejecutar comando
    ejecutarMonitoreo(body,parametroModel._id );


    //ping(tamanioPaquete, URL);
                //https://www.npmjs.com/package/net-ping

    // res.json({
    //     msg: "get API",
    //     parametro
    // });
    // Documentacion
    // https://elabismodenull.wordpress.com/2017/03/28/el-manejo-de-streams-en-nodejs/
};


//Servicio de monitoreo en programado
const monitoreoProgramado = (req= request, res = response) =>  {
    try{
        console.log(' *********** monitoreoProgramado ************');
        //obtener los parametros de entrada
        const body = req.body;
        // console.log('el cuerpo es: '+body);
        parametroModel = guardarParametros(body);
        // console.log("el id del los parametros ingrasados es"+ parametroModel._id);
        latenciaModel = crearLatencia(parametroModel._id);
        console.log("El id de la latencia es :"+latenciaModel._id);
        //Crear tarea programada
        boolTarea = crearTarea(body,parametroModel._id,latenciaModel._id);

        //dias = calcularDiasAusencia(fechaInicio,fechaFin )
        console.log(' *********** FIN monitoreoProgramado ************');
        res.status(200).json({
            msg: "OK",
            idLatencia: latenciaModel._id,
            idParametros: parametroModel._id
        });
    }catch (error){
        console.log(error);
        console.log(' *********** FIN ERROR monitoreoProgramado ************');
        res.status( 500 ).json({
            msg: 'ocurrio un error'
        });
    }
}

module.exports = {
    monitoreoTiempoReal,
    monitoreoProgramado
}
