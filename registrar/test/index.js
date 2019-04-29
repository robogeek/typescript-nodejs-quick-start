
const util = require('util');
const assert = require('chai').assert;
const RegistrarDB = require('../dist/index').RegistrarDB;

describe('Initialize Registrar', function() {
    it('should successfully initialize the Registrar', function() {
        let registrar = new RegistrarDB();

        assert.exists(registrar);
        assert.isObject(registrar);
        assert.isObject(registrar.db);
        assert.isObject(registrar.students);
    });
});

describe('Add students to empty registry', function() {
    let registrar;
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

    before(function() {
        registrar = new RegistrarDB();
    });

    it('should add a student to the registry', async function() {
        studentid1 = await registrar.students.addStudent(stud1);
        // console.log(`should add got studentid1 ${util.inspect(studentid1)}`);
        let student = await registrar.students.student(studentid1);
        // console.log(`should add got student ${util.inspect(student)}`);
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
            await registrar.students.addStudent(stud2);
        } catch (err) {
            // console.log(`should fail caught ${err.stack}`);
            sawError = true;
        }
        assert.isTrue(sawError);
    });
});
