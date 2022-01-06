import "reflect-metadata";
import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToMany
} from "typeorm";

import {
    IsInt,
    IsOptional,
    Matches,
    Min,
    Max,
    IsString,
    IsAscii,
} from 'class-validator';

import { Student } from './Student.js';

@Entity()
export class OfferedClass {

    @PrimaryColumn({
        length: 10
    })
    @IsString()
    @IsAscii()
    @Matches(/^[A-Z][A-Z][0-9][0-9][0-9]$/)
    code: string;

    @Column({
        length: 100
    })
    @IsString()
    @IsAscii()
    @Matches(/^[a-zA-Z ]+$/)
    name: string;

    @Column("int")
    @IsInt()
    @Min(1)
    @Max(7)
    hours: number;

    @ManyToMany(type => Student, student => student.classes)
    students: Student[];
}

export class OfferedClassUpdater {

    @Column({
        length: 100
    })
    @IsOptional()
    @IsString()
    @IsAscii()
    @Matches(/^[a-zA-Z ]+$/)
    name: string;

    @Column("int")
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(7)
    hours: number;
}
