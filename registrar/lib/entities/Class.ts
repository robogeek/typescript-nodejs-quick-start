import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OfferedClass {

    @PrimaryGeneratedColumn()  id: any;
    @Column({
        length: 10
    })  code: string;
    @Column({
        length: 100
    })  name: string;
    @Column("int")  hours: number;
}