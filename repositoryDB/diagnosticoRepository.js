const  Diagnostico  = require("../models/diagnostico");
const Alerta = require("../models/alerta");

/**
 * Guardar el diagnostico*/
const guardarDiagnostico= async(diagnosticoModelo)=>{
    try{
        const diagnosticoDB = await Diagnostico.save(diagnosticoModelo);
        if (!diagnosticoDB){
            throw new Error('No se pudo guardar el diagnostico en la BD');
        }
        return diagnosticoDB;
    }catch (error) {
        return error;
    }
}

/**
 * Consultar el diagnostico por el id de la latencia*/
async function  diagnosticoByLatencia (idLatencia){
    try{
        const diagnosticoDB = await Diagnostico.findOne({ idLatencia: idLatencia},
            function (err, data) {
                if (err){
                    throw new Error('Ocurrio un error en la consulta diagnosticoByLatencia ' + err);
                }
                return data;

            });

        return diagnosticoDB;
    }catch (error) {
        return error;
    }
}

async function  listUltimas10Alertas (){

    const alertaList = await Alerta.find({},
        function (err, data) {
            if (err){
                throw new Error('Ocurrio un error en la consulta listUltimas10Alertas ');
            }
            // console.log('muestras ... '+data);
            return data;

        }).sort({$natural:-1}).limit(10);

    return alertaList;
}

module.exports = {
    guardarDiagnostico,
    diagnosticoByLatencia,
    listUltimas10Alertas
}
