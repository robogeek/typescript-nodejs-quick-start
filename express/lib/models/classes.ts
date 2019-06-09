
import * as util from 'util';
import { Student } from 'registrar/dist/entities/Student';
import { OfferedClass } from "registrar/dist/entities/OfferedClass";
import {
    allClasses,
    getOfferedClass as _getOfferedClass,
    updateStudentEnrolledClasses as _updateStudentEnrolledClasses
} from 'registrar/dist/Classes';

export async function classes(): Promise<OfferedClass[]> {
    return allClasses();
}

export async function getOfferedClass(code: string) : Promise<OfferedClass> {
    return await _getOfferedClass(code);
}

export async function classesForStudent(student: Student): Promise<OfferedClass[]> {
    let classes = await allClasses();
    let ret = [];
    for (let clazz of classes) {
        let isEnrolled = false;

        if (student) {
            for (let enrolledClass of student.classes) {
                if (clazz.code === enrolledClass.code) {
                    isEnrolled = true;
                }
            }
        }

        ret.push({
            code: clazz.code,
            name: clazz.name,
            hours: clazz.hours,
            students: clazz.students,
            isEnrolled: isEnrolled
        });
    }

    console.log(`classesForStudent ${util.inspect(student)} => ${util.inspect(ret)}`);
    return ret;
}


export async function updateStudentEnrolledClasses(studentid: any, codes: string[]): Promise<any> {
    return await _updateStudentEnrolledClasses(studentid, codes);
}

