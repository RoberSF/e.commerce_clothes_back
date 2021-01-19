import { IContext } from './interfaces/context.interface';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import environments from './config/environments';
import { ApolloServer, PubSub } from 'apollo-server-express';
import schema from './schema';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';
import chalk from 'chalk';

/* ***************************************************************************************/
// Configuración de las variables de entorno (lectura)
//**************************************************************************************** */

if (process.env.NODE_ENV !== 'production') {
    const env = environments;
    console.log('Enviroments',env);
}


/* ***************************************************************************************/
// Trabajamos con funciones asíncronas por eso es necesario meter todo el serer dentro
//  de un función.
//**************************************************************************************** */

async function init() {

    const app = express();
    const pubsub = new PubSub(); // Para obtener las publicaciones en tiempo real. Es una conexión a webSocket
    const paypal = require('paypal-rest-sdk');

    app.use('*', cors());

    app.use(compression());


/* ***************************************************************************************/
//                     Conexión a mongoDB que está configurado en la clase Database
//**************************************************************************************** */

    const database = new Database(); // Conexión a la clase donde está mongo

    // Es una función asíncrona por tanto tenemos que esperar a que se resuelva para seguir con el código
    const db = await database.init();  // Conexión a mongo




    const context = async({req, connection}: IContext) => { // Typescript nos obliga a crear la interface a causa del tipado
        const token = (req) ? req.headers.authorization : connection.authorization;
        // return { db, token, pubsub};
        return { db, token, pubsub, paypal};
    };

/* ***************************************************************************************/
//                         Configuración apollo server y iniciar playground de graphql
//**************************************************************************************** */

    const server = new ApolloServer({
        schema, // Hace referencia al index.ts de la carpeta squema
        introspection: true, // Para que se pueda ver la info en el playground
        // context: {db} // Así recibimos directamente toda la info
        context
    });

    server.applyMiddleware({app});

    app.get('/', expressPlayground({ //Playground de graphql
        endpoint: '/graphql' // endpoint es la url a donde hago las llamadas
    }));




    const httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer) // Para escuchuchar las publicaciones a tiempo real. Tiene que ir aquí si o si.
    const PORT = process.env.PORT || 2002;
    httpServer.listen(
        {
            port: PORT
        },
        
        () => {
            console.log('==================SERVER API GRAPHQL====================');
            console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
            console.log(`MESSAGE: ${chalk.greenBright('API MEANG - Online Shop CONNECT!!')}`);
            console.log(`GraphQL Server => @: http://localhost:${PORT}/graphql `);
            console.log(`WS Connection => @: ws://localhost:${PORT}/graphql `);
        }
    );
}


/* ***************************************************************************************/
//                 Inicializamos la función init, hasta aquí el serve no está corriendo
//**************************************************************************************** */
init();

