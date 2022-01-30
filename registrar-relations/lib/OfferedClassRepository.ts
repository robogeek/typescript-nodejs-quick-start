import { EntityRepository, Repository } from "typeorm";
import {
    validateOrReject
} from 'class-validator';
import { OfferedClass, OfferedClassUpdater } from './entities/OfferedClass.js';
import { normalizeNumber, StudentRepository } from './StudentRepository.js';
import { getStudentRepository, Student, getOfferedClassRepository } from './index.js';
import * as util from 'util';
import * as yaml from 'js-yaml';
import { promises as fs, read } from 'fs';

class OfferedClassYAML {
    classes: Array<OfferedClass>;
}

@EntityRepository(OfferedClass)
export class OfferedClassRepository extends Repository<OfferedClass> {

    async createAndSave(offeredClass: OfferedClass): Promise<string> {
        let cls = new OfferedClass();
        cls.code = offeredClass.code;
        cls.name = offeredClass.name;
        cls.hours = normalizeNumber(offeredClass.hours, 'Bad number of hours');
        if (!OfferedClassRepository.isOfferedClass(cls)) {
            throw new Error(`Not an offered class ${util.inspect(offeredClass)}`);
        }
        // The validation is now handled by
        // the @BeforeInsert and @BeforeUpdate decorators
        // await validateOrReject(cls);
        await this.save(cls);
        return cls.code;
    }
    
    async allClasses(): Promise<OfferedClass []> {
        let classes = await this.find({
            relations: [ "students" ]
        });
        return classes;
    }

    async findOneClass(code: string): Promise<OfferedClass> {
        let cls = await this.findOne({ 
            where: { code: code },
            relations: [ "students" ]
        });
        // console.log(`findOneClass ${code} `, cls);
        if (!OfferedClassRepository.isOfferedClass(cls)) {
            throw new Error(`OfferedClass id ${util.inspect(code)} did not retrieve a OfferedClass`);
        }
        return cls;
    }

    async classCodeExists(code: string): Promise<boolean> {
        let cls = await this.findOne({
            where: { code: code }
        });
        if (!OfferedClassRepository.isOfferedClass(cls)) {
            return false;
        } else {
            return true;
        }
    }

    async updateOfferedClass(
                code: string,
                offeredClass: OfferedClass
            ): Promise<string> {
        const updater = new OfferedClassUpdater();
        if (typeof offeredClass.hours !== 'undefined') {
            updater.hours = normalizeNumber(offeredClass.hours, 'Bad number of hours');
        }
        if (typeof offeredClass.name !== 'undefined') {
            updater.name = offeredClass.name;
        }
        if (!OfferedClassRepository.isOfferedClassUpdater(offeredClass)) {
            throw new Error(`OfferedClass update id ${util.inspect(code)} did not receive a OfferedClass updater ${util.inspect(offeredClass)}`);
        }
        await validateOrReject(updater);
        await this.manager.update(OfferedClass, code, updater);
        return code;
    }

    async deleteOfferedClass(
                offeredClass: string | OfferedClass
                ): Promise<void> {
        if (typeof offeredClass !== 'string' && !OfferedClassRepository.isOfferedClass(offeredClass)) {
            throw new Error('Supplied offeredClass object not a OfferedClass');
        }
        // console.log(`deleteStudent ${typeof student === 'number' ? student : student.id}`);
        await this.manager.delete(OfferedClass,
            typeof offeredClass === 'string'
                    ? offeredClass : offeredClass.code);
    }

    async enrollStudentInClass(
                studentid: any, code: string
                ): Promise<void> {
        /* let offered = await this.findOneClass(code);
        if (!OfferedClassRepository.isOfferedClass(offered)) {
            throw new Error(`enrollStudentInClass did not find OfferedClass for ${util.inspect(code)}`);
        }
        let student = await getStudentRepository().findOneStudent(studentid);
        if (!StudentRepository.isStudent(student)) {
            throw new Error(`enrollStudentInClass did not find Student for ${util.inspect(studentid)}`);
        }
        
        if (!student.classes) student.classes = [];
        student.classes.push(offered);
        await getStudentRepository().manager.save(student); */

        /* let offered = await this.findOneClass(code);
        await this.createQueryBuilder()
            .relation(Student, 'classes')
            .of(studentid)
            .add(offered); */
        
        /* let offered = await this.findOneClass(code);
        if (!OfferedClassRepository.isOfferedClass(offered)) {
            throw new Error(`enrollStudentInClass did not find OfferedClass for ${util.inspect(code)}`);
        }
        let student = await getStudentRepository().findOneStudent(studentid);
        if (!StudentRepository.isStudent(student)) {
            throw new Error(`enrollStudentInClass did not find Student for ${util.inspect(studentid)}`);
        }

        if (!offered.students) offered.students = [];
        offered.students.push(student);
        await this.manager.save(offered); */
        
        let offered = await this.findOneClass(code);
        await getStudentRepository().createQueryBuilder()
                .relation(OfferedClass, 'students')
                .of(offered)
                .add(studentid);
    }

