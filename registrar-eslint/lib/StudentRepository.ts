import { EntityRepository, Repository } from "typeorm";
import { Student, StudentUpdater } from "./entities/Student.js";
import * as util from 'util';

import {
    validateOrReject
} from 'class-validator';
// import { getOfferedClassRepository, OfferedClassRepository } from "./index.js";

export type GenderType = "male" | "female";

export enum Gender {
    male = "male", female = "female"
}

/**
 * Repository for Student objects
 */
@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {

    /**
     * Creates a Student object from information passed in student,
     * saving the data to the database.
     * @param student Student object to save
     * @returns ID for newly created Student object
     */
    async createAndSave(student: Student): Promise<number> {
        const stud = new Student();
        stud.name = student.name;
        stud.entered = normalizeNumber(student.entered, 'Bad year entered');
        stud.grade = normalizeNumber(student.grade, 'Bad grade');
        if (!StudentRepository.isGender(student.gender)) {
            throw new Error(`Unknown gender ${student.gender}`);
        }
        stud.gender = student.gender;
        // The validation is now handled by
        // the @BeforeInsert and @BeforeUpdate decorators
        // await validateOrReject(stud);
        await this.save(stud);
        return stud.id;
    }

    /**
     * 
     * @returns LIst of all Students in the database
     */
    async findAll(): Promise<Student []> {
        const students = await this.find({
            relations: [ "classes", "pet", "photos", "hobbies" ]
        });
        return students;
    }

    /**
     * Checks if a Student with this ID exists.
     * @param id Student ID number
     * @returns Indicates if the student exists
     */
    async studentIDexists(id: number): Promise<boolean> {
        const student: Student = await this.findOne({
            where: { id: id }
        });
        if (!StudentRepository.isStudent(student)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Finds the Student object for the given ID number
     * @param id Student ID number
     * @returns The matching Student
     */
    async findOneStudent(id: number): Promise<Student> {

        const student = await this.createQueryBuilder("student")
                        .where("student.id = :id", { id: id })
                        .getOne();
        if (!student) return undefined;

        student.classes = await this.createQueryBuilder()
                        .relation(Student, "classes")
                        .of(student)
                        .loadMany();
        student.pet = await this.createQueryBuilder()
                        .relation(Student, "pet")
                        .of(student)
                        .loadOne();
        student.photos = await this.createQueryBuilder()
                        .relation(Student, "photos")
                        .of(student)
                        .loadMany();
        student.hobbies = await this.createQueryBuilder()
                        .relation(Student, "hobbies")
                        .of(student)
                        .loadMany();
        /* let student: Student = await this.findOne({ 
            where: { id: id },
            relations: [ "classes", "pet", "photos", "hobbies" ]
        });
        // console.log(`findOneStudent ${util.inspect(id)} ==> ${util.inspect(student)}`);
        if (!StudentRepository.isStudent(student)) {
            throw new Error(`Student id ${util.inspect(id)} did not retrieve a Student`);
        } */

        return student;
    }

    async updateStudent(id: number, student: Student): Promise<number> {
        const updater = new StudentUpdater();
        if (typeof student.entered !== 'undefined') {
            updater.entered = normalizeNumber(student.entered, 'Bad year entered');
        }
        if (typeof student.grade !== 'undefined') {
            updater.grade = normalizeNumber(student.grade, 'Bad grade');
        }
        if (typeof student.gender !== 'undefined'
         && !StudentRepository.isGender(student.gender)) {
            throw new Error(`Unknown gender ${student.gender}`);
        } else if (typeof student.gender !== 'undefined') {
            updater.gender = student.gender;
        }
        if (!StudentRepository.isStudentUpdater(student)) {
            throw new Error(`Student update id ${util.inspect(id)} did not receive a Student updater ${util.inspect(student)}`);
        }
        // console.log(`updateStudent `, updater);
        await validateOrReject(updater);
        await this.manager.update(Student, id, updater);
        return id;
    }

    async deleteStudent(student: number | Student) {
        if (typeof student !== 'number' && !StudentRepository.isStudent(student)) {
            throw new Error('Supplied student object not a Student');
        }
        // console.log(`deleteStudent ${typeof student === 'number' ? student : student.id}`);
        await this.manager.delete(Student, typeof student === 'number' ? student : student.id);
    }

    static isStudent(student: Student): student is Student {
        return typeof student === 'object'
            && typeof student.name === 'string'
            && typeof student.entered === 'number'
            && typeof student.grade === 'number'
            && StudentRepository.isGender(student.gender);
    }

    static isStudentUpdater(updater: StudentUpdater): updater is StudentUpdater {
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

    static isGender(gender: Gender | string): gender is Gender {
        return typeof gender === 'string'
           && (gender === 'male' || gender === 'female');
    }
}


export function normalizeNumber(num: number | string, errorIfNotNumber: string): number {
    if (typeof num === 'undefined') {
        throw new Error(`${errorIfNotNumber} -- ${num}`);
    }
    if (typeof num === 'number') return num;
    const ret = parseInt(num);
    if (isNaN(ret)) {
        throw new Error(`${errorIfNotNumber} ${ret} -- ${num}`);
    }
    return ret;
}

