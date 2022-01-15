import { 
    BeforeInsert,
    BeforeUpdate,
    Entity,
    PrimaryGeneratedColumn,
    Column
} from "typeorm";

import {
    validateOrReject,
    Matches,
    IsString,
    IsAscii
} from 'class-validator';

@Entity()
export class StudentPet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @IsAscii()
    @Matches(/^[a-zA-Z ]+$/)
    name: string;

    @Column()
    @IsString()
    @IsAscii()
    @Matches(/^[a-zA-Z ]+$/)
    breed: string;

    @BeforeInsert()
    async validateInsert() {
        await validateOrReject(this);
    }

    @BeforeUpdate()
    async validateUpdate() {
        await validateOrReject(this);
    }
}
