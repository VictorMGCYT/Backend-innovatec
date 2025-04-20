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

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Validamos que sea una URL válida de Cloudinary
      if (!fileUrl.includes('/upload/')) {
        throw new BadRequestException('Invalid Cloudinary URL');
      }
  
      // Extraer la parte después de "/upload/"
      const parts = fileUrl.split('/upload/')[1]; // "v1743886059/cv_students/hcrdqlciknmibip5nfhp.pdf"
  
      // Remover la versión y la extensión .pdf
      const pathWithoutVersion = parts.split('/').slice(1).join('/'); // "cv_students/hcrdqlciknmibip5nfhp.pdf"
      const publicId = pathWithoutVersion.replace('.pdf', '');        // "cv_students/hcrdqlciknmibip5nfhp"
      console.log(`Public ID: ${publicId}`);
      // Eliminar usando Cloudinary
      await new Promise<void>((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, {}, (error, result) => {
          if (error) return reject(error);
          if (result.result !== 'ok') {
            return reject(new Error('Failed to delete file'));
          }
          resolve();
        });
      });
  
      console.log(`Archivo eliminado: ${publicId}`);
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      throw new BadRequestException('Error deleting file');
    }
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
