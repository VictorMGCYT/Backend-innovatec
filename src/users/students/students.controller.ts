import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('create')
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get('get')
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.studentsService.findAll(paginationDto);
  }

  @Get('get/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.findOne(id);
  }

  // Método post para subir el CV
  @Patch('/upload-cv/:id')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } })) // No es necesario pasar configuración aquí
  async uploadCV(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const updatedStudent = await this.studentsService.updateStudentCV(id, file);
    return { message: 'CV uploaded successfully', student: updatedStudent };
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateStudentDto: UpdateStudentDto) 
    {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
