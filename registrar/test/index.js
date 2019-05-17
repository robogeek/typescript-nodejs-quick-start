
const util = require('util');
const path = require('path');
const assert = require('chai').assert;
const RegistrarDB = require('../dist/index').default;
const { Student } = require('../dist/entities/Student');
const { getManager, getRepository } = require("typeorm");

var registrar;

describe('Initialize Registrar', function() {
    before(async function() {
        registrar = new RegistrarDB();
        await registrar.init("registrardb.sqlite");
    });

    it('should successfully initialize the Registrar', async function() {

        assert.exists(registrar);
        assert.isObject(registrar);
        // assert.isObject(registrar.db);
        // assert.isObject(registrar.students);
    });
});

describe('Add students to registry', function() {
    // let registrar;
    let stud1 = {
        name: "John Brown", 
        entered: 1997, grade: 4,
        gender: "male"
    };
    let stud2 = {
        name: "John Brown", 
        entered: "trump1", grade: "senior",
        gender: "male"
    };
    let studentid1;
    let studentid2;

    it('should add a student to the registry', async function() {
        studentid1 = await registrar.createStudent(stud1);
        // console.log(`should add got studentid1 ${util.inspect(studentid1)}`);
        let student = await registrar.getStudent(studentid1);
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
            await registrar.createStudent(stud2);
        } catch (err) {
            // console.log(`should fail caught ${err.message}`);
            sawError = true;
        }
        assert.isTrue(sawError);
    });

});

describe('Update student in registry', function() {

    let stud1 = {
        name: "Johnny Brown", 
        entered: 2010, grade: 1,
        gender: "male"
    };
    let studentid1;

    before(async function() {
        studentid1 = await registrar.createStudent(stud1);
    });


    it('should update student', async function() {
        await registrar.updateStudent(studentid1, {
            gender: "female"
        });
        let student = await registrar.getStudent(studentid1);

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

    it('should fail to update student with bad data', async function() {
        let caughtError = false;
        try {
            await registrar.updateStudent(studentid1, {
                entered: "female"
            });
        } catch (e) {
            // console.log(e);
            caughtError = true;
        }
        assert.isTrue(caughtError);

        let student = await registrar.getStudent(studentid1);

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
        studentid1 = await registrar.createStudent(stud1);
    });

    it('should not fail to delete student using bad ID', async function() {

        let caughtError = false;
        try {
            await registrar.deleteStudent(9999999999);
        } catch (e) {
            // console.log(e);
            caughtError = true;
        }
        assert.isFalse(caughtError);
    });

    it('should delete student using good ID', async function() {
        await registrar.deleteStudent(studentid1);
        let student;
        let caughtError = false;
        try {
            student = await registrar.getStudent(studentid1);
        } catch (e) {
            caughtError = true;
        }
        assert.isTrue(caughtError);
    });
});
