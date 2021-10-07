const { Router, response } = require('express');
const { monitoreoTiempoReal, monitoreoProgramado, conectarSocket }= require('../controllers/monitoreoController')
const {obtenerSuscripción, notificacionPush } = require('../controllers/notificacionController')
const {verAlertas, verActualizarAlerta } = require('../controllers/alertasController')
const {verDiagnostico } = require('../controllers/diagnosticoController')
const {verGrafica } = require('../controllers/graficaController')

const router = Router();

//Servicio de  ver diagnostico de red
router.get('/diagnostico/:idLatencia', verDiagnostico);

router.get('/diagnostico', verDiagnostico);

// Servicio de ver grafica por defecto
router.get('/grafica',verGrafica);

// Servicio de ver grafica por defecto
router.get('/grafica/:idLatencia',verGrafica);

//Servicio de ver las alertas
router.get('/alertas', verAlertas);

router.get('/alertas/:idAlerta', verActualizarAlerta);

//Servicio de monitoreo en tiempo real
router.post('/tiemporeal', monitoreoTiempoReal);
router.get('/tiemporeal', conectarSocket);

//Servicio de monitoreo programado
router.post('/programado', monitoreoProgramado);

//Servicio suscripcion a las notificaciones
router.post('/suscripcion', obtenerSuscripción);

//Servicio suscripcion a las notificaciones
router.post('/notificacion', notificacionPush);

module.exports = router;
// NOTIFICACION: https://www.youtube.com/watch?v=B3O__1IiVIY
// STREAMING : https://www.youtube.com/watch?v=aTEDCotcn20
