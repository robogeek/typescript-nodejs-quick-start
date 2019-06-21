
import * as util from 'util';
import { 
    Student,
    OfferedClass,
    getOfferedClassRepository
} from 'registrar';

export async function classes(): Promise<OfferedClass[]> {
    return getOfferedClassRepository().allClasses();
}

export async function getOfferedClass(code: string) : Promise<OfferedClass> {
    return await getOfferedClassRepository().findOneClass(code);
}

export async function classesForStudent(student: Student): Promise<OfferedClass[]> {
    let classes = await getOfferedClassRepository().allClasses();
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
    return await getOfferedClassRepository().updateStudentEnrolledClasses(studentid, codes);
}

