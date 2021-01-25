import fs from 'fs';
import mkdirp from 'mkdirp';
import { v4 as uuidv4 } from 'uuid';
var cloudinary = require('cloudinary');

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
const UPLOAD_DIR = './uploads';
import AWS from 'aws-sdk';


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


export const aws = async (fileName:any) => {

    AWS.config.update({
        accessKeyId: "AKIAJOJUP4HVSBUZGA5A",
        secretAccessKey: "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",
        region: 'eu-central-1' 
    });

    var params = {
        Bucket : 'shopclothes',
        Body   : fs.createReadStream(`C:/Users/usuario/Desktop/Programacion/e-commerce - ropa/BackEnd/backend-meang-publi-online-shop/uploads/${fileName}`),
        Key    : "try/" + uuidv4() + "_",
        ACL    : 'public-read'
      };

      var s3 = new AWS.S3();

      s3.upload(params, function (err:any, data:any) {
        //handle error
        if (err) {
          console.log("Error", err);
        }
      
        //success
        if (data) {
          console.log("Uploaded in:", data.Location);
        }
      });

      fs.unlink(`C:/Users/usuario/Desktop/Programacion/e-commerce - ropa/BackEnd/backend-meang-publi-online-shop/uploads/${fileName}`, () => {});
}

export const cloudinaryUpload = async(fileName:any) => {


    cloudinary.config({ 
        cloud_name: 'dvjue4lwj', 
        api_key: '757978864638286', 
        api_secret: 'bX5Ebo0pG9fCQVxJZyTge5gMJFk' 
      });

    cloudinary.v2.uploader.upload(`C:/Users/usuario/Desktop/Programacion/e-commerce - ropa/BackEnd/backend-meang-publi-online-shop/uploads/${fileName}`,
          function(error:any, result:any) {console.log(result, error)});

    fs.unlink(`C:/Users/usuario/Desktop/Programacion/e-commerce - ropa/BackEnd/backend-meang-publi-online-shop/uploads/${fileName}`, () => {});
    

    //const result = await cloudinary.v2.uploader.upload(path, {folder: process.env.PRINCIPAL_FOLDER_CLOUDINARY});
    }

    