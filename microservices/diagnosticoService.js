/**Archivo de services para manejar la logica de la información del diagnostico del monitoreo de red**/

const {arrayIdMuestras, obtenerMuestra} = require('../repositoryDB/graficasRepository');
const {obtenerRecomengacionByFalla} = require('../repositoryDB/recomendacionRepository');
const {diagnosticoByLatencia} = require('../repositoryDB/diagnosticoRepository');
const {getLatencia} = require('../repositoryDB/latenciaRepository');
const {getParametro} = require('../repositoryDB/parametroRepository');


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

function  obtenerDiagnostico(idLatencia){
    let diagnostico = diagnosticoByLatencia(idLatencia);

    return diagnostico;

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

function  obtenerParametros(idLatencia){

    latenciaModel = getLatencia(idLatencia);
    console.log('El modelo de la latencia es: '+latenciaModel);
    console.log('El id de parametro de modelo: '+latenciaModel.idParametros);
    return getParametro(latenciaModel.idParametros);

}

function crearDiagnostico(idParametro){

}

function listarMuestrasByParametro(idParametro){

}

module.exports = {
    calculoTiempo,
    calcularDiasAusencia,
    listarMuestrasByLatencia,
    obtenerDiagnostico,
    obtenerParametros,
    relacionarRecomendacion
}
