/**Archivo de services para manejar la logica de la información del diagnostico del monitoreo de red**/

const {arrayIdMuestras, obtenerMuestra, listMuestrasByParametro} = require('../repositoryDB/graficasRepository');
const {obtenerRecomengacionByFalla} = require('../repositoryDB/recomendacionRepository');
const {diagnosticoByLatencia} = require('../repositoryDB/diagnosticoRepository');
const {getLatencia} = require('../repositoryDB/latenciaRepository');
const {getParametro} = require('../repositoryDB/parametroRepository');
const  Diagnostico  = require("../models/diagnostico");
const  Recomendacion  = require("../models/recomendacione");
const QoE = require('../models/calidadServicio');
const mongoose = require('mongoose');


function calculoTiempo  (fechaInicio, fechaFin, horaInicio, horaFin){

    auxVFechaIni = fechaInicio.split('-');
    auxVHoraIni = horaInicio.split(':');
    auxfechaInicio = new Date(auxVFechaIni[0], auxVFechaIni[1], auxVFechaIni[2],auxVHoraIni[0],auxVHoraIni[1], 0);

    auxVFechaFin = fechaFin.split('-');
    auxVHoraFin = horaFin.split(':');
    auxFechaFin = new Date(auxVFechaFin[0],auxVFechaFin[1],auxVFechaFin[2],auxVHoraFin[0],auxVHoraFin[1], 0);

    return 4;
}
function calcularDiasAusencia(fechaIni, fechaFin) {
    var diaEnMils = 1000 * 60 * 60 * 24,
        desde = new Date(fechaIni.substr(0, 10)),
        hasta = new Date(fechaFin.substr(0, 10)),
        diff = hasta.getTime() - desde.getTime() + diaEnMils;// +1 incluir el dia de ini
    return diff / diaEnMils;
  }

function listarMuestrasByLatencia(idLatencia){

    listIdMuestras = arrayIdMuestras(idLatencia)
    let arrayMuestra = [];
    if (listIdMuestras.length != 0){
        listIdMuestras.forEach(function(id, index) {
            console.log(`${index} : ${id}`);
            arrayMuestra.push(obtenerMuestra(id));
        });
        return arrayMuestra;
    }else{
        return null;
    }

}
async function  validacionFallaMuestra(idParametro) {

    let muestraFallida = false;
    var paquetesPerdidos =0;
    const muestrasList = await listarMuestrasByParametro(idParametro);
    muestrasList.forEach(function (Muestra,index){
        // console.log(`${index} : ${Muestra}`);
        if(Muestra.msgError != ''){
            // console.log("El error es: "+Muestra.msgError)
            paquetesPerdidos ++;
        }

    });
    // console.log("numero de paquetes perdidos : "+paquetesPerdidos)
    if(paquetesPerdidos > 5){
        muestraFallida = true;
    }
    return muestraFallida;
}

async function  obtenerDiagnostico(idLatencia) {

    const modelDiagnostico = await diagnosticoByLatencia(idLatencia);
    return modelDiagnostico;
}

async function relacionarRecomendacion(paquetesPerdidos, arrayMensajesError, muestrasList) {

    var tipoFalla = 'ninguna';
    // var porcentajeFalla = muestrasList.length * 0.5;
    if (paquetesPerdidos > 5) {
        tipoFalla = 'muchosPerdidos';
    }else if(muestrasList.length == 0){
        tipoFalla = 'timeout';
    } else{
        //Recorremos el array para validar si tiene algun mensaje de error
        var msgPriorisar = '';
        arrayMensajesError.forEach(function (msg, index) {
            // console.log(`${index} : ${msg}`);
            if (msg !== 'timeout') {
                msgPriorisar = msg;
                console.log('mensaje relevante es: '+msgPriorisar);
            }
        });
        if (msgPriorisar !== ''){
            console.log('que quedo es: '+msgPriorisar);
            if (msgPriorisar.includes('time')){
                tipoFalla = 'time:65';
            }else if (msgPriorisar.includes('Unknown')){
                tipoFalla = 'Unknown host';
            }else if (msgPriorisar.includes('NAT')){
                tipoFalla = 'NAT';
            }
        }
    }
    console.log('tipoFalla::: '+tipoFalla);

    return await obtenerRecomengacionByFalla(tipoFalla);
}

async function  obtenerParametros (idLatencia){

    const modelLatencia = await getLatencia(idLatencia)
    const modelParametro = await getParametro(modelLatencia.idParametros);

    return modelParametro;
}

/**
 * Función para retornar la estadistica  */
