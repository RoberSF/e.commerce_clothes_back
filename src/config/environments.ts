import dotenv from 'dotenv'; // librería para las variables de entorno

//Esta configuración la hacemos trabajar con el código en desarrollo.

// En producción, heroku ya nos permite asignar variables de entorno


const environment = dotenv.config(
    {
        path: './src/.env'
    }
);

if (process.env.NODE_ENV !== 'production') {
    if (environment.error) {
        throw environment.error;
    }
}

export default environment;