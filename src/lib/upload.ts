import fs from 'fs';
import mkdirp from 'mkdirp';

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


export const processUpload = async (upload: any, cloudinary: any) => {
    // Nos aseguramos que existe el directorio de subida.
    mkdirp.sync(UPLOAD_DIR);
    const { createReadStream, filename, mimetype } = await upload;
    const stream = fs.createReadStream(`${UPLOAD_DIR}/${filename}`);
    // Enviar para almacenar
    const { id, path }: any = await storeFyleSystem({ stream, filename }, 'anartz.mugika');
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
    fs.unlinkSync(path);
    // Devolver la información del fichero
    return { id, path, filename, mimetype};
};





export const deleteImage = async (image_reference: string, cloudinary: any) => {
    const result = await cloudinary.v2.uploader.destroy(image_reference);
    console.log(result);
    return result.result;
};