function obtenerEstadistica(muestrasList){
    var min = 0;
    var max = 0;
    var sumatoria = 0;
    var paquetesPerdidos =0;
    var msgEstadistica = "";
    var promerio =0;
    var arrayMSGPerdidos = [];
    var arrayTiempos = [];

    muestrasList.forEach(function (Muestra,index){
        // console.log(`${index} : ${Muestra}`);
        if (Muestra.tiempoRespuesta != 0 ){
            arrayTiempos.push(Muestra.tiempoRespuesta);
        }
        if(Muestra.tiempoRespuesta > max){
            // console.log('Anterior maximo: ' + max + ', nuevo maximo: ' + Muestra.tiempoRespuesta);
            max = Muestra.tiempoRespuesta;
        }
        sumatoria = Muestra.tiempoRespuesta +sumatoria;
        if(Muestra.msgError != ''){
            paquetesPerdidos ++;
            arrayMSGPerdidos.push(Muestra.msgError);
        }

    });
    min = Math.min.apply(Math, arrayTiempos);
    console.log('Valor mínimo: ' + min);
    // console.log('Valor maximo: ' + max);
    // console.log('Valor sumatoria: ' + sumatoria);
    promerio = sumatoria/muestrasList.length;

    if(paquetesPerdidos > 0){
        let porcentaje = (paquetesPerdidos*100)/muestrasList.length;
        msgEstadistica =  muestrasList.length+" paquetes trasmitidos, "+paquetesPerdidos+" paquetes perdidos y "+Math.round(porcentaje)+"% paquetes perdidos";
    }else{
        msgEstadistica= muestrasList.length+" paquetes trasmitidos y 0% paquetes perdidos";
    }
    msgEstadistica =  msgEstadistica+" - El tiempo minimo de envío fue: "+Math.round(min)+ "(ms). El tiempo maximo fue: "+Math.round(max)+
    "(ms). El promedio de envío fue: "+Math.round(promerio) + "milisegundos (ms)";


    return [msgEstadistica,paquetesPerdidos,promerio,arrayMSGPerdidos];
}


async function crearDiagnostico(idLatencia) {

    const parametro = await obtenerParametros(idLatencia);
    const muestrasList = await listarMuestrasByParametro(parametro._id);
    // console.log(`muestraa de lista ${muestrasList}`);
    const arrayEstadistica = obtenerEstadistica(muestrasList);
    // console.log('La estadistica dio : '+arrayEstadistica);
    var porcentajeFalla = muestrasList.length * 0.02;
    var falloDiagnostico = false;
    if (arrayEstadistica[1] > porcentajeFalla || muestrasList.length== 0 ) {
        falloDiagnostico = true;
    }

    const recomentacion = await relacionarRecomendacion(arrayEstadistica[1], arrayEstadistica[3], muestrasList);

    var diagnostico = new Diagnostico ({
        idLatencia:idLatencia,
        estadistica:arrayEstadistica[0],
        falla:falloDiagnostico,
        idRecomendacion: mongoose.Types.ObjectId(recomentacion[0]._id),
        QoE: Qoe(arrayEstadistica[2])
    });

    diagnostico = await diagnostico.save();
    return diagnostico;
}
const Qoe = (promedio) =>{
    let juegos       = (promedio <= QoE.JUEGOS)? true: false;
    let rtsp         = (promedio <= QoE.RTSP)? true: false;
    let peliculas    = (promedio <= QoE.PELICULAS)? true: false;
    let red    = (promedio <= QoE.REDSOCIAL)? true: false;
    let smtp         = (promedio <= QoE.SMTP)? true: false;
    let http         = (promedio <= QoE.HTTP)? true: false;

    return JSON.stringify({JUEGOS: juegos, RTSP: rtsp, PELICULAS: peliculas, REDSOCIAL: red, SMTP: smtp, HTTP: http});
}

function ordenarMuestrasByCliente(data) {

    hash = data.reduce((p,c) => (p[c.numCliente] ? p[c.numCliente].push(c) : p[c.numCliente] = [c],p) ,{}),
        newData = Object.keys(hash).map(k => ({numCliente: k, muestra: hash[k]}));
    // console.log(newData);
    return newData;
}
async function listarMuestrasByParametro(idParametro){
    const muestraList = await listMuestrasByParametro(idParametro)
    return muestraList;

}

module.exports = {
    obtenerDiagnostico,
    obtenerParametros,
    relacionarRecomendacion,
    listarMuestrasByParametro,
    ordenarMuestrasByCliente,
    crearDiagnostico,
    validacionFallaMuestra
}
