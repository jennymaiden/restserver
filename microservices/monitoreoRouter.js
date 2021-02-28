const { Router, response } = require('express');
const { monitoreoTiempoReal, 
        verDiagnostico , 
        verAlertas, 
        monitoreoProgramado}= require('../controllers/monitoreoController')

const router = Router();

//Servicio de  ver diagnostico de red
router.get('/diagnostico/:idLatencia', verDiagnostico);

//Servicio de ver las alertas
router.get('/alertas', verAlertas);

//Servicio de monitoreo en tiempo real
router.post('/tiemporeal', monitoreoTiempoReal);

//Servicio de monitoreo programado
router.post('/programado', monitoreoProgramado);



module.exports = router;