const cron = require('node-cron');
const { ping } = require('./envioPaquetes');
const { crearDiagnostico } = require('../microservices/diagnosticoService');
const { crearAlertaConNotificacion } = require('../microservices/alertasService');
var spawn =require('child_process').spawn, child=null;

/***Los parametros del cron jobs es
 * Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11 (Jan-Dec)
Day of Week: 0-6 (Sun-Sat)
 */
function tarea (minutos, hora,dia, mes,numCliente, idParametro){

    console.log('La expresion para la tarea es '+'* '+minutos+' '+hora+' '+dia+' '+mes+' *');
    var fecha= new Date();
    console.log('la fecha hora del servidor es: '+fecha);

    cron.schedule(minutos+' '+hora+' '+dia+' '+mes+' *',()=>{
        console.log("------********************-----");

        ping(76,'google.com',numCliente,idParametro);
    });

}

function sumarSegundosHora(hora, segundos, fechaInicio, fechaFin){
    auxVHoraIni = hora.split(':');//Formato HH:mm
    segundosHora = (auxVHoraIni[1] * 60)+segundos;
    if(segundosHora<60){

    }
    if(segundosHora>59){
        //se suman minutos
    }

    if (s>59){m++;s=0;}
    if (m>59){h++;m=0;}
    if (h>24){h=0;}

    if (s<10){sAux="0"+s;}else{sAux=s;}
    if (m<10){mAux="0"+m;}else{mAux=m;}
    if (h<10){hAux="0"+h;}else{hAux=h;}

    document.getElementById("hms").innerHTML = hAux + ":" + mAux + ":" + sAux;

}
function crearTarea(parametroModel,idParametro, idLatencia){
    console.log('El parametro es '+parametroModel);
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
    var tareaXCliente = {};
    // for (let i = 0; i < parametroModel.numClientes; i++){
    //     console.log('index '+i);
    //     var index = i+1;
    //     tareaXCliente['tarea_' + index]  = cron.schedule(auxVHoraIni[1]+' '+auxVHoraIni[0]+' '+auxVFechaIni[2]+' '+auxVFechaIni[1]+' *', () =>  {
    //         console.log('Se creo la tarea '+index);
    //         ping(parametroModel.tamanioPaquete,parametroModel.URL,index,idParametro);
    //     });
    //
    // }

    //Ejecutar tareas

    cron.schedule(auxVHoraIni[1]+' '+auxVHoraIni[0]+' '+auxVFechaIni[2]+' '+auxVFechaIni[1]+' *',()=>{
        console.log("------************Ejecutar tareas********-----");
        child = ping(parametroModel.tamanioPaquete,parametroModel.URL,1,idParametro);

        // for (const property in tareaXCliente) {
        //     console.log(`${property}: ${tareaXCliente[property]}`);
        //     console.log('kill');
        //     child.stdin.pause();
        //     child.kill();
        //     tareaXCliente[property].start();
        // }
    });

    //Tarea para detener las tareas
    cron.schedule(auxVHoraFin[1]+' '+auxVHoraFin[0]+' '+auxVFechaFin[2]+' '+auxVFechaFin[1]+' *',()=>{
        console.log("------************Detener tareas********-----");
        console.log('kill');
        console.log('Tarea: '+child);
        child.stdin.pause();
        child.kill();
        // for (const property in tareaXCliente) {
        //     console.log(`${property}: ${tareaXCliente[property]}`);
        //     tareaXCliente[property].destroy();
        // }
        //LanzarAlerta
        crearAlertaConNotificacion();


    });

    return true;

}
module.exports = {
    tarea,
    crearTarea
};
