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
const Parametro = require('../models/parametros');
const  Latencia = require('../models/latencia');
const decoder = new StringDecoder('utf8');

function crearLatencia(idParametro){

    const latenciaModel = new Latencia();
    latenciaModel.idParametros = idParametro;
    latenciaModel.save();
    return latenciaModel;
}
function guardarParametros(parametroBody){
    const parametro = new Parametro(parametroBody);
    parametro.save();
    return parametro;
}

function ping ( tamanio, url, cliente,idParametro) {
    const auxPing = spawn("ping", ["-l "+tamanio, url], {
        env: {
            NODE_ENV: 'production',
            PATH: process.env.PATH
        }
    });
    var muestraModel = new Muestra();
    
    //const muestra = new Muestra();
    //Se ejecuta mientras no alla error
    auxPing.stdout.on("data", data =>{
        //console.log(`stdout: ${data}`);
        message = decoder.write(data);
        muestraModel = identificarLinea(message, cliente,idParametro);
        // console.log('la muestra es: '+muestraModel.id);
        // muestraModel.save();
        // muestra.update()
        
    });

    auxPing.stderr.on("data", data => {
        console.log(`stderr *****Si ocurre algun error *: ${data}`);
        muestraModel.msgError = data;
        muestraModel.save();
        //Aqui sale algun error que se presente durante el flujo de los datos
    });

    auxPing.on('error', (error) => {
        console.log(`error: ${error.message}`);
        //Si no se ejecuta mostrar aqui el error de  por el cual no se ejecuto el comando
    });

    auxPing.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });

    return auxPing;
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
    console.log("cliente : "+cliente)
    if(lineas.includes('timeout')){
        auxError = lineas.split(' ');
        console.log("auxError: "+auxError);
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
          console.log("MENSAJE: "+lineas);
          if (lineas.includes('timeout')){
              auxMsgError = 'timeout';
          }else{
              auxMsgError = lineas;
          }

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
                console.log('Tiempo : '+time[1]);
                auxTiempoRespuesta = time[1];
            }
            
            
        }, this);

    }else {
        // TODO: Guardar algun fallo
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
module.exports= {
    ping,
    guardarParametros,
    crearLatencia
}
