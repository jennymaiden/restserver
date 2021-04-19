/**Archivo de services para manejar la logica de la información del diagnostico del monitoreo de red**/

const {arrayIdMuestras, obtenerMuestra} = require('../repositoryDB/graficasRepository');
const {obtenerRecomengacionByFalla} = require('../repositoryDB/recomendacionRepository');
const {diagnosticoByLatencia} = require('../repositoryDB/diagnosticoRepository');

const  Muestra  = require("../models/muestra");
const  Recomendaciones  = require("../models/recomendacione");

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

function listarMuestras(idLatencia){

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

function  obtenerDiagnostico(idLatencia){
    let diagnostico = diagnosticoByLatencia(idLatencia);

    return diagnostico;

}

function relacionarRecomendacion(idLatencia){
    //Buscar las muestras relacionadas a la latencia
    let arrayMuestra = listarMuestras(idLatencia);
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

function  obtenerParametros(idLatencia){

}
module.exports = {
    calculoTiempo,
    calcularDiasAusencia,
    listarMuestras,
    obtenerDiagnostico,
    obtenerParametros,
    relacionarRecomendacion
}
