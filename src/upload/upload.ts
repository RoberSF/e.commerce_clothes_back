// Requires (Importación de librerías para que funcione algo)
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload'); // librería para subir archivos
const fs = require('fs'); // para borrar archivos
const path = require('path');
import { v4 as uuidv4 } from 'uuid';




// ********************************************************************************************************************
//                                                 Middleware
//******************************************************************************************************************* */
// app.use(fileUpload()); 
app.use(fileUpload({ useTempFiles: true })); //actualización


// ********************RUTAS*******************************
app.put('/upload', (request:any, response:any) => {

    var archivo = request.files.imagen;
    var nombreCortado = archivo.name.split('.') // con esto consigo la extension. Divide por cada punto que encuentre, pero sabemos que el ultimo(split) es la extension
    var extensionArchivo = nombreCortado[nombreCortado.length - 1]

    var fileName = `${uuidv4()}.${extensionArchivo}`

    let path = (`./uploads/${fileName}`); // los parentesis son obligatorios


    archivo.mv(path, (err:any) => {

        if (err) {
            console.log(err);
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover archivo',
                    errors: err
                });
        }

       response.json({
            ok: true,
            message: 'Imagen subida'
        }) 

    })
    
    //aws(fileName);
    //cloudinaryUpload(fileName);
    
})



module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso