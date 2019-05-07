
import * as util from 'util';
import { Student } from 'registrar';
import { default as App } from '../server';

export function students(): Student[] {
    return App.registrar.students.students;
}

export function student(id) : Student {
    return App.registrar.students.student(id);
}

export async function addStudent(student: Student) {
    let ret = await App.registrar.students.addStudent(student);
    console.log(`addStudent ${util.inspect(ret)}`);
    return ret;
}

export async function updateStudent(student: Student) {
    return await App.registrar.students.updateStudent(student);
}

export async function destroyStudent(student: Student) {
    return await App.registrar.students.delStudent(student.id);
}