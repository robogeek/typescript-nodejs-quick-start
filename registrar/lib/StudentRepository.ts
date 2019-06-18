import { EntityRepository, Repository, getRepository } from "typeorm";
import { Student } from "./entities/Student";
import * as util from 'util';

export type GenderType = "male" | "female";

export enum Gender {
    male = "male", female = "female"
}

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {

    async createAndSave(student: Student): Promise<number> {
        let stud = new Student();
        stud.name = student.name;
        stud.entered = normalizeNumber(student.entered, 'Bad year entered');
        stud.grade = normalizeNumber(student.grade, 'Bad grade');
        stud.gender = student.gender;
        if (!StudentRepository.isStudent(stud)) {
            throw new Error(`Supplied student object not a Student ${util.inspect(student)}`);
        }
        await this.save(stud);
        return stud.id;
    }

    async findAll(): Promise<Student []> {
        let students = await this.find({
            relations: [ "classes" ]
        });
        return students;
    }

    async findOneStudent(id: number): Promise<Student> {
        let student: Student = await this.findOne({ 
            where: { id: id },
            relations: [ "classes" ]
        });
        // console.log(`findOneStudent ${util.inspect(id)} ==> ${util.inspect(student)}`);
        if (!StudentRepository.isStudent(student)) {
            throw new Error(`Student id ${util.inspect(id)} did not retrieve a Student`);
        }
        return student;
    }

    async updateStudent(id: number, student: Student): Promise<number> {
        if (typeof student.entered !== 'undefined') {
            student.entered = normalizeNumber(student.entered, 'Bad year entered');
        }
        if (typeof student.grade !== 'undefined') {
            student.grade = normalizeNumber(student.grade, 'Bad grade');
        }
        if (!StudentRepository.isStudentUpdater(student)) {
            throw new Error(`Student update id ${util.inspect(id)} did not receive a Student updater ${util.inspect(student)}`);
        }
        await this.manager.update(Student, id, student);
        return id;
    }
    
    async deleteStudent(student: number | Student) {
        if (typeof student !== 'number' && !StudentRepository.isStudent(student)) {
            throw new Error('Supplied student object not a Student');
        }
        // console.log(`deleteStudent ${typeof student === 'number' ? student : student.id}`);
        await this.manager.delete(Student, typeof student === 'number' ? student : student.id);
    }


    static isStudent(student: any): student is Student {
        return typeof student === 'object'
            && typeof student.name === 'string'
            && typeof student.entered === 'number'
            && typeof student.grade === 'number'
            && StudentRepository.isGender(student.gender);
    }

    static isStudentUpdater(updater: any): boolean {
        let ret = true;
        if (typeof updater !== 'object') {
            throw new Error('isStudentUpdater must get object');
        }
        if (typeof updater.name !== 'undefined') {
            if (typeof updater.name !== 'string') ret = false;
        }
        if (typeof updater.entered !== 'undefined') {
            if (typeof updater.entered !== 'number') ret = false;
        }
        if (typeof updater.grade !== 'undefined') {
            if (typeof updater.grade !== 'number') ret = false;
        }
        if (typeof updater.gender !== 'undefined') {
            if (!StudentRepository.isGender(updater.gender)) ret = false;
        }
        return ret;
    }

    static isGender(gender: any): gender is Gender {
        return typeof gender === 'string'
           && (gender === 'male' || gender === 'female');
    }
}


export function normalizeNumber(num: number | string, errorIfNotNumber: string): number {
    if (typeof num === 'undefined') {
        throw new Error(`${errorIfNotNumber} -- ${num}`);
    }
    if (typeof num === 'number') return num;
    let ret = parseInt(num);
    if (isNaN(ret)) {
        throw new Error(`${errorIfNotNumber} ${ret} -- ${num}`);
    }
    return ret!;
}

