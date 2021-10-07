const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/configDB');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.httpServer = require("http").createServer(this.app);
        this.io = require("socket.io")(this.httpServer);

        //Conectar base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();

        //Microservicios
        this.microserver();

        // websocket
        this.conectSocket();

    }

    async conectarDB(){
        await dbConnection();
    }
    middlewares(){

        //CORS
        this.app.use(cors());

        //lectura y parceo del body
        this.app.use(express.json());
        //Directorio publico
        this.app.use(express.static('public'));

    }

    microserver(){

        this.app.use('/api/monitoreo', require('../routers/monitoreoRouter'));
    }

    listen(){
        this.app.listen(this.port , ()=>{
            console.log('Servidor corriendo en el puerto ', this.port);
        });
        this.httpServer.listen(3000,  ()=>{
            console.log('Socket corriendo en el puerto ', 3000);
        });
    }

    conectSocket(){

        /**
         * -----------------------------------------------------
         * Socket.io conexion
         * ----------------------------------------------------
         */

        this.io.on('connection', function (socket) {

            /** handshake: Es el id de conexion con el dispositivo cliente */
            const id_handshake = socket.id;
            console.log(`Nuevo dispositivo conectado: ${id_handshake}`);

            /**
             * --------- EMITIR -------------
             * Para probar la conexion con el dispositivo unico le emitimos un mensaje a el dispositivo conectado
             */
            socket.emit('enviar', {
                msg: `Hola tu eres el dispositivo ${id_handshake}, perteneces a la sala`
            });

            /**
             * ----------- ESCUCHAR -------------
             * Cuando el cliente nos emite un mensaje la api los escucha de la siguiente manera
             */
            socket.on('enviar', (res) =>{
                console.log('llego al servidor '+ res);

            });
            /**
             * Si un dispositivo se desconecto lo detectamos aqui
             */
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
        });
    }

}

module.exports = Server;
