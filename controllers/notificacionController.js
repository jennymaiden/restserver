/**
 * Este controlador tendra la logica de la suscripcion del cliente y el envio de las notificaciones
 * al navegador*/
const { response, request } = require('express');

/**
 * Apenas abra la pagina, se consumira este servicio que recibira el enpoint de la aplicacion
 * para poder crear el servidor que este escuchando alguna notificacion
 * */
const obtenerSuscripción = (req= request, res = response) =>  {
    const idLatencia = req.params.idLatencia;

    res.json({
        msg: "get API"
    });
}

/**
 * Servicio de notificacion PUSH
 * conocer cuando se termina una muestra y se notifique que se termino y se genero una alerta
 * con esto ayudar al fron a actualizar el conteo de alertas que estan leidas y sin leer
 * */
const notificacionPush = (req= request, res = response) =>  {
    const params = req.query; //Obtener los query params
    res.json({
        msg: "get API"
    });
}

module.exports = {
    obtenerSuscripción,
    notificacionPush
}