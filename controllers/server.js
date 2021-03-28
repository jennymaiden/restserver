const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/configDB');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //Conectar base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();

        //Microservicios
        this.microserver(); 

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
    }

}

module.exports = Server;