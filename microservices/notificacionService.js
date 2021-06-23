/**
 * Servicio para generar la notificación*/
const webpush = require("web-push");
const  Suscripcion  = require("../models/Suscripcion");
const { PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } = process.env;
const {obtenerSuscripcion, guardarSuscrip} = require('../repositoryDB/suscripcionRepository');

webpush.setVapidDetails(
    "mailto:example@yourdomain.org",
    PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
);

/**
 * Funcion para guardar la suscripcion*/
async function guardarSuscripcion(suscripcion){
    var suscripcionModelo = new Suscripcion({
        auth: suscripcion.keys.auth,
        p256dh: suscripcion.keys.p256dh,
        endpoint: suscripcion.endpoint
    });
    var suscripcion = await guardarSuscrip(suscripcionModelo);
    return suscripcion;
}
/**
 * Función para obtener la suscripcion del cliente*/
async function obtenerEndpoint(){
    // var suscripcionDB = await obtenerSuscripcion();

    const pushSubscripton = {
        endpoint: 'https://fcm.googleapis.com/fcm/send/c4t6spzGtVU:APA91bH3rkZufDDciNTcjD6KvkgsCvCiF8h6L7S8KxqDFzatpXqzvfvmqG1iHhqXKiBhOBJjiVOqD2rMiHJDW7tfVIF8d75XudPleNc4sdzgiqTeKfi-8jyOS6QC5TOg400lJGqrTnys',
        keys: {
            auth: 'D9v6M6rB1IfhxwHCvE1h6A',
            p256dh: 'BNXZ7VZ6akr4VDwP9-3agv_4jJgJEWX2bznPTi28oEwNCg72pIvp2fzO5HoTVvaZZWY729EbYl8D94eiq9hqmXM'
        }
    };
    // const pushSubscripton = {
    //     endpoint: suscripcionDB.endpoint,
    //     keys: {
    //         auth: suscripcionDB.auth,
    //         p256dh: suscripcionDB.p256dh
    //     }
    // };
    return pushSubscripton;
}

module.exports = {
    webpush,
    obtenerEndpoint,
    guardarSuscripcion
};
