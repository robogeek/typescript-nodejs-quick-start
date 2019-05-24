
import * as util from 'util';
import { 
    studentRepository,
    createStudent,
    allStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    isGender,
    isStudent,
    isStudentUpdater
} from 'registrar/dist/Students';
import { Student } from 'registrar/dist/entities/Student';
// import { Student } from 'registrar/Students';
// import { default as App } from '../server';

export async function students(): Promise<Student[]> {
    return await allStudents();
}

export async function student(id) : Promise<Student> {
    return await getStudent(id);
}

export async function addStudent(student: Student) {
    let ret = await createStudent(student);
    console.log(`addStudent ${util.inspect(ret)}`);
    return ret;
}

export async function doUpdateStudent(student: Student) {
    return await updateStudent(student.id, student);
}

export async function destroyStudent(student: Student) {
    return await deleteStudent(student.id);
}