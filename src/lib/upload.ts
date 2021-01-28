import fs from 'fs';
import mkdirp from 'mkdirp';
import { v4 as uuidv4 } from 'uuid';
var cloudinary = require('cloudinary');
const UPLOAD_DIR = './uploads';
import AWS from 'aws-sdk';
import { updateOne, findOneElement, updateScreenshoots, deleteFirstElemArray } from './db-functions';
import { Db } from 'mongodb';
import Database from './database';

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



export const deleteImage = async (image_reference: string) => {

    const result = await cloudinary.v2.uploader.destroy(image_reference);
    console.log(result);
    return result.result;
};


export const mv = (file:any, type:any, id:any) => {


    return new Promise(function(resolve, reject) {

        var fileSplit = file.name.split('.');
        var extensionFile = fileSplit[fileSplit.length - 1];
        var fileName = `${fileSplit[0]}_${uuidv4()}`;
        let path = (`./uploads/${fileName}`);
        let typesAvailable = ['colors', 'products', 'screenshoots'];
        var extensionFile = fileSplit[fileSplit.length - 1];
        var extensionAvailable = ['png', 'jpg', 'gif', 'jpeg'];

        //validaciones
    
        if (!file) {
            return reject({
                status: false,
                mensaje: 'No files'
            })
        }
    
        if (typesAvailable.indexOf(type) < 0) {
            return reject({
                ok: false,
                mensaje: 'tipos de colección no válidos',
                errors: { message: 'Tipo de colección no es válida' }
            });
        }
    
        if (extensionAvailable.indexOf(extensionFile) < 0) {
            return reject({
                ok: false,
                mensaje: 'Extension no valida'
            })
        }
    
    
            file.mv(path, async (err:any) => {
    
                if (err) {
                    console.log('if',err);
                    return {
                        status: false,
                        message: 'Subida fallida en el server local'
                    }
                }
            
                //const awsResult = await aws(fileName, type)
                const cloudiResult = await cloudi(fileName, type)
                //Actualizar en MongoDB
                const saveDb = await saveUrl(cloudiResult, type, id);

                if( cloudiResult != true) {
                    reject ({
                        status: false,
                        message: 'No se ha guardado en la nube'
                    })
                } 
                
                if ( saveDb != true) {
                    reject ({
                        status: false,
                        message: 'No se ha guardado en la nube y tampoco en la base de datos'
                    })
                }

                

                resolve({
                   status:true,
                   message: 'Subida correcta',
                })
    
            })
            
    })



}


export const aws = async (fileName:any, type:any) => {


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
    
        return await uploadAWS(params,fileName)

}

export const uploadAWS = (params:any, fileName:any ) => {

    return new Promise(function(resolve, reject) {

        var s3 = new AWS.S3();

        s3.upload(params, function(err:any, data:any) {
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

export const cloudi = async (fileName:any, type:any) => {

    cloudinary.config({ 
        cloud_name: 'dvjue4lwj', 
        api_key: '757978864638286', 
        api_secret: 'bX5Ebo0pG9fCQVxJZyTge5gMJFk' 
      });

      const cloudiResult = await cloudinaryUpload(fileName, type)
      return cloudiResult
}

export const cloudinaryUpload = (fileName:any, type:any) => {

    return new Promise(function(resolve, reject) {

    
    cloudinary.v2.uploader.upload(`C:/Users/usuario/Desktop/Programacion/e-commerce - ropa/BackEnd/backend-meang-publi-online-shop/uploads/${fileName}`,
            {folder:`${type}`, public_id: fileName},
          function(error:any, data:any) {

              if(data) {
                fs.unlink(`C:/Users/usuario/Desktop/Programacion/e-commerce - ropa/BackEnd/backend-meang-publi-online-shop/uploads/${fileName}`, () => {});
                return resolve ({
                    status: true,
                    message: data
                })
              } 

              if(error) {
                return reject({
                    status: false,
                    message: error
              })
              }
          }
        );
        })

}

export const saveUrl = async( result:any, type:any, id:any ) => {

    const database = new Database();
    const db = await database.init();


    try {

        if(type === 'screenshoots') {

            let screenshoots = result.message.url;
            const checkUrl = await findOneElement(db, type, {id: id});

            if(checkUrl.screenshoots.length >= 5) {
                // coge la referencia 
                let urlSplit = checkUrl.screenshoots[0].split('/');
                let lastElement = urlSplit[urlSplit.length -1].split('.')[0];
                let imageReference = `${type}/${lastElement}`;
                // borra de clodinary
                await deleteImage(imageReference);
                // borra de mongoDB el último o primer elemento 
                const deleteFirst =  await deleteFirstElemArray(db, type, {id: id});
            }
            await updateScreenshoots(db,{id: id, collection: type, screenshoots: screenshoots })
            return true
        }

        var objectImg = { img: result.message.url};
        const checkUrl = await findOneElement(db, type, {id:id});
        if (checkUrl.img ) {
            let urlSplit = checkUrl.img.split('/');
            let lastElement = urlSplit[urlSplit.length -1].split('.')[0]
            let imageReference = `${type}/${lastElement}`
            await deleteImage(imageReference)
            await updateOne(db,type,{id: id}, objectImg)

            return true
        }

    } catch(error) {
        return error
    }


}

    