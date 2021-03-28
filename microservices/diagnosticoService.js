
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

module.exports = {calculoTiempo,calcularDiasAusencia}