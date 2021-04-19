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

const  Muestra  = require("../models/muestra");
const decoder = new StringDecoder('utf8');

function ejecutarPing(cliente, tamanio, url, idParametro){

    console.log("ejecucion cliente :" +cliente);
    ping(tamanio,url, cliente, idParametro);
    //ping.close();
}

const ping = ( tamanio, url, cliente,idParametro) =>{
    const auxPing = spawn("ping", ["-s "+tamanio, url]);
    
    //const muestra = new Muestra();
    //Se ejecuta mientras no alla error
    auxPing.stdout.on("data", data =>{
        //console.log(`stdout: ${data}`);
        message = decoder.write(data);
        muestra = identificarLinea(message, cliente,idParametro);
        console.log('la muestra es: '+muestra.id);
        
    });

    auxPing.stderr.on("data", data => {
        console.log(`stderr *****Si ocurre algun error *: ${data}`);
        //Aqui sale algun error que se presente durante el flujo de los datos
    });

    auxPing.on('error', (error) => {
        console.log(`error: ${error.message}`);
        //Si no se ejecuta mostrar aqui el error de  por el cual no se ejecuto el comando
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
function identificarLinea  ( lineas, cliente, idParametro){
    auxNumeroPaquete =0;
    auxTiempoRespuesta=0;
    auxTtl =0;
    auxTamanio =0;
    auxMsgError = "";
    

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
          auxNumeroPaquete= icmp_seq;
          auxTiempoRespuesta = 0;
          auxTtl= 0;
          auxTamanio = 0;
          auxMsgError = "timeout";

    }else if(!valor[0].includes('PING') && valor[0].includes('icmp_seq') && valor[0].includes('bytes')){
        cadena = valor[0].split(" ");

        auxTamanio = cadena[0];

        cadena.forEach(function(element, index, array) {
            if(element.includes('icmp_seq')){
                icmp_seq = element.split('=');
                auxNumeroPaquete= icmp_seq[1];
            }else if(element.includes('ttl')){
                ttl = element.split('=');
                auxTtl= ttl[1];
            }else if(element.includes('time')){
                time = element.split('=');
                auxTiempoRespuesta = time[1];
            }
            
            
        }, this);

    }
    
    var muestra = new Muestra ({ NumeroPaquete:auxNumeroPaquete,
        tiempoRespuesta:auxTiempoRespuesta,
        TTL:auxTtl,
        tamanio:auxTamanio,
        numCliente:cliente,
        msgError:auxMsgError,
        idParametros:idParametro
    });
    
    muestra.save();
    
    return muestra;
}

//Exportar
module.exports= {ejecutarPing, ping}