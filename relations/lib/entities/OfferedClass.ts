import { 
    Entity,
    PrimaryColumn,
    Column,
    ManyToMany
} from "typeorm";
import { Student } from './Student';

@Entity()
export class OfferedClass {

    @PrimaryColumn()
    code: string;

    @Column()
    name: string;

    @ManyToMany(() => Student, student => student.classes)
    students: Student[];

}
