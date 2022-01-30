
import {
    Entity, PrimaryGeneratedColumn,
    Column, BeforeInsert, BeforeUpdate,
} from "typeorm";

import {
    validateOrReject, IsString, IsAscii, Matches
} from 'class-validator';

/**
 * Records information about hobbies practiced by students.
 */
@Entity()
export class StudentHobby {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @IsAscii()
    @Matches(/^[a-zA-Z ]+$/)
    name: string;

    @BeforeInsert()
    async validateInsert() { await validateOrReject(this); }

    @BeforeUpdate()
    async validateUpdate() { await validateOrReject(this); }
}
