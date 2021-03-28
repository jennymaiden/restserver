const { Router, response } = require('express');
const { monitoreoTiempoReal, monitoreoProgramado}= require('../controllers/monitoreoController')
const {obtenerSuscripción, notificacionPush } = require('../controllers/notificacionController')
const {verAlertas } = require('../controllers/alertasController')
const {verDiagnostico } = require('../controllers/diagnosticoController')

const router = Router();

//Servicio de  ver diagnostico de red
router.get('/diagnostico/:idLatencia', verDiagnostico);

//Servicio de ver las alertas
router.get('/alertas', verAlertas);

//Servicio de monitoreo en tiempo real
router.post('/tiemporeal', monitoreoTiempoReal);

//Servicio de monitoreo programado
router.post('/programado', monitoreoProgramado);

//Servicio suscripcion a las notificaciones
router.post('/suscripcion', obtenerSuscripción);

//Servicio suscripcion a las notificaciones
router.post('/notificacion', notificacionPush);



module.exports = router;