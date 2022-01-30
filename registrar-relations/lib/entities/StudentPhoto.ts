
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BeforeInsert,
    BeforeUpdate,
} from "typeorm";

import {
    validateOrReject,
    IsString,
    IsUrl
} from 'class-validator';

import { Student } from "./Student";

@Entity()
export class StudentPhoto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @IsUrl()
    url: string;

    @ManyToOne(() => Student,
            student => student.photos)
    student: Student;

    @BeforeInsert()
    async validateInsert() { await validateOrReject(this); }

    @BeforeUpdate()
    async validateUpdate() { await validateOrReject(this); }
}
