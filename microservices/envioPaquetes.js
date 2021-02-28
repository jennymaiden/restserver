var shell = require('shelljs');

//var version = shell.exec('ping -c 3 google.com', {silent:true}).stdout;
 
/*var child = shell.exec('ping -c 3 google.com', {async:true});
child.stdout.on('data', function(data) {
    console.log("****************");
    console.log(data);
    console.log("...................");
  /* ... do something with data ... */
//});
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
 
// shell.exec('ping -c 3  -s 76 google.com', function(code, stdout, stderr) {
//     console.log('Exit code:', code);
//     if (code == 0){
//         //Guardar la respuesta del comando
//         console.log("Resultado");
//         console.log('Program output:', stdout);
//     }else{
//         //Ocurrio un error en la lectura uardar en el diagnostico y generar alerta
//         console.log('algo salio mal');
//         console.log('Program stderr:', stderr);
//     }

// });


const { spawn } = require("child_process");
const { StringDecoder } = require('string_decoder');
const { muestra } = require("modelos/*");

const ls = spawn("ping", ["-c 3",  "-s 76", "google.com"]);
const decoder = new StringDecoder('utf8');

ls.stdout.on("data", data => {
    console.log("***************");
    console.log(`stdout: ${data}`);
    message = decoder.write(data);
    identificarLinea(message);
    

    console.log("------------------");
});

ls.stderr.on("data", data => {
    console.log(`stderr ******: ${data}`);
});

ls.on('error', (error) => {
    console.log(`error: ${error.message}`);
});

ls.on("close", code => {
    console.log(`child process exited with code ${code}`);
});


/*
Función para mapear los campos  Muesta:
{   NumeroPaquete:1(icmp_seq),
    tiempoRespuesta:20.681 ms,
    TTL:117,
    tamañoPaquete:64 bytes,
}*/
function identificarLinea( lineas){

    valor = lineas.split(/\n/);
    console.log("tamanio : "+valor.length)
    if(lineas.includes('timeout')){
        auxError = lineas.split(' ');
        let icmp_seq =0;
        auxError.forEach(function(element, index, array) {
            if(element == 'icmp_seq'){
                icmp_seq = array[index+1];
            }
            
          }, this);

    }
    switch(valor.length) {
        case 3:
            if(valor[0].includes('PING')){
                //Algo paso con la muestra que no se envio
                if(lineas.includes('timeout')){
                    //Paquete no enviado 
                    return 'timeout'
                }
                
            }else if(valor[0].includes('icmp_seq') && valor[0].includes('bytes')){
                console.log("Muestra"+valor[0]);
                return 'valor[0]'
            }else{
                return 'timeout'
            }
          // code block
          break;
        case 4:
          // Llamado del comando PING y primer paquete
          if(valor[0].includes('PING')){
            //Algo paso con la muestra que no se envio
            if(valor.includes('timeout')){
                //Paquete no enviado 
                return 'timeout'
            }
            
        }else if(valor[0].includes('icmp_seq') && valor[0].includes('bytes')){
            console.log("Muestra"+valor[0]);
            return 'valor[0]'
        }else{
            return 'timeout'
        }
          break;
        case 5:
          // code block
          break;
        default:
          // code block
      }
}