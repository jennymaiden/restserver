/**
 * PARA WINDOWS
 * n ->numero de paquetes que se quieren enviar
 * l -> Tamaño de los paquetes
 * i -> Tiempo de vida TTL
 * 
 * PARA MAC OS
 * c -> Numero de paquetes que se quieren enviar
 * s ->Tamañio de los paquetes
 * m ->Tiempo de vida TTL
 * https://www.npmjs.com/package/shelljs
 * https://www.real-world-systems.com/docs/ping.1.html
 */
const { spawn } = require("child_process");
const { StringDecoder } = require('string_decoder');

const { Muestra } = require("../models/muestra");
const decoder = new StringDecoder('utf8');

const ping = (paquetes, tamanio, url) =>{
    const auxPing = spawn("ping", ["-c "+paquetes,  "-s "+tamanio, url]);
    
    const muestra = new Muestra();
    //Se ejecuta mientras no alla error
    auxPing.stdout.on("data", data =>{
        //console.log(`stdout: ${data}`);
        message = decoder.write(data);
        muestra = identificarLinea(message);
        console.log('la muestra es: '+muestra);
    });

    auxPing.stderr.on("data", data => {
        console.log(`stderr *****Si ocurre algun error *: ${data}`);
    });

    auxPing.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });

    auxPing.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });

}

/*
Función para mapear los campos  Muesta:
{   NumeroPaquete:1(icmp_seq),
    tiempoRespuesta:20.681 ms,
    TTL:117,
    tamañoPaquete:64 bytes,
}*/
function identificarLinea  ( lineas){

    const muestra = new Muestra();

    valor = lineas.split(/\n/);
    console.log("tamanio : "+valor.length)
    if(lineas.includes('timeout')){
        auxError = lineas.split(' ');
        let icmp_seq =0;
        auxError.forEach(function(element, index, array) {
            if(element == 'icmp_seq'){
                icmp_seq = array[index+1];
                console.log("el paquete que se perdio fue el "+icmp_seq);
            }
            
          }, this);
          muestra.NumeroPaquete= icmp_seq;
          muestra.tiempoRespuesta = 0;
          muestra.TTL= 0;
          muestra.tamanio = 0;
          muestra.msgError = "timeout";

    }else if(!valor[0].includes('PING') && valor[0].includes('icmp_seq') && valor[0].includes('bytes')){
        cadena = valor[0].split(" ");

        muestra.tamanio = cadena[0];

        cadena.forEach(function(element, index, array) {
            if(element.includes('icmp_seq')){
                icmp_seq = element.split('=');
                muestra.NumeroPaquete= icmp_seq[1];
            }else if(element.includes('ttl')){
                ttl = element.split('=');
                muestra.TTL= ttl[1];
            }else if(element.includes('time')){
                time = element.split('=');
                muestra.tiempoRespuesta = time[1];
            }
            
        }, this);

    }
    return muestra;
}

//Exportar
module.exports= ping