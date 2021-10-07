const cron = require('node-cron');
const { ping } = require('./envioPaquetes');
const { crearAlertaConNotificacion } = require('../microservices/alertasService');
const Threads = require('webworker-threads');

/***Los parametros del cron jobs es
 * Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11 (Jan-Dec)
Day of Week: 0-6 (Sun-Sat)
 */

function crearTarea(parametroModel,idParametro, idLatencia){

    //El formato de las fechas es yyyy-mm-dd
    //El formato de la hora es hh:mm
    var auxVFechaIni = parametroModel.fechaInicio.split('-')
    var auxVHoraIni = parametroModel.horaInicio.split(':');//TODO el servidor esta en hora militar +1hora
    // console.log('hora inicio:::: ['+auxVHoraIni+']');
    // console.log('fecha fin:::: ['+auxVFechaIni+']');
    var auxVFechaFin = parametroModel.fechaFin.split('-')
    var auxVHoraFin = parametroModel.horaFin.split(':');//TODO el servidor esta en hora militar +1hora
    // console.log('hora fin:::: ['+auxVFechaFin+']');
    // console.log('fecha fin:::: ['+auxVHoraFin+']');

    console.log('la fecha hora del servidor es: '+new Date());
    console.log('numero de clientes: '+parametroModel.numClientes);
    //Ejecutar la tarea x clientes
    var tareaXCliente = [];
    // for (let i = 0; i < parametroModel.numClientes; i++){
    //     console.log('Cliente #:: '+i);
    //     var index = i+1;
    //     tareaXCliente['tarea_' + index]  = cron.schedule(auxVHoraIni[1]+' '+auxVHoraIni[0]+' '+auxVFechaIni[2]+' '+auxVFechaIni[1]+' *', () =>  {
    //         console.log('Se creo la tarea '+index);
    //         ping(parametroModel.tamanioPaquete,parametroModel.URL,index,idParametro);
    //     });
    //
    // }

    var numThreads= parametroModel.numClientes;
    const threadPool= Threads.createPool(numThreads).all.eval(tareaPing);


    // threadPool.all.eval('tareaPing ('+parametroModel.tamanioPaquete+', '+parametroModel.URL+', 1, '+idParametro+')', function cb (err, data) {
    //     process.stdout.write(" ["+ this.id+ "]"+ data);
    //     this.eval('tarea(parametroModel.tamanioPaquete,parametroModel.URL,this.id,idParametro)', cb);
    // });
    //
    // (function spinForever () {
    //     process.stdout.write(".");
    //     // setImmediate(spinForever);
    // })();
    // console.log("------****************-----");
    // child = ping(parametroModel.tamanioPaquete,parametroModel.URL,1,idParametro);
    // console.log('que tiene ping '+child)
    // console.log("------*******************-----");


    //Ejecutar tareas
    cron.schedule(auxVHoraIni[1]+' '+auxVHoraIni[0]+' '+auxVFechaIni[2]+' '+auxVFechaIni[1]+' *',()=>{
        console.log("------************Ejecutar tareas********-----");
        //  child = ping(parametroModel.tamanioPaquete,parametroModel.URL,1,idParametro);
        //  child2 = ping(parametroModel.tamanioPaquete,parametroModel.URL,2,idParametro);
        // child3 = ping(parametroModel.tamanioPaquete,parametroModel.URL,3,idParametro);
        // tareaXCliente.push(child);
        // tareaXCliente.push(child2);
        // tareaXCliente.push(child3);
        //  for (var i =0 ; i <parametroModel.numClientes ; i++){
        //      //Crear hilo
        //      child = ping(parametroModel.tamanioPaquete,parametroModel.URL,i+1,idParametro);
        //      tareaXCliente.push(child);
        //
        //
        //      console.log("el cliente " + i+1);
        //  }

        for (var i =0 ; i < parametroModel.numClientes ; i++) {
            // extra closure to get proper scoping on 'i'
            (function(i) {
                // dispatch each request to the first available thread
                threadPool.any.eval(tareaPing(), function(err, val ) {

                    tareaXCliente.push(ping(parametroModel.tamanioPaquete,parametroModel.URL,i+1,idParametro));
                    // destroy the pool when all results have been produced
                    if (err) throw err; // something abnormal
                    // print the result
                    console.log('entra en e error ' + err);

                });
            })(i);
        }

         /*threadPool.all.eval(ping(parametroModel.tamanioPaquete,parametroModel.URL,1,idParametro), function cb (err, data) {
             process.stdout.write(" ["+ this.id+ "]"+ data);
             this.eval(ping(parametroModel.tamanioPaquete,parametroModel.URL,this.id,idParametro), cb);
         });*/
    });

    //Tarea para detener las tareas
    cron.schedule(auxVHoraFin[1]+' '+auxVHoraFin[0]+' '+auxVFechaFin[2]+' '+auxVFechaFin[1]+' *',()=>{
        console.log("------************Detener tareas********-----");
        for (const property in tareaXCliente) {
            console.log(`${property}: ${tareaXCliente[property]}`);
            tareaXCliente[property].stdin.pause();
            tareaXCliente[property].kill();
        }
        //LanzarAlerta
        crearAlertaConNotificacion(idParametro,idLatencia );


    });

    return true;

}

function tareaPing () {

    return 'echo';
}

function ejecutarMonitoreo(body, idParametro){

    console.log('numero de clientes: '+body.numClientes);
    var tareaXCliente = [];
    var numThreads= body.numClientes;
    const threadPool= Threads.createPool(numThreads).all.eval(tareaPing);
    for (var i =0 ; i < body.numClientes ; i++) {
        // extra closure to get proper scoping on 'i'
        (function(i) {
            // dispatch each request to the first available thread
            threadPool.any.eval(tareaPing(), function(err, val ) {
                console.log('tareaPing=' + val);
                console.log('tareaPing= error' + err);
                tareaXCliente.push(ping(body.tamanioPaquete,body.URL,i+1,idParametro));
                // destroy the pool when all results have been produced
                if (err) throw err; // something abnormal
                // print the result
                console.log('entra en e error ' + err);

            });
        })(i);
    }

}


module.exports = {
    crearTarea,
    ejecutarMonitoreo
};
