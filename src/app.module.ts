import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './users/students/students.module';
import { CompaniesModule } from './users/companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ 

    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // Only localhost in this case
      port: Number(process.env.DB_PORT) ?? 5433, // 5433
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, // ! Don't use this in production
    }),

    StudentsModule,

    CompaniesModule,

    AuthModule,
    
    CommonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
