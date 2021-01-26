import fs from 'fs';
import mkdirp from 'mkdirp';
import { v4 as uuidv4 } from 'uuid';
var cloudinary = require('cloudinary');
const UPLOAD_DIR = './uploads';
import AWS from 'aws-sdk';
import { AnyARecord } from 'dns';

/**
 * Almacenar la información en el patch especificado
 * @param param0 
*/


const storeFyleSystem = ({ stream, filename }: any, userId: string) => {
    const path = `${UPLOAD_DIR}/${filename}`;
    const id = userId;
    return new Promise((resolve, reject) =>
        stream
            .on('error', (error: any) => {
                if (stream.truncated) {
                    // Delete the truncated file.
                    // Borar el fichero local
                    fs.unlinkSync(path);
                }
                reject(error);
            })
            .pipe(fs.createWriteStream(path))
            .on('error', (error: any) => reject(error))
            .on('finish', () => resolve({ id, path }))
    );
};

/** Directorio donde se va a subir las imágenes temporalmente antes de enviarlas al servicio Cloudinary*/



export const processUpload = async (upload: any, cloudinary: any) => {

    try {
        // Nos aseguramos que existe el directorio de subida.
        mkdirp.sync(UPLOAD_DIR);
        const { createReadStream, filename, mimetype } = await upload;
        const fileName = `${uuidv4()}`
        let path = (`../../uploads/${fileName}`);
        
        console.log(path);
        const stream = fs.createReadStream(path);
        // Enviar para almacenar
        //const { id, path }: any = await storeFyleSystem({ stream, filename }, 'anartz.mugika');
        // Upload operation
        //const result = await cloudinary.v2.uploader.upload(path, {folder: process.env.PRINCIPAL_FOLDER_CLOUDINARY});
        //console.log(result);
        
        // const publicId = await (result.public_id);
        // const createdAt = await (result.created_at);
        // const url = await (result.secure_url);
        // const bytes = await (result.bytes);
        // const width = await (result.width);
        // const height = await (result.height);
        // Borrar la imagen local ahora que ya hemos enviado a la API
        //fs.unlinkSync(path);
        // Devolver la información del fichero
        return { filename, mimetype};
    } catch (error) {
        console.log('error',error);
    }

};


export const deleteImage = async (image_reference: string, cloudinary: any) => {
    const result = await cloudinary.v2.uploader.destroy(image_reference);
    console.log(result);
    return result.result;
};


export const mv = (file:any, type:any, id:any) => {

    return new Promise(function(resolve, reject){


    var fileSplit = file.name.split('.');
    var extensionFile = fileSplit[fileSplit.length - 1];
    var fileName = `${uuidv4()}.${extensionFile}`;
    let path = (`./uploads/${fileName}`);
    let typesAvailable = ['color', 'product'];
    var extensionFile = fileSplit[fileSplit.length - 1];
    var extensionAvailable = ['png', 'jpg', 'gif', 'jpeg'];

    //validaciones

    if (!file) {
        return {
            status: false,
            mensaje: 'No files'
        }
    }

    if (typesAvailable.indexOf(type) < 0) {
        return {
            ok: false,
            mensaje: 'tipos de colección no válidos',
            errors: { message: 'Tipo de colección no es válida' }
        };
    }

    if (extensionAvailable.indexOf(extensionFile) < 0) {
        return {
            ok: false,
            mensaje: 'Extension no valida'
        }
    }

    

        file.mv(path, async (err:any) => {

            if (err) {
                console.log('if',err);
                return {
                    status: false,
                    message: 'Subida fallida en el server local'
                }
            }
        
            const awsResult =  aws(fileName, type).then( (result:any) => {

                // Subir desde aquí a mongo, tengo el enlace en el result y tengo el id en los params.
                // return resolve({
                //     tatus: true,
                //     message: result.message
                // })
            })

    
        })
    // Fin de la promesa
    })
        //cloudinaryUpload(fileName, type)

}


export const aws = (fileName:any, type:any) => {

    return new Promise( function(resolve, reject) {

        let key = `${type}/` + fileName

        AWS.config.update({
            accessKeyId: "AKIAJOJUP4HVSBUZGA5A",
            secretAccessKey: "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",
            region: 'eu-central-1' 
        });
    
        var params = {
            Bucket : 'shopclothes',
            Body   : fs.createReadStream(`C:/Users/usuario/Desktop/Programacion/e-commerce - ropa/BackEnd/backend-meang-publi-online-shop/uploads/${fileName}`),
            Key    : "try/" + uuidv4() + "_", // crear carpetas acordes y añadir key
            ACL    : 'public-read'
          };
    
        const uploadAWS = upload(params,fileName).then( (result:any) => {
            return resolve({
                tatus: true,
                message: result.message
            })
        })

    })




}

export const upload = (params:any, fileName:any ) => {

    return new Promise(function(resolve, reject) {

        var s3 = new AWS.S3();

    
        s3.upload(params, function (err:any, data:any) {


            //handle error
            if (err) {
                console.log("Error", err);
                return reject({
                    status: false,
                    massage: err
                });
              }

                          //success
            if (data) {
                fs.unlink(`C:/Users/usuario/Desktop/Programacion/e-commerce - ropa/BackEnd/backend-meang-publi-online-shop/uploads/${fileName}`, () => {});
                return resolve({
                    status: true,
                    message: data.Location
                })
              }

            })
    
          })
}

export const cloudinaryUpload = async(fileName:any, type:any) => {


    cloudinary.config({ 
        cloud_name: 'dvjue4lwj', 
        api_key: '757978864638286', 
        api_secret: 'bX5Ebo0pG9fCQVxJZyTge5gMJFk' 
      });

    cloudinary.v2.uploader.upload(`C:/Users/usuario/Desktop/Programacion/e-commerce - ropa/BackEnd/backend-meang-publi-online-shop/uploads/${fileName}`,
          function(error:any, result:any) 
          {
              if(result) {
                fs.unlink(`C:/Users/usuario/Desktop/Programacion/e-commerce - ropa/BackEnd/backend-meang-publi-online-shop/uploads/${fileName}`, () => {});
                return {
                    status: true,
                    message: result
                }
              }

              return {
                  status: false,
                  message: error
              }
          }
        );

    
    

    //const result = await cloudinary.v2.uploader.upload(path, {folder: process.env.PRINCIPAL_FOLDER_CLOUDINARY});
}

    