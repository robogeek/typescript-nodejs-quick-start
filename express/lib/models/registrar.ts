
import * as util from 'util';
import { 
    Student,
    getStudentRepository
} from 'registrar';

export async function students(): Promise<Student[]> {
    return await getStudentRepository().findAll();
}

export async function student(id: number) : Promise<Student> {
    return await getStudentRepository().findOneStudent(id);
}

export async function addStudent(student: Student) {
    let ret = await getStudentRepository().createAndSave(student);
    console.log(`addStudent ${util.inspect(ret)}`);
    return ret;
}

export async function doUpdateStudent(student: Student) {
    return await getStudentRepository().updateStudent(student.id, student);
}

export async function destroyStudent(student: Student) {
    return await getStudentRepository().deleteStudent(student.id);
}