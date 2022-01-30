import { EntityRepository, Repository } from "typeorm";
import {
    validateOrReject
} from 'class-validator';
import { OfferedClass, OfferedClassUpdater } from './entities/OfferedClass.js';
import { normalizeNumber, StudentRepository } from './StudentRepository.js';
import { getStudentRepository } from './index.js';
import * as util from 'util';
import * as yaml from 'js-yaml';
import { promises as fs } from 'fs';

class OfferedClassYAML {
    classes: Array<OfferedClass>;
}

/**
 * Custom repository for storing {@link OfferedClass} entities.
 */
@EntityRepository(OfferedClass)
export class OfferedClassRepository extends Repository<OfferedClass> {

    /**
     * Create an {@link OfferedClass} instance in the database
     * @param offeredClass Data object describing the {@link OfferedClass}
     * @returns The _code_ for the class
     */
    async createAndSave(offeredClass: OfferedClass): Promise<string> {
        const cls = new OfferedClass();
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
    
    /**
     * Returns a list of all {@link OfferedClass} instances
     * @returns An array of {@link OfferedClass} instances
     */
    async allClasses(): Promise<OfferedClass []> {
        const classes = await this.find({
            relations: [ "students" ]
        });
        return classes;
    }

    /**
     * Find the {@link OfferedClass} for the given class code.
     * @param code 
     * @returns The corresponding {@link OfferedClass} instance
     */
    async findOneClass(code: string): Promise<OfferedClass> {
        const cls = await this.findOne({ 
            where: { code: code },
            relations: [ "students" ]
        });
        // console.log(`findOneClass ${code} `, cls);
        if (!OfferedClassRepository.isOfferedClass(cls)) {
            throw new Error(`OfferedClass id ${util.inspect(code)} did not retrieve a OfferedClass`);
        }
        return cls;
    }

    /**
     * Tests to see if the class specified in {@param code} exists
     * @param code The class code to check
     * @returns Returns `true` if it exists, `false` otherwise
     */
    async classCodeExists(code: string): Promise<boolean> {
        const cls = await this.findOne({
            where: { code: code }
        });
        if (!OfferedClassRepository.isOfferedClass(cls)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Updates the {@link OfferedClass} entity named by `code` with
     * the data in `offeredClass`.  This data has the shape 
     * of {@link OfferedClass}, but can have missing fields.  Instead it must
     * be approved by the {@link OfferedClassRepository.isOfferedClassUpdater}
     * method.
     * @param code The class code to update
     * @param offeredClass The data to update in the entity
     * @returns The class code which was updated
     */
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
                studentid: number, code: string
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
        
        const offered = await this.findOneClass(code);
        await getStudentRepository().createQueryBuilder()
                .relation(OfferedClass, 'students')
                .of(offered)
                .add(studentid);
    }

    async removeStudentFromClass(
            studentid: number, code: string): Promise<void> {
    
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

        const offered = await this.findOneClass(code);
        await getStudentRepository().createQueryBuilder()
                .relation(OfferedClass, 'students')
                .of(offered)
                .remove(studentid);
    }

    async updateStudentEnrolledClasses(
                studentid: number, codes: string[]
                ): Promise<void> {
        const student = await getStudentRepository().findOneStudent(studentid);
        // console.log(`updateStudentEnrolledClasses studentid ${util.inspect(studentid)} codes ${util.inspect(codes)} ==> student ${util.inspect(student)}`);
        if (!StudentRepository.isStudent(student)) {
            throw new Error(`enrollStudentInClass did not find Student for ${util.inspect(studentid)}`);
        }
        const newclasses = [];
        for (const sclazz of student.classes) {
            for (const code of codes) {
                if (sclazz.code === code) {
                    newclasses.push(sclazz);
                }
            }
        }
        for (const code of codes) {
            let found = false;
            for (const nclazz of newclasses) {
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
    
        const all = await this.allClasses();
        for (const cls of all) {
            let stillOffered = false;
            for (const ofrd of offered.classes) {
                if (ofrd.code === cls.code) {
                    stillOffered = true;
                    break;
                }
            }
            if (!stillOffered) {
                this.deleteOfferedClass(cls.code);
            }
        }
        for (const updater of offered.classes) {
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


    static isOfferedClass(offeredClass: OfferedClass): offeredClass is OfferedClass {
        return typeof offeredClass === 'object'
            && typeof offeredClass.code === 'string'
            && typeof offeredClass.name === 'string'
            && typeof offeredClass.hours === 'number';
    }

    static isOfferedClassUpdater(updater: OfferedClass): boolean {
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

