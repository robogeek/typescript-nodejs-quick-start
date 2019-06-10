import { 
    Entity,
    PrimaryGeneratedColumn,
    Column
} from "typeorm";

@Entity()
export class PetType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

}
