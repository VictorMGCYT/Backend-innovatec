import * as path from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';


@Injectable()
export class CloudinaryService {
  
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }
  
  async uploadFile(file: Express.Multer.File): Promise<string> {

    if(!file || !file.originalname || !file.buffer) {
      throw new BadRequestException('File is required');
    }
    console.log(file)
    const fileName = file.originalname;
    const extension = path.extname(fileName);

    // Validar la extensión del archivo
    if( extension !== '.pdf'){
      throw new BadRequestException('Invalid file type. Only PDF files are allowed.');
    }


    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: 'auto', 
          folder: 'cv_students',// Especificamos el nombre del archivo con su extensión\
          access_mode: 'public',
        }, 
        (error, result) => {
          if (error) {
            reject(error);
          }
          if (!result || !result.secure_url) {
            reject(new Error('Error uploading file to Cloudinary'));
          } else {
            resolve(result.secure_url); // Devolvemos la URL del archivo subido
          }
        },
      ).end(file.buffer); // Enviamos el archivo en el buffer
    });
  }

}
