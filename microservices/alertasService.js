const  Alerta  = require("../models/alerta");
const { validacionFallaMuestra } = require("../microservices/diagnosticoService");
const { obtenerEndpoint, enviarNotificacion } = require("../microservices/notificacionService");
const { listUltimas10Alertas } = require("../repositoryDB/diagnosticoRepository");
/**
 * Función para crear una alerta y lanzar la notificación
 * que una muestra a terminado*/
async function crearAlertaConNotificacion(id, idLatencia) {

    //Validar si la muestra es exitosa o no
    var estadoFallido = await validacionFallaMuestra(id);
    var msg = (estadoFallido)? "Muestra de latencia Fallido":"Muestra de latencia Exitoso";

    var alerta = new Alerta({
        idLatencia: idLatencia,
        mensaje: msg,
        fecha: new Date(),
        estado: estadoFallido,
        leido: false
    });

    alerta.save().then(respuesta => {
        console.log(respuesta);
        //Lanzar notificación
        obtenerEndpoint().then(suscripcion=>{
            const payload = {
                "notification": {
                    "title": "Diagnostico terminado",
                    "data": {
                        "onActionClick": {
                            "default": {"operation": "openWindow", "url": "/absolute/path"},
                            "explore": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"}
                        }
                    },
                    "body": msg + " del "+new Date()+" ver",
                    "vibrate": [100, 50, 100],
                    "actions": [{
                        "action": "explore",
                        "title": "Sistema de monitoreo de red basado en la latencia"
                    }]
                }
            }
            console.log('suscripcion es: '+suscripcion);
            enviarNotificacion(suscripcion, payload);
        });


    });


}

async function listarAlertas() {
    const alertaList = await listUltimas10Alertas();
    return alertaList;
}

async function actualizarAlerta(idAlerta){

    console.log('*****actualizarAlerta*******');
    const filter = { _id: idAlerta };
    const update = { leido: true };

    let doc = await Alerta.findOneAndUpdate(filter, update);

}
module.exports = {
    crearAlertaConNotificacion,
    listarAlertas,
    actualizarAlerta
}
