import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/sockets';

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;
    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();    
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = new socketIO.Server( this.httpServer, { cors: { origin: true, credentials: true } } );

        this.escucharSockets();

    }

    public static get instance(){
        return this._instance || ( this._instance = new this());
    }

    private escucharSockets(){
        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {


            // Conectar cliente
            socket.conectarCliente( cliente, this.io );
            
            // Configurar usuario
            socket.configurarUsuario( cliente, this.io );

            // Mensajes
            socket.mensaje( cliente, this.io );

            // Obtener usuarios
            socket.obtenerUsuarios( cliente, this.io);
            
            // Desconectado
            socket.desconectado( cliente, this.io );


        })
    }

    start(callback: () => void ){

        this.httpServer.listen( this.port, callback );

    }
}