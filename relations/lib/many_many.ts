import "reflect-metadata";
import { getRepository } from "typeorm";
import { Student } from './entities/Student';
import { Category } from './entities/Category';
import { createCategory, createStudent, mkConnection } from './utils';

(async () => {
    await mkConnection();

    let categoryRepository = getRepository(Category);
    let studentRepository = getRepository(Student);

    let cat1 = await createCategory("animals");
    let cat2 = await createCategory("zoo");

    console.log(await categoryRepository.find());
    console.log(cat1);
    console.log(cat2);

    let stud1 = await createStudent("John Brown", 1997, 2, "male");
    let stud2 = await createStudent("Mary Brown", 1998, 3, "female");

    console.log(await studentRepository.find());
    console.log(stud1);
    console.log(stud2);

    stud1.categories = [];
    stud1.categories.push(cat2);
    await studentRepository.save(stud1);

    stud2.categories = [];
    stud2.categories.push(cat1);
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
