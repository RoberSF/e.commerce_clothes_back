// Requires (Importación de librerías para que funcione algo)
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload'); // librería para subir archivos
const fs = require('fs'); // para borrar archivos
const path = require('path');




// ********************************************************************************************************************
//                                                 Middleware
//******************************************************************************************************************* */
// app.use(fileUpload()); 
app.use(fileUpload({ useTempFiles: true })); //actualización


// ********************RUTAS*******************************
app.put('/upload', (request:any, response:any) => { // el tipo y el id son para asignarles el nombre al archivo. 

console.log(request.files);

    if (!request.files) {
        return response.status(400).json({
            ok: false,
            mensaje: 'No files'
        })
    }


    // Obtener nombre del archivo para verificar que es una imagen

    var archivo = request.files.imagen;
    var nombreCortado = archivo.name.split('.') // con esto consigo la extension. Divide por cada punto que encuentre, pero sabemos que el ultimo(split) es la extension
    var extensionArchivo = nombreCortado[nombreCortado.length - 1] //cogemos la ultima palabra del array de nombreCortado

    // Solo aceptamos estas extensiones

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Extension no valida'
        })
    }

    // Nombre de archivo personalizado para que no haya conflictos. Podemos hacerlo de la manera que queramos
    // el nombre será el id - un numero random.la extensión

    let newNameFile = `${new Date().getMilliseconds()}.${extensionArchivo}`;


    // Muevo el archivo del limbo temporal a un path donde yo lo quiero

    let path = (`./uploads/${newNameFile}`); // los parentesis son obligatorios

    archivo.mv(path, (err:any) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        subirPorTipo(newNameFile, response);
    })




});





function subirPorTipo(newNameFile:any, response:any) {



            // var pathViejo = './uploads/usuarios/' + usuario.img;
            var pathViejo = path.resolve(__dirname, `./uploads`); //actualización

            // si existe img, elimina la imagen
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, () => {}); // me tirraba error si no le ponía el callback 
            }
    }



module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso