import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Users } from 'src/auth/entities/auth.entity';
import * as bcrypt from 'bcrypt'
import { UserRoles } from 'src/auth/interfaces/user-roles.interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class StudentsService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly dataSource: DataSource,
    private readonly cloudinaryService: CloudinaryService,
  ){}

  // ******************************************************************************
  async create(createStudentDto: CreateStudentDto) {
    const { contact_email, password} = createStudentDto

    // Extraemos email y password del DTO para encriptar la contraseña, y hacer la insersión de
    // email y password en la tabla Users para crear la relación con su student
    // Inicia una transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
        // Crea el usuario
        const user = this.userRepository.create({
            email: contact_email.toLowerCase(),
            password: bcrypt.hashSync(password, 10),
            role: UserRoles.STUDENT
        });
        // Crea el estudiante
        const student = this.studentRepository.create({
            ...createStudentDto,
            user: user,
        });

        // Inserta el usuario y el estudiante dentro de la misma transacción
        await queryRunner.manager.save(student);

        // Si ambas inserciones fueron exitosas, realiza un commit
        await queryRunner.commitTransaction();
        
        return student;
    } catch (error) {
      // Si hay algún error, realiza un rollback para revertir ambas inserciones
      await queryRunner.rollbackTransaction();
      this.handleDbExeptions(error);
    }
  }

  // ******************************************************************************
  async findAll(paginationDto: PaginationDto) {
    // Hacer la paginación
    const { limit = 10, offset = 0 } = paginationDto

    // Rescatar todos los usuarios del backend
    const users = await this.studentRepository.find({
      take: limit,
      skip: offset,
    })

    return users;
  }

  // ******************************************************************************
  async findOne(id: string) {
    // TODO establecer queryBuilder para hacer consultas concidentes y no con datos exactos
    // Rescatar usuario por su ID
    const user = await this.studentRepository.findOneBy({id: id})

    if(!user){
      throw new NotFoundException(`Student with id ${id} not found`)
    }
    
    return user;
  }

  // ******************************************************************************
  async update(id: string, updateStudentDto: UpdateStudentDto) {

    let student = await this.findOne(id);

    student = this.studentRepository.merge(student, updateStudentDto)

    // Si se cambia el email, actualizar también el de 'user'
    if (updateStudentDto.contact_email && student.user) {
      student.user.email = updateStudentDto.contact_email.toLowerCase().trim();
    }

    return await this.studentRepository.save(student);
  }

  // ******************************************************************************
  async remove(id: string) {

    const student = await this.findOne(id);
    const { contact_email } = student;

    const user = await this.userRepository.findOneBy({
      email: contact_email.toLowerCase().trim(),
    })

    if (!user) {
      throw new NotFoundException(`User with email ${contact_email} not found`);
    }
    await this.userRepository.softRemove(user);
    await this.studentRepository.softRemove(student);
    
    return `User removed successfully`;
  }


  // ******************************************************************************
  // ! Subir el CV
  async updateStudentCV(id: string, file: Express.Multer.File): Promise<Student> {
    const student = await this.findOne(id);
    if (!student) {
      throw new NotFoundException('Student not found'); 
    }

    // Subimos el archivo a Cloudinary y obtenemos la URL
    const cvUrl = await this.cloudinaryService.uploadFile(file);
    student.cv_url = cvUrl;

    return this.studentRepository.save(student);
  }


  // ******************************************************************************
  private handleDbExeptions(error: any){

    if(error.code === '23505'){
      throw new BadRequestException(error.detail)
    }

    console.log(error);
    throw new InternalServerErrorException('Please check server logs')

  }
}
