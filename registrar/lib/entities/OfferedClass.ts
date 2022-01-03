import "reflect-metadata";
import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToMany
} from "typeorm";
import { Student } from './Student.js';

@Entity()
export class OfferedClass {

    @PrimaryColumn({
        length: 10
    }) code: string;
    @Column({
        length: 100
    })  name: string;
    @Column("int")  hours: number;

    @ManyToMany(type => Student, student => student.classes)
    students: Student[];
}
