import { createWriteStream } from "fs";
import Busboy from 'busboy';
import fs from 'fs';

export class UploadService {

public storeUpload( stream:any, filename:any) {

    new Promise<void>((resolve, reject) =>
      stream
        .pipe(createWriteStream(filename))
        .on("finish", () => resolve())
        .on("error", reject)
    );
}

public storeFS( stream:any, filename:any) {

  const uploadDir = '/uploads';
  const path = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) =>
      stream
          .on('error', (error:any) => {
              if (stream.truncated)
                  // delete the truncated file
                  fs.unlinkSync(path);
              reject(error);
          })
          .pipe(fs.createWriteStream(path))
          .on('error', (error:any) => reject(error))
          .on('finish', () => resolve({ path }))
  );
}

}