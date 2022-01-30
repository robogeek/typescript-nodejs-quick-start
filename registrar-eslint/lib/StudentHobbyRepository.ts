import * as util from 'util';

import { EntityRepository, Repository, getConnection } from "typeorm";
import { getStudentRepository, Student } from './index.js';
import { StudentHobby } from './entities/Hobby';

@EntityRepository(StudentHobby)
export class StudentHobbyRepository extends Repository<StudentHobby> {

    async ensureHobby(hobby: string): Promise<StudentHobby> {
        let thehobby = await this.findHobby(hobby);
        if (thehobby) return thehobby;
        thehobby = new StudentHobby();
        thehobby.name = hobby;
        await this.save(thehobby);
        return thehobby;
    }

    async findHobby(hobby: string): Promise<StudentHobby> {
        const thehobby = await this.createQueryBuilder('hobby')
                        .where('hobby.name = :name', { name: hobby })
                        .getOne();
        /* const thehobby = await this.findOne({ 
            where: { name: hobby }
        }); */
        console.log(`findHobby ${hobby}`, thehobby);
        return thehobby;
    }

    async findOneHobby(hobby: string): Promise<StudentHobby> {
        const thehobby = await this.findHobby(hobby);
        // console.log(`findOneHobby ${photourl} `, thephoto);
        if (!StudentHobbyRepository.isStudentHobby(thehobby)) {
            throw new Error(`StudentHobby url ${util.inspect(thehobby)} did not retrieve a StudentHobby`);
        }
        return thehobby;
    }

    async studentHasHobby(studentid: number, hobby: string): Promise<void> {
        const thehobby = await this.ensureHobby(hobby);
        console.log(`studentHasHobby found ${hobby}`, thehobby);
        const student = await getStudentRepository().findOneStudent(studentid);
        console.log(`studentHasHobby ${studentid} ${hobby}`, student);
        console.log(`studentHasHobby ${hobby}`, thehobby);
        if (!await this.studentPracticesHobby(studentid, hobby)) {
            await getConnection()
                    .createQueryBuilder()
                    .relation(Student, "hobbies")
                    .of(student)
                    .add(thehobby);
                    const student2 = await getStudentRepository().findOneStudent(studentid);
            console.log(`studentHasHobby after adding ${hobby}`, student2);
        }
    }

    async studentPracticesHobby(studentid: number, hobby: string)
                    : Promise<boolean>
    {
        const student = await getStudentRepository()
                            .findOneStudent(studentid);
        let ret = false;
        for (const thehobby of student.hobbies) {
            console.log(`studentPracticesHobby ${thehobby.name} === ${hobby}`);
            if (thehobby.name === hobby) {
                ret = true;
                return ret;
            }
        }
        console.log(`studentPracticesHobby ${studentid} ${hobby} ${ret}`);
        return ret;
    }

    async studentQuitsHobby(studentid: number, hobby: string): Promise<void> {

        const thehobby = await this.ensureHobby(hobby);
        const student = await getStudentRepository().findOneStudent(studentid);
        await getConnection()
                .createQueryBuilder()
                .relation(Student, "hobbies")
                .of(student)
                .remove(thehobby);
    }

    async studentsForHobby(hobby: string): Promise<Student[]> {

        /* const students = await getStudentRepository()
                .createQueryBuilder('student')
                .leftJoinAndSelect('student.hobbies', 'studenthobby')
                .where("studenthobby.name = :name", { name: hobby })
                .getMany(); */
        const students = await getStudentRepository()
                .createQueryBuilder('student')
                // These do not cause the tables to be loaded
                // but cause the result to be empty
                // .innerJoin('student.pet', 'pet')
                // .innerJoin('student.classes', 'class')
                .innerJoinAndSelect(
                    'student.hobbies',
                    'studenthobby',
                    "studenthobby.name = :name", { name: hobby })
                // This causes result to be solely the fields
                // .select([ 'student.id', 'student.name',
                //     'student.entered', 'student.grade', 'student.gender' ])
                .getMany();
        
        console.log(`Students loaded before filling in fields`, students);
        // The above returns an object that is incomplete:
        //
        // [
        //    Student {
        //        id: 5,
        //        name: 'John Freetime',
        //        entered: 2010,
        //        grade: 1,
        //        gender: 'male',
        //        hobbies: [ [StudentHobby] ]
        //    }
        // ]
        //
        // The test case didn't add anything other than two hobbies.
        // The one hobby that's here is the one selected by the above.
        //
        // What this does is to fill in the rest of the fields.
        for (const student of students) {
            student.classes = await getConnection()
                                .createQueryBuilder()
                                .relation(Student, "classes")
                                .of(student)
                                .loadMany();
            student.pet = await getConnection()
                                .createQueryBuilder()
                                .relation(Student, "pet")
                                .of(student)
                                .loadOne();
            student.photos = await getConnection()
                                .createQueryBuilder()
                                .relation(Student, "photos")
                                .of(student)
                                .loadMany();
            student.hobbies = await getConnection()
                                .createQueryBuilder()
                                .relation(Student, "hobbies")
                                .of(student)
                                .loadMany();
        }
        
        return students;
    }

    static isStudentHobby(studenthobby: StudentHobby): studenthobby is StudentHobby {
        return typeof studenthobby === 'object'
            && typeof studenthobby.name === 'string';
    }
}

