
import { getManager, getRepository } from "typeorm";
import { OfferedClass } from './entities/OfferedClass';
import {
    getStudent,
    updateStudent, 
    normalizeNumber,
    isStudent 
} from './Students';
import * as util from 'util';
import * as yaml from 'js-yaml';
import * as fs from 'fs-extra';

export function offeredClassRepository() { return getRepository(OfferedClass); }

export async function createOfferedClass(offeredClass: OfferedClass): Promise<any> {
    let cls = new OfferedClass();
    cls.code = offeredClass.code;
    cls.name = offeredClass.name;
    cls.hours = normalizeNumber(offeredClass.hours, 'Bad number of hours');
    if (!isOfferedClass(cls)) {
        throw new Error(`Not an offered class ${util.inspect(offeredClass)}`);
    }
    let or = offeredClassRepository();
    await or.save(cls);
    return cls.code;
}

export async function allClasses(): Promise<OfferedClass []> {
    let or = offeredClassRepository();
    let classes = await or.find({
        relations: [ "students" ]
    });
    return classes;
}

export async function getOfferedClass(code: string): Promise<OfferedClass> {
    let cls = await offeredClassRepository().findOne({ 
        where: { code: code },
        relations: [ "students" ]
    });
    if (!isOfferedClass(cls)) {
        throw new Error(`OfferedClass id ${util.inspect(code)} did not retrieve a OfferedClass`);
    }
    return cls;
}

export async function updateOfferedClass(code: string, offeredClass: OfferedClass): Promise<any> {
    if (typeof offeredClass.hours !== 'undefined') {
        offeredClass.hours = normalizeNumber(offeredClass.hours, 'Bad number of hours');
    }
    if (!isOfferedClassUpdater(offeredClass)) {
        throw new Error(`OfferedClass update id ${util.inspect(code)} did not receive a OfferedClass updater ${util.inspect(offeredClass)}`);
    }
    await getManager().update(OfferedClass, code, offeredClass);
    return code;
}

export async function deleteOfferedClass(offeredClass: string | OfferedClass) {
    if (typeof offeredClass !== 'string' && !isOfferedClass(offeredClass)) {
        throw new Error('Supplied offeredClass object not a OfferedClass');
    }
    // console.log(`deleteStudent ${typeof student === 'number' ? student : student.id}`);
    await getManager().delete(OfferedClass,
        typeof offeredClass === 'string'
                ? offeredClass : offeredClass.code);
}

export async function enrollStudentInClass(studentid: any, code: string) {
    let offered = await getOfferedClass(code);
    if (!isOfferedClass(offered)) {
        throw new Error(`enrollStudentInClass did not find OfferedClass for ${util.inspect(code)}`);
    }
    let student = await getStudent(studentid);
    if (!isStudent(student)) {
        throw new Error(`enrollStudentInClass did not find Student for ${util.inspect(studentid)}`);
    }
    
    if (!student.classes) student.classes = [];
    student.classes.push(offered);
    await getManager().save(student);
}

export async function updateStudentEnrolledClasses(studentid: any, codes: string[]) {
    let student = await getStudent(studentid);
    // console.log(`updateStudentEnrolledClasses studentid ${util.inspect(studentid)} codes ${util.inspect(codes)} ==> student ${util.inspect(student)}`);
    if (!isStudent(student)) {
        throw new Error(`enrollStudentInClass did not find Student for ${util.inspect(studentid)}`);
    }
    let newclasses = [];
    for (let sclazz of student.classes) {
        for (let code of codes) {
            if (sclazz.code === code) {
                newclasses.push(sclazz);
            }
        }
    }
    for (let code of codes) {
        let found = false;
        for (let nclazz of newclasses) {
            if (nclazz.code === code) {
                found = true;
            }
        }
        if (!found) {
            newclasses.push(await getOfferedClass(code));
        }
    }
    student.classes = newclasses;
    // console.log(`updateStudentEnrolledClasses updating student studentid ${util.inspect(studentid)} codes ${util.inspect(codes)} ==> student ${util.inspect(student)}`);
    await getManager().save(student);
}

export async function updateClasses(classFN: string) {

    const yamlText = await fs.readFile(classFN, 'utf8');
    const offered = yaml.safeLoad(yamlText);

    if (typeof offered !== 'object' || !Array.isArray(offered.classes)) {
        throw new Error(`updateClasses read incorrect data file from ${classFN}`);
    }

    let all = await allClasses();
    for (let cls of all) {
        let stillOffered = false;
        for (let ofrd of offered.classes) {
            if (ofrd.code === cls.code) {
                stillOffered = true;
                break;
            }
        }
        if (!stillOffered) {
            deleteOfferedClass(cls.code);
        }
    }
    for (let updater of offered.classes) {
        if (!isOfferedClassUpdater(updater)) {
            throw new Error(`updateClasses found classes entry that is not an OfferedClassUpdater ${util.inspect(updater)}`);
        }
        let cls;
        try { cls = await getOfferedClass(updater.code); } catch (e) { cls = undefined }
        if (cls) {
            await updateOfferedClass(updater.code, updater)
        } else {
            await createOfferedClass(updater)
        }
    }
    
}

export function isOfferedClass(offeredClass: any): offeredClass is OfferedClass {
    return typeof offeredClass === 'object'
        && typeof offeredClass.code === 'string'
        && typeof offeredClass.name === 'string'
        && typeof offeredClass.hours === 'number';
}

export function isOfferedClassUpdater(updater: any): boolean {
    let ret = true;
    if (typeof updater !== 'object') {
        throw new Error('isOfferedClassUpdater must get object');
    }
    if (typeof updater.code !== 'undefined') {
        if (typeof updater.code !== 'string') ret = false;
    }
    if (typeof updater.name !== 'undefined') {
        if (typeof updater.name !== 'string') ret = false;
    }
    if (typeof updater.hours !== 'undefined') {
        if (typeof updater.hours !== 'number') ret = false;
    }
    return ret;
}
