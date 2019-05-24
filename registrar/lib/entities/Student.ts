
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Student {
    @PrimaryGeneratedColumn()  id: any;
    @Column({
        length: 100
    })  name: string;
    @Column("int")  entered: number;
    @Column("int")  grade: number;
    @Column()  gender: string;
}

