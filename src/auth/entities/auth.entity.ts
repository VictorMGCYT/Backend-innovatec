import { Student } from "src/users/students/entities/student.entity";
import { text } from "stream/consumers";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "../interfaces/user-roles.interface";



@Entity()
export class Users {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    @Column({
        type: 'text',
        unique: true
    })
    password: string;

    @OneToOne(
        () => Student,
        (student) => student.user,
    )
    student: Student

    @Column({
        type: 'bool',
        default: true,
        nullable: false
    })
    isActive: boolean

    @Column({
        type: 'text',
        enum: UserRoles
    })
    role: string;

    @CreateDateColumn()
    createdAt: Date;
    
    @DeleteDateColumn()
    deletedAt: Date; 

    // TODO hacer relación con companies

}
