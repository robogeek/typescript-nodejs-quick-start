
import { getManager, getRepository } from "typeorm";
import { Student } from './entities/Student';
import * as util from 'util';

export function studentRepository() { return getRepository(Student); }

export async function createStudent(student: Student): Promise<number> {
    let stud = new Student();
    stud.name = student.name;
    stud.entered = normalizeNumber(student.entered, 'Bad year entered');
    stud.grade = normalizeNumber(student.grade, 'Bad grade');
    stud.gender = student.gender;
    if (!isStudent(stud)) {
        throw new Error(`Supplied student object not a Student ${util.inspect(student)}`);
    }
    let sr = studentRepository();
    await sr.save(stud);
    return stud.id;
}

export async function allStudents(): Promise<Student []> {
    let sr = studentRepository();
    let students = await sr.find({
        relations: [ "classes" ]
    });
    return students;
}

export async function getStudent(id: number): Promise<Student> {

    let sr = studentRepository();
    let student = await sr.findOne({ 
        where: { id: id },
        relations: [ "classes" ]
    });
    // console.log(`getStudent ${util.inspect(id)} ==> ${util.inspect(student)}`);
    if (!isStudent(student)) {
        throw new Error(`Student id ${util.inspect(id)} did not retrieve a Student`);
    }
    return student;
}

export async function updateStudent(id: number, student: Student): Promise<number> {
    if (typeof student.entered !== 'undefined') {
        student.entered = normalizeNumber(student.entered, 'Bad year entered');
    }
    if (typeof student.grade !== 'undefined') {
        student.grade = normalizeNumber(student.grade, 'Bad grade');
    }
    if (!isStudentUpdater(student)) {
        throw new Error(`Student update id ${util.inspect(id)} did not receive a Student updater ${util.inspect(student)}`);
    }
    await getManager().update(Student, id, student);
    return id;
}

export async function deleteStudent(student: number | Student) {
    if (typeof student !== 'number' && !isStudent(student)) {
        throw new Error('Supplied student object not a Student');
    }
    // console.log(`deleteStudent ${typeof student === 'number' ? student : student.id}`);
    await getManager().delete(Student, typeof student === 'number' ? student : student.id);
}

export type GenderType = "male" | "female";

export enum Gender {
    male = "male", female = "female"
}

export function isGender(gender: any): gender is Gender {
    return typeof gender === 'string'
       && (gender === 'male' || gender === 'female');
}

export function isStudent(student: any): student is Student {
    return typeof student === 'object'
        && typeof student.name === 'string'
        && typeof student.entered === 'number'
        && typeof student.grade === 'number'
        && isGender(student.gender);
}

export function isStudentUpdater(updater: any): boolean {
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
        if (!isGender(updater.gender)) ret = false;
    }
    return ret;
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

