import "reflect-metadata";
import { getRepository, getConnection } from "typeorm";
import { Student } from './entities/Student';
import { OfferedClass } from './entities/OfferedClass';
import { createClass, createStudent, mkConnection } from './utils';
import * as util from 'util';

(async () => {
    await mkConnection();

    let classRepository = getRepository(OfferedClass);
    let studentRepository = getRepository(Student);

    let clazz1 = await createClass("BW101", "Introduction to Basket Weaving");
    let clazz2 = await createClass("BW102", "Underwater Basket Weaving");

    console.log(await classRepository.find());
    console.log(clazz1);
    console.log(clazz2);

    let stud1 = await createStudent("John Brown", 1997, 2, "male");
    let stud2 = await createStudent("Mary Brown", 1998, 3, "female");

    console.log(await studentRepository.find());
    console.log(stud1);
    console.log(stud2);

    stud1.classes = [ clazz2 ];
    await studentRepository.save(stud1);

    stud2.classes = [ clazz1 ];
    await studentRepository.save(stud2);

    console.log(await studentRepository.findOne({
        where: { id: stud1.id },
        relations: [ "categories", "petType", "photos", "classes" ]
    }));
    console.log(await studentRepository.findOne({
        where: { id: stud2.id },
        relations: [ "categories", "petType", "photos", "classes" ]
    }));

    console.log(await classRepository.findOne({
        where: { code: "BW101" },
        relations: [ "students" ]
    }));
    console.log(await classRepository.findOne({
        where: { code: "BW102" },
        relations: [ "students" ]
    }));

    const loadClass = async (code) => {
        let offered = await classRepository.findOne({
            where: { code: code },
            relations: [ "students" ]
        });
        for (let student of offered.students) {
            let connection = getConnection();
            student.classes = await connection
                .createQueryBuilder()
                .relation(Student, "petType")
                .relation(Student, "photos")
                .relation(Student, "categories")
                .relation(Student, "classes")
                .of(student)
                .loadMany();
        }
        return offered;
    }

    let offered = await loadClass("BW101");
    console.log(util.inspect(offered));
    console.log(util.inspect(offered.students));
    
    offered = await loadClass("BW102");
    console.log(util.inspect(offered));
    console.log(util.inspect(offered.students));

})()
.catch(err => {
    console.error(err);
});
