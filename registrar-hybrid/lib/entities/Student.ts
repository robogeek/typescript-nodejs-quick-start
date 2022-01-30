
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    BeforeInsert,
    BeforeUpdate
} from "typeorm";

import {
    validateOrReject,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    IsInt,
    Matches,
    Min,
    Max,
    IsString,
    IsIn,
    IsAscii,
    IsOptional,
} from 'class-validator';

import { OfferedClass } from './OfferedClass.js';

@ValidatorConstraint()
class IsName implements ValidatorConstraintInterface {
    validate(text: string) {
        // console.log(`IsName ${text}`);
        let matcher = text.match(/^[a-zA-Z ]+$/);
        let ret = typeof matcher !== 'undefined'
            && Array.isArray(matcher)
            && matcher.length > 0;
        // console.log(`IsName ${text} matches ${matcher} matched ${ret}`);
        return ret;
    }
}

@Entity()
export class Student {
    @PrimaryGeneratedColumn()  id: number;

    @Column({
        length: 100
    })
    @IsString()
    @IsAscii()
    @Matches(/^[a-zA-Z ]+$/)
    // @Validate(IsName, {
    //    message: 'Is not a name',
    // })
    name: string;

    @Column("int")
    @IsInt()
    @Min(1900)
    @Max(2040)
    entered: number;

    @Column("int")
    @IsInt()
    @Min(1)
    @Max(8)
    grade: number;

    @Column()
    @IsString()
    @IsAscii()
    @IsIn(['male', 'female'])
    gender: string;

    @ManyToMany(() => OfferedClass, oclass => oclass.students)
    @JoinTable()
    classes: OfferedClass[];

    @BeforeInsert()
    async validateInsert() {
        await validateOrReject(this);
    }

    @BeforeUpdate()
    async validateUpdate() {
        await validateOrReject(this);
    }
}

export class StudentUpdater {

    @Column({
        length: 100
    })
    @IsOptional()
    @IsString()
    @IsAscii()
    @Matches(/^[a-zA-Z ]+$/)
    // @Validate(IsName, {
    //    message: 'Is not a name',
    // })
    name: string;

    @Column("int")
    @IsOptional()
    @IsInt()
    @Min(1900)
    @Max(2040)
    entered: number;

    @Column("int")
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(8)
    grade: number;

    @Column()
    @IsOptional()
    @IsString()
    @IsAscii()
    @IsIn(['male', 'female'])
    gender: string;
}
