
import { Student } from 'registrar';

let registrar: any;

export function init(_registrar: any) {
    registrar = _registrar;
}

export function students(): Student[] {
    return registrar.students.students;
}

export function student(id) : Student {
    return registrar.students.student(id);
}

export async function addStudent(student: Student) {
    return await registrar.students.addStudent(student);
}

export async function updateStudent(student: Student) {
    return await registrar.students.updateStudent(student);
}

export async function destroyStudent(student: Student) {
    return await registrar.students.delStudent(student.id);
}