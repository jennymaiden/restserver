/**
 * Este controlador tendra la logica de la suscripcion del cliente y el envio de las notificaciones
 * al navegador*/
const { response, request } = require('express');
const {webpush, obtenerEndpoint, guardarSuscripcion, enviarNotificacion} = require("../microservices/notificacionService");

/**
 * Apenas abra la pagina, se consumira este servicio que recibira el enpoint de la aplicacion
 * para poder crear el servidor que este escuchando alguna notificacion
 * */
const obtenerSuscripción = async (req= request, res = response) =>  {

    try{
        var pushSubscripton = req.body;
        const suscripcion = await guardarSuscripcion(pushSubscripton);

        res.status(201).json({
            msg: "Suscripción exitosa",
            suscripcion
        });
    }catch (error){
        res.status( 500 ).json({
            msg: error
        });
    }

}


/**
 * Servicio de notificacion PUSH
 * conocer cuando se termina una muestra y se notifique que se termino y se genero una alerta
 * con esto ayudar al fron a actualizar el conteo de alertas que estan leidas y sin leer
 * */
const  notificacionPush = async (req = request, res = response) => {
//Documentacion : https://github.com/FaztWeb/node-web-push-notifaction/blob/master/src/webpush.js
    try{
        const pushSubscripton = await obtenerEndpoint();
        console.log('suscripcion '+pushSubscripton);

        const payload = {
            "notification": {
                "title": "Diagnostico terminado",
                "body": "Muestra de latencia fallida del 13/06/2021 ver",
                "vibrate": [100, 50, 100],
                "actions": [{
                    "action": "explore",
                    "title": "Go to the site"
                }]
            }
        }

        await enviarNotificacion(pushSubscripton, payload);

        res.status(200).json();
    }catch (error){
        res.status( 500 ).json({
            msg: error
        });
    }

}

module.exports = {
    obtenerSuscripción,
    notificacionPush
}
