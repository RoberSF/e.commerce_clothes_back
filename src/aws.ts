import AWS from "aws-sdk";
import { ReadStream } from "fs-capacitor";
import stream from "stream";

type S3UploadConfig = {
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
  destinationBucketName: string;
  region?: string;
};

type S3UploadStream = {
    writeStream: stream.PassThrough;
    promise: Promise<AWS.S3.ManagedUpload.SendData>;
  };

export type File = {
    id: String;
    filename: string;
    mimetype: string;
    encoding: string;
    stream?: ReadStream;
  }
  
  export type UploadedFileResponse = {
    id: string;
    filename: string;
    mimetype: string;
    encoding: string;
    url: string;
  }
  
  export interface IUploader {
    singleFileUploadResolver: (
     parent:any, 
     { file } : { file: Promise<File> }
    ) => Promise<UploadedFileResponse>;
  }




export class AWSS3Uploader implements IUploader {
  private s3: AWS.S3;
  public config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: "eu-central-1",
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    });

    this.s3 = new AWS.S3();
    this.config = config;
  }

  private createUploadStream(key: string): S3UploadStream {
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: this.s3
        .upload({
          Bucket: this.config.destinationBucketName,
          Key: key,
          Body: pass
        })
        .promise()
    };
  }

  private createDestinationFilePath(
    fileName: string,
    mimetype: string,
    encoding: string
  ): string {
    return fileName;
  }

  async singleFileUploadResolver(
    parent:any,
    { file }: { file: Promise<File> }
  ): Promise<UploadedFileResponse> {
    const { stream, filename, mimetype, encoding } = await file;

    const filePath = this.createDestinationFilePath(
        filename,
        mimetype,
        encoding
      );

    const uploadStream = this.createUploadStream(filePath);

    stream?.pipe(uploadStream.writeStream);

    const result = await uploadStream.promise;

    const link = result.Location;

      return { id: '',filename, mimetype, encoding, url: '' };
  }
}