    async removeStudentFromClass(
            studentid: any, code: string): Promise<void> {
    
        /* let offered = await this.findOneClass(code);
        if (!OfferedClassRepository.isOfferedClass(offered)) {
            throw new Error(`enrollStudentInClass did not find OfferedClass for ${util.inspect(code)}`);
        }
        let student = await getStudentRepository().findOneStudent(studentid);
        if (!StudentRepository.isStudent(student)) {
            throw new Error(`enrollStudentInClass did not find Student for ${util.inspect(studentid)}`);
        }
        
        if (!student.classes) student.classes = [];
        student.classes = student.classes.filter(clazz => {
            return clazz.code !== code;
        });
        await getStudentRepository().manager.save(student); */
    
        /* let offered = await this.findOneClass(code);
        if (!OfferedClassRepository.isOfferedClass(offered)) {
            throw new Error(`enrollStudentInClass did not find OfferedClass for ${util.inspect(code)}`);
        }
        let student = await getStudentRepository()
                        .findOneStudent(studentid);
        if (!StudentRepository.isStudent(student)) {
            throw new Error(`enrollStudentInClass did not find Student for ${util.inspect(studentid)}`);
        }
        
        if (!offered.students) offered.students = [];
        offered.students = offered.students.filter(stud => {
            return stud.id !== studentid;
        });
        await getOfferedClassRepository().manager.save(offered); */

        /* let offered = await this.findOneClass(code);
        await this.createQueryBuilder()
            .relation(Student, 'classes')
            .of(studentid)
            .remove(offered); */

        let offered = await this.findOneClass(code);
        await getStudentRepository().createQueryBuilder()
                .relation(OfferedClass, 'students')
                .of(offered)
                .remove(studentid);
    }

    async updateStudentEnrolledClasses(
                studentid: any, codes: string[]
                ): Promise<void> {
        let student = await getStudentRepository().findOneStudent(studentid);
        // console.log(`updateStudentEnrolledClasses studentid ${util.inspect(studentid)} codes ${util.inspect(codes)} ==> student ${util.inspect(student)}`);
        if (!StudentRepository.isStudent(student)) {
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
                newclasses.push(await this.findOneClass(code));
            }
        }
        student.classes = newclasses;
        // console.log(`updateStudentEnrolledClasses updating student studentid ${util.inspect(studentid)} codes ${util.inspect(codes)} ==> student ${util.inspect(student)}`);
        await getStudentRepository().save(student);
    }

    async updateClasses(classFN: string): Promise<void> {

        const yamlText = await fs.readFile(classFN, 'utf8');
        const offered = (yaml.load(yamlText, {
            filename: classFN
        }) as OfferedClassYAML);
    
        if (typeof offered !== 'object' 
         || !Array.isArray(offered.classes)) {
            throw new Error(`updateClasses read incorrect data file from ${classFN}`);
        }

        // console.log(offered);
    
        let all = await this.allClasses();
        for (let cls of all) {
            let stillOffered = false;
            for (let ofrd of offered.classes) {
                if (ofrd.code === cls.code) {
                    stillOffered = true;
                    break;
                }
            }
            if (!stillOffered) {
                this.deleteOfferedClass(cls.code);
            }
        }
        for (let updater of offered.classes) {
            if (!OfferedClassRepository.isOfferedClassUpdater(updater)) {
                throw new Error(`updateClasses found classes entry that is not an OfferedClassUpdater ${util.inspect(updater)}`);
            }
            await validateOrReject(updater);
            let cls;
            try { cls = await this.findOneClass(updater.code); } catch (e) { cls = undefined }
            if (cls) {
                await this.updateOfferedClass(updater.code, updater)
            } else {
                await this.createAndSave(updater)
            }
        }
    }


    static isOfferedClass(offeredClass: any): offeredClass is OfferedClass {
        return typeof offeredClass === 'object'
            && typeof offeredClass.code === 'string'
            && typeof offeredClass.name === 'string'
            && typeof offeredClass.hours === 'number';
    }

    static isOfferedClassUpdater(updater: any): boolean {
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

}

