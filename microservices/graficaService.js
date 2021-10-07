const Latencia = require("../models/latencia");
const { getLastLatencia } = require('../repositoryDB/latenciaRepository');

const obtenerUltimaLatencia = () =>{

    return new Promise((async (resolve, reject) => {

        const latencia = await getLastLatencia();
        if (latencia) {
            resolve(latencia);
        } else {
            reject('No se encontro la latencia');
        }
    }));
    // const responseLatencia = await getLastLatencia();
    // return responseLatencia;

}

module.exports = {
    obtenerUltimaLatencia
}
