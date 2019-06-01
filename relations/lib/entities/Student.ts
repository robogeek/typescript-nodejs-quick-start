import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    OneToMany,
    ManyToMany, 
    JoinTable,
    JoinColumn,
    OneToOne
} from "typeorm";
import { Category } from './Category';
import { PetType } from './PetType';
import { Photo } from './Photo';
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

    @OneToOne(() => PetType)
    @JoinColumn()
    petType: PetType;

    @OneToMany(() => Photo, photo => photo.student)
    photos: Photo[];

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category[];

    @ManyToMany(() => OfferedClass, clazz => clazz.students)
    @JoinTable()
    classes: OfferedClass[];
}
