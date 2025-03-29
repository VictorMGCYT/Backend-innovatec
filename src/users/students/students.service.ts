import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Users } from 'src/auth/entities/auth.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class StudentsService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly dataSource: DataSource
  ){}

  async create(createStudentDto: CreateStudentDto) {
    const { contact_email, password } = createStudentDto
    // Extraemos email y password del DTO para encriptar la contraseña, y hacer la insersión de
    // email y password en la tabla Users para crear la relación con su student
    // Inicia una transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    
    try {
        // Crea el usuario
        const user = this.userRepository.create({
            email: contact_email,
            password: bcrypt.hashSync(password, 10),
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

  async findAll() {

    // Rescatar todos los usuarios del backend
    const users = await this.studentRepository.find()

    return users;
  }

  async findOne(id: string) {
    
    // Rescatar usuario por su ID
    const user = await this.studentRepository.findOneBy({id: id})
    return user;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }


  private handleDbExeptions(error: any){

    if(error.code === '23505'){
      throw new BadRequestException(error.detail)
    }

    console.log(error);
    throw new InternalServerErrorException('Please check server logs')

  }
}
