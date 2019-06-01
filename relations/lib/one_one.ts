import "reflect-metadata";
import { getRepository } from "typeorm";
import { Student } from './entities/Student';
import { PetType } from './entities/PetType';
import { createPetType, createStudent, mkConnection } from './utils';

(async () => {
    await mkConnection();

    let petTypeRepository = getRepository(PetType);
    let studentRepository = getRepository(Student);

    let pet1 = await createPetType("owl");
    let pet2 = await createPetType("rat");

    console.log(await petTypeRepository.find());
    console.log(pet1);
    console.log(pet2);

    let stud1 = await createStudent("John Brown", 1997, 2, "male");
    let stud2 = await createStudent("Mary Brown", 1998, 3, "female");

    console.log(await studentRepository.find());
    console.log(stud1);
    console.log(stud2);

    stud1.petType = pet2;
    await studentRepository.save(stud1);

    stud2.petType = pet1;
    await studentRepository.save(stud2);

    console.log(await studentRepository.findOne({
        where: { id: stud1.id },
        relations: [ "categories", "petType", "photos" ]
    }));
    console.log(await studentRepository.findOne({
        where: { id: stud2.id },
        relations: [ "categories", "petType", "photos" ]
    }));
})()
.catch(err => {
    console.error(err);
});
