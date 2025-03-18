import { text } from "stream/consumers";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    // user_id referencia a la tabla users para el auth

    @Column({
        type: 'text',
        nullable: false
    })
    name: string;

    @Column({
        type: 'text',
        nullable: false
    })
    career: string;

    @Column({
        type: 'text',
        nullable: true
    })
    skills?: string;

    @Column({
        type: 'text',
        nullable: true
    })
    languages?: string;

    @Column({
        type: 'text',
        nullable: true,
        unique: true
    })
    cv_url?: string;

    @Column({
        type: 'text',
        unique: true
    })
    contact_email: string;

    @Column({
        type: 'text',
        unique: true
    })
    phone_number: string;

    @Column({
        type: 'bool',
        default: true,
        nullable: false
    })
    public_profile: boolean

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date; 
}
