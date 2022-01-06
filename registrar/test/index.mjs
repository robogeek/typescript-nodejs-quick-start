
import util from 'util';
import { assert } from 'chai';
import {
    connect, 
    connected,
    Student,
    getStudentRepository,
    StudentRepository,
    getOfferedClassRepository,
    OfferedClassRepository
} from '../dist/index.js';

import {
    validate,
} from 'class-validator';

import * as path from 'path';
import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { env } from 'process';

env.TYPEORM_CONNECTION  = 'sqlite';
env.TYPEORM_DATABASE    = path.join(__dirname, 'registrardb.sqlite');
env.TYPEORM_SYNCHRONIZE = true;
env.TYPEORM_LOGGING     = false;
env.TYPEORM_ENTITIES    = '../**/entities/*.js';

describe('Initialize Registrar', function() {
    before(async function() {
        try {
            await connect("registrardb.sqlite");
        } catch (e) {
            console.error(`Initialize Registrar failed with `, e);
            throw e;
        }
    });

    it('should successfully initialize the Registrar', async function() {
        assert.isTrue(connected());
    });
});

describe('Add students to registry', function() {
    let stud1 = {
        name: "John Brown", 
        entered: 1997, grade: 4,
        gender: "male"
    };
    let stud_bad_years = {
        name: "John Brown",
        entered: "badyear", grade: "senior",
        gender: "male"
    };
    let stud_bad_name = {
        name: "John Br0wn",
        entered: 1999, grade: 3,
        gender: "male"
    };
    let stud_low_year = {
        name: "John Brown",
        entered: 999, grade: 3,
        gender: "male"
    };
    let stud_high_year = {
        name: "John Brown",
        entered: 2999, grade: 3,
        gender: "male"
    };
    let stud_low_grade = {
        name: "John Brown",
        entered: 1999, grade: 0,
        gender: "male"
    };
    let stud_high_grade = {
        name: "John Brown",
        entered: 1999, grade: 33,
        gender: "male"
    };
    let studentid1;

    it('should add a student to the registry', async function() {
        studentid1 = await getStudentRepository().createAndSave(stud1);
        // console.log(`should add got studentid1 ${util.inspect(studentid1)}`);
        let student = await getStudentRepository().findOneStudent(studentid1);
        // console.log(`should add got studentid1 ${util.inspect(studentid1)} student ${util.inspect(student)}`);
        assert.exists(student);
        assert.isObject(student);
        assert.isString(student.name);
        assert.equal(student.name, stud1.name);
        assert.isNumber(student.entered);
        assert.equal(student.entered, stud1.entered);
        assert.isNumber(student.grade);
        assert.equal(student.grade, stud1.grade);
        assert.isString(student.gender);
        assert.equal(student.gender, stud1.gender);
    });

    it('should fail to add a student with bad data', async function() {
        let sawError = false;
        try {
            await getStudentRepository().createAndSave(stud_bad_years);
        } catch (err) {
            // console.log(`should fail caught ${err.message}`);
            sawError = true;
        }
        assert.isTrue(sawError);
    });

    it('should fail to construct student with bad name', async function() {
        const stud = new Student();
        stud.name = stud_bad_name.name;
        stud.entered = stud_bad_name.entered;
        stud.grade = stud_bad_name.grade;
        stud.gender = stud_bad_name.gender;
        // console.log(stud);
        const errors = await validate(stud);
        // console.log(errors);
        assert.isAtLeast(errors.length, 1);
    });

    it('should fail to add a student with bad name', async function() {
        let sawError = false;
        try {
            await getStudentRepository().createAndSave(stud_bad_name);
        } catch (err) {
            // console.log(`should fail caught ${err.message}`);
            sawError = true;
        }
        assert.isTrue(sawError);
    });

    it('should fail to add a student with year prior to 1900', async function() {
        let sawError = false;
        try {
            await getStudentRepository().createAndSave(stud_low_year);
        } catch (err) {
            // console.log(`should fail caught ${err.message}`);
            sawError = true;
        }
        assert.isTrue(sawError);
    });

    it('should fail to add a student with grade after 2040', async function() {
        let sawError = false;
        try {
            await getStudentRepository().createAndSave(stud_high_year);
        } catch (err) {
            // console.log(`should fail caught ${err.message}`);
            sawError = true;
        }
        assert.isTrue(sawError);
    });

    it('should fail to add a student with grade prior to 1', async function() {
        let sawError = false;
        try {
            await getStudentRepository().createAndSave(stud_low_grade);
        } catch (err) {
            // console.log(`should fail caught ${err.message}`);
            sawError = true;
        }
        assert.isTrue(sawError);
    });

    it('should fail to add a student with grade after 8', async function() {
        let sawError = false;
        try {
            await getStudentRepository().createAndSave(stud_high_grade);
        } catch (err) {
            // console.log(`should fail caught ${err.message}`);
            sawError = true;
        }
        assert.isTrue(sawError);
    });

    /* after(async function() {
        console.log(await getStudentRepository().findAll());
    }); */

});

