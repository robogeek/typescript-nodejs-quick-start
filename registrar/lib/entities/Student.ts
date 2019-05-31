
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    OneToMany,
    ManyToMany, 
    JoinTable,
    JoinColumn
} from "typeorm";
import { OfferedClass } from './OfferedClass';

@Entity()
export class Student {
    @PrimaryGeneratedColumn()  id: number;
    @Column({
        length: 100
    })  name: string;
    @Column("int")  entered: number;
    @Column("int")  grade: number;
    @Column()  gender: string;

    @ManyToMany(() => OfferedClass, oclass => oclass.students)
    @JoinTable()
    classes: OfferedClass[];

}

