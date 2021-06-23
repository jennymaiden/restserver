/**
 * Este controlador tendra la logica de la suscripcion del cliente y el envio de las notificaciones
 * al navegador*/
const { response, request } = require('express');
const {webpush, obtenerEndpoint, guardarSuscripcion} = require("../microservices/notificacionService");

/**
 * Apenas abra la pagina, se consumira este servicio que recibira el enpoint de la aplicacion
 * para poder crear el servidor que este escuchando alguna notificacion
 * */
const obtenerSuscripción = async (req= request, res = response) =>  {

    var pushSubscripton = req.body;
    const suscripcion = await guardarSuscripcion(pushSubscripton);

    res.status(201).json({
        msg: "Suscripción exitosa",
        suscripcion
    });
}


/**
 * Servicio de notificacion PUSH
 * conocer cuando se termina una muestra y se notifique que se termino y se genero una alerta
 * con esto ayudar al fron a actualizar el conteo de alertas que estan leidas y sin leer
 * */
const  notificacionPush = async (req = request, res = response) => {
//Documentacion : https://github.com/FaztWeb/node-web-push-notifaction/blob/master/src/webpush.js
    const {message2} = req.body;
    // Payload Notification
    // const payload = JSON.stringify({
    //     title: "Diagnostico terminado",
    //     message: "Muestra de latencia exitosa del 24/02/2021 ver"
    // });
    const pushSubscripton = await obtenerEndpoint();
    console.log('suscripcion '+pushSubscripton);

    const payload = {
        "notification": {
            "title": "Diagnostico terminado",
            "body": "Muestra de latencia fallida del 13/06/2021 ver",
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
        await webpush.sendNotification(
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
