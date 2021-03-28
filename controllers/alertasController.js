/**
 * Este controlador tenda los servicios de consultar las alertas*/
const { response, request } = require('express');


/**
 *Servicio para mostrar las alertas
 * Listar las alertas que se tengan con su estados
 * adicionar el contador de esas alertas cuales estan leidas y cuales no
 */
const verAlertas = (req= request, res = response) =>  {
    const params = req.query; //Obtener los query params
    res.json({
        msg: "get API"
    });
}

module.exports = {
    verAlertas
}