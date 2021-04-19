const cron = require('node-cron');
const ping = require('./envioPaquetes');

/***Los parametros del cron jobs es
 * Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11 (Jan-Dec)
Day of Week: 0-6 (Sun-Sat)
 */
const tarea = (minutos, hora,dia, mes) =>{

    cron.schedule('* '+minutos+' '+hora+' '+dia+' '+mes+' *',()=>{
        console.log("------********************-----");

        ping(76,'google.com');
    });
}

module.exports = tarea;