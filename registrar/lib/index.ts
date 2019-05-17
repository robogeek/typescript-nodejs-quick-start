import "reflect-metadata";
import { createConnection, getManager, getRepository, getConnection } from "typeorm";

import { isGender, isStudent, isStudentUpdater } from './types';
import { Student } from './entities/Student';
import { OfferedClass } from './entities/Class';

import * as path from 'path';
import * as util from 'util';

export default class RegistrarDB {

    constructor() {
    }

    async init(databaseFN: string) {
        await createConnection({
            type: "sqlite",
            database: databaseFN,
            synchronize: true,
            logging: false,
            entities: [
                Student, OfferedClass
            ]
         });
    }

    async close() {
        let conn = getConnection();
        if (conn) await conn.close();
    }

    async drop() {
        let conn = getConnection();
        await conn.dropDatabase();
    }

    get studentRepository() { return getRepository(Student); }

    async createStudent(student: Student): Promise<any> {
        if (!isStudent(student)) {
            throw new Error(`Supplied student object not a Student ${util.inspect(student)}`);
        }
        let stud = new Student();
        stud.name = student.name;
        stud.entered = student.entered;
        stud.grade = student.grade;
        stud.gender = student.gender;
        await this.studentRepository.save(stud);
        return stud.id;
    }

    async getStudent(id: any): Promise<Student> {
        let student = await this.studentRepository.findOne({ where: { id: id }});
        if (!isStudent(student)) {
            throw new Error(`Student id ${util.inspect(id)} did not retrieve a Student`);
        }
        return student;
    }

    async updateStudent(id: any, student: Student): Promise<any> {
        if (!isStudentUpdater(student)) {
            throw new Error(`Student update id ${util.inspect(id)} did not receive a Student updater ${util.inspect(student)}`);
        }
        await getManager().update(Student, id, student);
    }
    
    async deleteStudent(student: number | Student) {
        if (typeof student !== 'number' && !isStudent(student)) {
            throw new Error('Supplied student object not a Student');
        }
        // console.log(`deleteStudent ${typeof student === 'number' ? student : student.id}`);
        await getManager().delete(Student, typeof student === 'number' ? student : student.id);
    }

}

