import { Users } from "src/auth/entities/auth.entity";
import { text } from "stream/consumers";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        nullable: false
    })
    firstName: string;

    @Column({
        type: 'text',
        nullable: false
    })
    paternalSurname: string;

    @Column({
        type: 'text',
        nullable: false
    })
    maternalSurname: string;


    @Column({
        type: 'text',
        nullable: false
    })
    career: string;

    @Column({
        type: 'text',
        nullable: true,
        array: true
    })
    skills?: string[];

    @Column({
        type: 'text',
        nullable: true,
        array: true
    })
    languages?: string[];

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
        unique: true,
    })
    phone_number: string;

    @OneToOne(
        () => Users,
        (user) => user.student,
        {
            eager: true,
            cascade: ['insert', 'update', 'remove']
        },
    )
    @JoinColumn()
    user: Users;

    @Column({ type: "date", nullable: false})
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date; 

    @BeforeInsert()
    beforeInsertStudent(){
        this.contact_email = this.contact_email.toLowerCase().trim();
        this.firstName = this.firstName.toLowerCase().trim().replaceAll(/\s+/g, ' ');
        this.paternalSurname = this.paternalSurname.toLowerCase().trim().replaceAll(/\s+/g, ' ');
        this.maternalSurname = this.maternalSurname.toLowerCase().trim().replaceAll(/\s+/g, ' ');
        this.career = this.career.trim().replaceAll(/\s+/g, ' ');
        this.createdAt = new Date();
    }

    @BeforeUpdate()
    beforeUpdateStudent() {
        if (this.contact_email) this.contact_email = this.contact_email.toLowerCase().trim();
        if (this.firstName) this.firstName = this.firstName.toLowerCase().trim().replaceAll(/\s+/g, ' ');
        if (this.paternalSurname) this.paternalSurname = this.paternalSurname.toLowerCase().trim().replaceAll(/\s+/g, ' ');
        if (this.maternalSurname) this.maternalSurname = this.maternalSurname.toLowerCase().trim().replaceAll(/\s+/g, ' ');
        if (this.career) this.career = this.career.trim().replaceAll(/\s+/g, ' ');
    }

}