describe('Update student in registry', function() {

    let stud1 = {
        name: "Johnny Brown", 
        entered: 2010, grade: 1,
        gender: "male"
    };
    let studentid1;

    before(async function() {
        studentid1 = await getStudentRepository().createAndSave(stud1);
    });


    it('should update student', async function() {
        await getStudentRepository().updateStudent(studentid1, {
            gender: "female"
        });
        let student = await getStudentRepository().findOneStudent(studentid1);
        // console.log(`update student ${util.inspect(studentid1)} ==> ${util.inspect(student)}`);

        assert.exists(student);
        assert.isObject(student);
        assert.isString(student.name);
        assert.equal(student.name, stud1.name);
        assert.isNumber(student.entered);
        assert.equal(student.entered, stud1.entered);
        assert.isNumber(student.grade);
        assert.equal(student.grade, stud1.grade);
        assert.isString(student.gender);
        assert.equal(student.gender, "female");

        assert.isTrue(StudentRepository.isStudent(student));
    });

    it('should fail to update student with bad data', async function() {
        let caughtError = false;
        try {
            await getStudentRepository().updateStudent(studentid1, {
                entered: "female"
            });
        } catch (e) {
            // console.log(e);
            caughtError = true;
        }
        assert.isTrue(caughtError);

        caughtError = false;
        try {
            await getStudentRepository().updateStudent(studentid1, {
                entered: 999
            });
        } catch (e) {
            // console.log(e);
            caughtError = true;
        }
        assert.isTrue(caughtError);

        caughtError = false;
        try {
            await getStudentRepository().updateStudent(studentid1, {
                entered: 2999
            });
        } catch (e) {
            // console.log(e);
            caughtError = true;
        }
        assert.isTrue(caughtError);

        caughtError = false;
        try {
            await getStudentRepository().updateStudent(studentid1, {
                grade: 0
            });
        } catch (e) {
            // console.log(e);
            caughtError = true;
        }
        assert.isTrue(caughtError);

        caughtError = false;
        try {
            await getStudentRepository().updateStudent(studentid1, {
                grade: 9
            });
        } catch (e) {
            // console.log(e);
            caughtError = true;
        }
        assert.isTrue(caughtError);

        caughtError = false;
        try {
            await getStudentRepository().updateStudent(studentid1, {
                gender: "gorky"
            });
        } catch (e) {
            // console.log(e);
            caughtError = true;
        }
        assert.isTrue(caughtError);

        let student = await getStudentRepository().findOneStudent(studentid1);
        // console.log(`fail to update student ${util.inspect(studentid1)} ==> ${util.inspect(student)}`);

        assert.exists(student);
        assert.isObject(student);
        assert.isString(student.name);
        assert.equal(student.name, stud1.name);
        assert.isNumber(student.entered);
        assert.equal(student.entered, stud1.entered);
        assert.isNumber(student.grade);
        assert.equal(student.grade, stud1.grade);
        assert.isString(student.gender);
        assert.equal(student.gender, "female");
    });
});

