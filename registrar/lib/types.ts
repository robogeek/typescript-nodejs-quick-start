
import { Student } from './entities/Student';

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