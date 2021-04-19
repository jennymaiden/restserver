/**
 * Este controlador tendra la logica de la suscripcion del cliente y el envio de las notificaciones
 * al navegador*/
const { response, request } = require('express');
const webpush = require("../microservices/notificacionService");

/**
 * Apenas abra la pagina, se consumira este servicio que recibira el enpoint de la aplicacion
 * para poder crear el servidor que este escuchando alguna notificacion
 * */
const obtenerSuscripción = (req= request, res = response) =>  {
    //let pushSubscripton = req.body;

    res.status(201).json({
        msg: "Suscripción exitosa"
    });
}


/**
 * Servicio de notificacion PUSH
 * conocer cuando se termina una muestra y se notifique que se termino y se genero una alerta
 * con esto ayudar al fron a actualizar el conteo de alertas que estan leidas y sin leer
 * */
const  notificacionPush = (req= request, res = response) =>  {
//Documentacion : https://github.com/FaztWeb/node-web-push-notifaction/blob/master/src/webpush.js
    const { message2 } = req.body;
    // Payload Notification
    // const payload = JSON.stringify({
    //     title: "Diagnostico terminado",
    //     message: "Muestra de latencia exitosa del 24/02/2021 ver"
    // });
    const pushSubscripton = {
        endpoint: 'https://fcm.googleapis.com/fcm/send/eWdpIgbidqc:APA91bFl5Wwok3mzW0ndjs16BFvfXAm-nJcZj65ijfS05iKI8x9UlTl6zPfaPy-qb9HQRr2WKbPz_DGyiccNVdIkLFuCbYbu5nQv-o688F8_3Qdr5IYV7zI4SfHAt_wLGtzWURaAaUH1',
        keys: {
            auth: 'jBjmCc0ZJjw0-bLfi92R4w',
            p256dh: 'BNgbn3I4Yh2qvuj-T1BbJwySbMhQ1Uu0pi7a8_SbEGryy_aP6sorQC9fK4TGKXwvWXo1HqI-0AgQjIlW4U7_uB8'
        }
    };
    const payload = {
        "notification": {
            "title": "Diagnostico terminado",
            "body": "Muestra de latencia exitosa del 24/02/2021 ver",
            "vibrate": [100, 50, 100],
            "image": "https://avatars2.githubusercontent.com/u/15802366?s=460&u=ac6cc646599f2ed6c4699a74b15192a29177f85a&v=4",
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]
        }
    }

     try {
         //await webpush.sendNotification(pushSubscripton, payload);
         webpush.sendNotification(
             pushSubscripton,
             JSON.stringify(payload))
             .then(res => {
                 console.log('Enviado !!');
             }).catch(err => {
             console.log('Error', err);
         })
     } catch (error) {
         console.log(error);
     }

    res.status(200).json();
}

module.exports = {
    obtenerSuscripción,
    notificacionPush
}