describe('Delete student from registry', function() {

    let stud1 = {
        name: "JohnTODELETE Brown", 
        entered: 2010, grade: 1,
        gender: "male"
    };
    let studentid1;

    before(async function() {
        studentid1 = await getStudentRepository().createAndSave(stud1);
    });

    it('should not fail to delete student using bad ID', async function() {

        let caughtError = false;
        try {
            await getStudentRepository().deleteStudent(9999999999);
        } catch (e) {
            // console.log(e);
            caughtError = true;
        }
        assert.isFalse(caughtError);
    });

    it('should delete student using good ID', async function() {
        await getStudentRepository().deleteStudent(studentid1);
        let student;
        let caughtError = false;
        try {
            student = await getStudentRepository().findOneStudent(studentid1);
        } catch (e) {
            caughtError = true;
        }
        // console.log(`delete student using good ID ${util.inspect(studentid1)} ==> ${util.inspect(student)}`);

        assert.isTrue(caughtError);
    });
});

describe('Initialize Offered Classes in registry', function() {
    before(async function() {
        await getOfferedClassRepository().updateClasses(path.join(__dirname, 'classes.yaml'));
    });

    it('should have offered classes', async function() {
        let classes = await getOfferedClassRepository().allClasses();
        assert.exists(classes);
        assert.isArray(classes);
        // console.log(classes);
        for (let offered of classes) {
            assert.isTrue(OfferedClassRepository.isOfferedClass(offered));
        }
    });

    it('should fail to add class with bad code', async function() {
        let caughtError = false;
        try {
            await getOfferedClassRepository().createAndSave({
                code: 'BADCODE',
                name: 'Class with bad name',
                hours: 3
            });
        } catch (e) {
            caughtError = true;
        }

        assert.isTrue(caughtError);
    });

    it('should fail to add class with bad name', async function() {
        let caughtError = false;
        try {
            await getOfferedClassRepository().createAndSave({
                code: 'CD111',
                name: 'Class 11 with bad name',
                hours: 3
            });
        } catch (e) {
            caughtError = true;
        }

        assert.isTrue(caughtError);
    });

    it('should fail to add class with bad hours', async function() {
        let caughtError = false;
        try {
            await getOfferedClassRepository().createAndSave({
                code: 'CD111',
                name: 'Class with good name but bad hours',
                hours: 'three'
            });
        } catch (e) {
            caughtError = true;
        }

        assert.isTrue(caughtError);
    });

    it('should fail to update class with bad name', async function() {
        let caughtError = false;
        try {
            await getOfferedClassRepository()
            .updateOfferedClass('BW101', {
                name: 'Name with 1111 numbers is bad'
            });
        } catch (e) {
            caughtError = true;
        }

        assert.isTrue(caughtError);
    });

    it('should fail to update class with bad hours', async function() {
        let caughtError = false;
        try {
            await getOfferedClassRepository()
            .updateOfferedClass('BW101', {
                hours: 'three'
            });
        } catch (e) {
            caughtError = true;
        }

        assert.isTrue(caughtError);
    });

    let stud1 = {
        name: "Mary Brown", 
        entered: 2010, grade: 2,
        gender: "female"
    };
    let studentid1;

    it('should add student to a class', async function() {
        studentid1 = await getStudentRepository().createAndSave(stud1);
        // console.log(`should add got studentid1 ${util.inspect(studentid1)}`);

        await getOfferedClassRepository().enrollStudentInClass(studentid1, "BW102");

        let student = await getStudentRepository().findOneStudent(studentid1);
        // console.log(`should add got studentid1 ${util.inspect(studentid1)} student ${util.inspect(student)}`);

        assert.isTrue(StudentRepository.isStudent(student));
        // console.log(`student ${studentid1} classes ${util.inspect(student.classes)}`);
        assert.isArray(student.classes);
        let foundbw102 = false;
        for (let offered of student.classes) {
            assert.isTrue(OfferedClassRepository.isOfferedClass(offered));
            if (offered.code === "BW102") foundbw102 = true;
        }
        assert.isTrue(foundbw102);
    });

    let stud2 = {
        name: "Vicky Brown", 
        entered: 2005, grade: 8,
        gender: "female"
    };
    let studentid2;

    it('should add student to three classes', async function() {
        studentid2 = await getStudentRepository().createAndSave(stud2);
        // console.log(`should add got studentid1 ${util.inspect(studentid2)}`);

        await getOfferedClassRepository().enrollStudentInClass(studentid2, "BW102");
        await getOfferedClassRepository().enrollStudentInClass(studentid2, "BW201");
        await getOfferedClassRepository().enrollStudentInClass(studentid2, "BW203");

        let student = await getStudentRepository().findOneStudent(studentid2);
        // console.log(`should add got studentid ${util.inspect(studentid2)} student ${util.inspect(student)}`);

        assert.isTrue(StudentRepository.isStudent(student));
        // console.log(`student ${studentid2} classes ${util.inspect(student.classes)}`);
        assert.isArray(student.classes);
        let foundbw102 = false;
        let foundbw201 = false;
        let foundbw203 = false;
        for (let offered of student.classes) {
            assert.isTrue(OfferedClassRepository.isOfferedClass(offered));
            if (offered.code === "BW102") foundbw102 = true;
            if (offered.code === "BW201") foundbw201 = true;
            if (offered.code === "BW203") foundbw203 = true;
        }
        assert.isTrue(foundbw102);
        assert.isTrue(foundbw201);
        assert.isTrue(foundbw203);
    });

    it('should show students registered in class', async function() {
        let classbw102 = await getOfferedClassRepository().findOneClass("BW102");
        assert.isTrue(OfferedClassRepository.isOfferedClass(classbw102));
        let foundstudentid2 = false;
        let foundstudentid1 = false;
        for (let student of classbw102.students) {
            assert.isTrue(StudentRepository.isStudent(student));
            if (student.id === studentid2) foundstudentid2 = true;
            if (student.id === studentid1) foundstudentid1 = true;
        }
        assert.isTrue(foundstudentid2);
        assert.isTrue(foundstudentid1);

        let classbw201 = await getOfferedClassRepository().findOneClass("BW201");
        assert.isTrue(OfferedClassRepository.isOfferedClass(classbw201));
        foundstudentid2 = false;
        foundstudentid1 = false;
        for (let student of classbw201.students) {
            assert.isTrue(StudentRepository.isStudent(student));
            if (student.id === studentid2) foundstudentid2 = true;
            if (student.id === studentid1) foundstudentid1 = true;
        }
        assert.isTrue(foundstudentid2);
        assert.isFalse(foundstudentid1);

        let classbw203 = await getOfferedClassRepository().findOneClass("BW203");
        assert.isTrue(OfferedClassRepository.isOfferedClass(classbw203));
        foundstudentid2 = false;
        foundstudentid1 = false;
        for (let student of classbw203.students) {
            assert.isTrue(StudentRepository.isStudent(student));
            if (student.id === studentid2) foundstudentid2 = true;
            if (student.id === studentid1) foundstudentid1 = true;
        }
        assert.isTrue(foundstudentid2);
        assert.isFalse(foundstudentid1);
    });


    it('should show enroll student in bulk classes', async function() {
        let student = await getStudentRepository().findOneStudent(studentid2);
        assert.isTrue(StudentRepository.isStudent(student));
        // let oldclasses = student.classes;
        // console.log(oldclasses);
        await getOfferedClassRepository().updateStudentEnrolledClasses(student.id, [
            "BW401", "BW303"
        ]);
        let studentUpdated = await getStudentRepository().findOneStudent(studentid2);
        // console.log(studentUpdated);

        let foundbw303 = false;
        let foundbw401 = false;
        for (let clazz of studentUpdated.classes) {
            if (clazz.code === "BW401") foundbw401 = true;
            else if (clazz.code === "BW303") foundbw303 = true;
            else {
                assert.fail(`class with code ${clazz.code} found`);
            }
        }
        assert.isTrue(foundbw303);
        assert.isTrue(foundbw401);
    });
});