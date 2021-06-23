/**Archivo de services para manejar la logica de la información del diagnostico del monitoreo de red**/

const {arrayIdMuestras, obtenerMuestra, listMuestrasByParametro} = require('../repositoryDB/graficasRepository');
const {obtenerRecomengacionByFalla} = require('../repositoryDB/recomendacionRepository');
const {diagnosticoByLatencia} = require('../repositoryDB/diagnosticoRepository');
const {getLatencia} = require('../repositoryDB/latenciaRepository');
const {getParametro} = require('../repositoryDB/parametroRepository');
const  Diagnostico  = require("../models/diagnostico");
const  Recomendacion  = require("../models/recomendacione");
const QoE = require('../models/calidadServicio');


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

async function  obtenerDiagnostico(idLatencia) {

    const modelDiagnostico = await diagnosticoByLatencia(idLatencia);
    return modelDiagnostico;
}

function relacionarRecomendacion(idLatencia){
    //Buscar las muestras relacionadas a la latencia
    let arrayMuestra = listarMuestrasByLatencia(idLatencia);
    let recomendacionBD = 'ninguna';
    //Recorremos el array para validar si tiene algun mensaje de error
    arrayMuestra.forEach(function (Muestra,index){
        console.log(`${index} : ${Muestra}`);
        //Se valida si es diferende de vacio el error
        if(!Muestra.msgError.equals('')){
            recomendacionBD = obtenerRecomengacionByFalla(Muestra.msgError);
        }
    });

    return recomendacionBD;
}
function relacionarMuestrasWithLatencia(idLatencia, idParametro){

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

    muestrasList.forEach(function (Muestra,index){
        console.log(`${index} : ${Muestra}`);
        if(Muestra.tiempoRespuesta < min){
            console.log('Anterior minimo: ' + min + ', nuevo minimo: ' + Muestra.tiempoRespuesta);
            min = Muestra.tiempoRespuesta;
        }
        if(Muestra.tiempoRespuesta > max){
            console.log('Anterior maximo: ' + max + ', nuevo maximo: ' + Muestra.tiempoRespuesta);
            max = Muestra.tiempoRespuesta;
        }
        sumatoria = Muestra.tiempoRespuesta +sumatoria;
        if(Muestra.msgError != ''){
            paquetesPerdidos ++;
            arrayMSGPerdidos.push(Muestra.msgError);
        }

    });
    console.log('Valor mínimo: ' + min);
    console.log('Valor maximo: ' + max);
    console.log('Valor sumatoria: ' + sumatoria);
    promerio = sumatoria/muestrasList.length;

    if(paquetesPerdidos > 0){
        let porcentaje = (paquetesPerdidos*100)/muestrasList.length;
        msgEstadistica =  muestrasList.length+" paquetes trasmitidos, "+paquetesPerdidos+" paquetes perdidos y "+porcentaje+"% paquetes perdidos";
    }else{
        msgEstadistica= muestrasList.length+" paquetes trasmitidos y 0% paquetes perdidos";
    }
    msgEstadistica =  msgEstadistica+" - El tiempo minimo de envío fue: "+min+ ". El tiempo maximo fue: "+max+
    ". El promedio de envío fue: "+promerio;


    return [msgEstadistica,paquetesPerdidos,promerio,arrayMSGPerdidos];
}


async function crearDiagnostico(idLatencia) {

    // Crear recomendaciones
    // var recomendacion = new Recomendacion({
    //     falla: 'timeout',
    //     causa: 'El servidor de destino no pudo resolver la solicitud de envío',
    //     solucion: 'Reintentar de nuevo o revisar su configuración de proxy. Si ninguna funciona valide con el proveedor de internet'
    // });
    // await recomendacion.save();
    const parametro = await obtenerParametros(idLatencia);
    const muestrasList = await listarMuestrasByParametro(parametro._id);
    // console.log(`muestraa de lista ${muestrasList}`);
    const arrayEstadistica = obtenerEstadistica(muestrasList);
    console.log('La estadistica dio : '+arrayEstadistica);


    var diagnostico = new Diagnostico ({
        idLatencia:idLatencia,
        estadistica:arrayEstadistica[0],
        falla:arrayEstadistica[1] > 0 ? true: false,
        idRecomendacion:'60c9878d4ede7fab2a8683c7',
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
    let respuestaQoE;
    return respuestaQoE = JSON.stringify({JUEGOS: juegos, RTSP: rtsp, PELICULAS: peliculas, REDSOCIAL: red, SMTP: smtp, HTTP: http});
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
    calculoTiempo,
    calcularDiasAusencia,
    listarMuestrasByLatencia,
    obtenerDiagnostico,
    obtenerParametros,
    relacionarRecomendacion,
    listarMuestrasByParametro,
    ordenarMuestrasByCliente,
    crearDiagnostico
}
