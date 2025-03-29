import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/auth.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([Users])
  ],
  exports: [TypeOrmModule]
})
export class AuthModule {}
