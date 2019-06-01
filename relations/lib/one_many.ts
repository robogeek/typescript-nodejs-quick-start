import "reflect-metadata";
import { getRepository } from "typeorm";
import { Student } from './entities/Student';
import { Photo } from './entities/Photo';
import { createPhoto, createStudent, mkConnection } from './utils';

(async () => {
    await mkConnection();

    let photoRepository = getRepository(Photo);
    let studentRepository = getRepository(Student);

    let photo1 = await createPhoto("http://some.where/photo1.jpg");
    let photo2 = await createPhoto("http://some.where/photo2.jpg");

    console.log(await photoRepository.find());
    console.log(photo1);
    console.log(photo2);

    let stud1 = await createStudent("John Brown", 1997, 2, "male");
    let stud2 = await createStudent("Mary Brown", 1998, 3, "female");

    console.log(await studentRepository.find());
    console.log(stud1);
    console.log(stud2);

    stud1.photos = [ photo2 ];
    console.log(await studentRepository.save(stud1));

    stud2.photos = [ photo1 ];
    console.log(await studentRepository.save(stud2));

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
