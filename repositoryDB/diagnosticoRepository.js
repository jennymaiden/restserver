const  Diagnostico  = require("../models/diagnostico");

/**
 * Guardar el diagnostico*/
const guardarDiagnostico= async(diagnosticoModelo)=>{
    const diagnosticoDB = await Diagnostico.save(diagnosticoModelo);
    if (!diagnosticoDB){
        throw new Error('No se pudo guardar el diagnostico en la BD');
    }
    return diagnosticoDB;

}

/**
 * Consultar el diagnostico por el id de la latencia*/
async function  diagnosticoByLatencia (idLatencia){
    let diagnosticoDB = await Diagnostico.find({ idLatencia: idLatencia},
        function (err, docs) {
            if (err){
                throw new Error('Ocurrio un error en la consulta diagnosticoByLatencia ${err}');
            }

        });

    return diagnosticoDB;

}

module.exports = {
    guardarDiagnostico,
    diagnosticoByLatencia
}
