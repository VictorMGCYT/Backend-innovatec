import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>
  ){}

  async create(createStudentDto: CreateStudentDto) {

    try {
      
      const student = await this.studentRepository.create(createStudentDto);
      await this.studentRepository.save(student)
      return student;

    } catch (error) {
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
