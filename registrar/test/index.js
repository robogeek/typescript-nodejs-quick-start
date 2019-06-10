
const util = require('util');
const path = require('path');
const assert = require('chai').assert;
const RegistrarDB = require('../dist/index').default;
const { 
    studentRepository,
    createStudent,
    getStudent,
    updateStudent,
    deleteStudent,
    isGender,
    isStudent,
    isStudentUpdater
} = require('../dist/Students');
const { Student } = require('../dist/entities/Student');
const {
    allClasses,
    createOfferedClass,
    updateClasses,
    getOfferedClass,
    updateOfferedClass,
    deleteOfferedClass,
    isOfferedClass,
    enrollStudentInClass,
    updateStudentEnrolledClasses
} = require('../dist/Classes');
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
        studentid1 = await createStudent(stud1);
        // console.log(`should add got studentid1 ${util.inspect(studentid1)}`);
        let student = await getStudent(studentid1);
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
            await createStudent(stud2);
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
        studentid1 = await createStudent(stud1);
    });


    it('should update student', async function() {
        await updateStudent(studentid1, {
            gender: "female"
        });
        let student = await getStudent(studentid1);
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

        assert.isTrue(isStudent(student));
    });

    it('should fail to update student with bad data', async function() {
        let caughtError = false;
        try {
            await updateStudent(studentid1, {
                entered: "female"
            });
        } catch (e) {
            // console.log(e);
            caughtError = true;
        }
        assert.isTrue(caughtError);

        let student = await getStudent(studentid1);
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
        studentid1 = await createStudent(stud1);
    });

    it('should not fail to delete student using bad ID', async function() {

        let caughtError = false;
        try {
            await deleteStudent(9999999999);
        } catch (e) {
            // console.log(e);
            caughtError = true;
        }
        assert.isFalse(caughtError);
    });

    it('should delete student using good ID', async function() {
        await deleteStudent(studentid1);
        let student;
        let caughtError = false;
        try {
            student = await getStudent(studentid1);
        } catch (e) {
            caughtError = true;
        }
        // console.log(`delete student using good ID ${util.inspect(studentid1)} ==> ${util.inspect(student)}`);

        assert.isTrue(caughtError);
    });
});

describe('Initialize Offered Classes in registry', function() {
    before(async function() {
        await updateClasses(path.join(__dirname, 'classes.yaml'));
    });

    it('should have offered classes', async function() {
        let classes = await allClasses();
        assert.exists(classes);
        assert.isArray(classes);
        for (let offered of classes) {
            assert.isTrue(isOfferedClass(offered));
        }
    });


    let stud1 = {
        name: "Mary Brown", 
        entered: 2010, grade: 2,
        gender: "female"
    };
    let studentid1;

    it('should add student to a class', async function() {
        studentid1 = await createStudent(stud1);
        // console.log(`should add got studentid1 ${util.inspect(studentid1)}`);

        await enrollStudentInClass(studentid1, "BW102");

        let student = await getStudent(studentid1);
        // console.log(`should add got studentid1 ${util.inspect(studentid1)} student ${util.inspect(student)}`);

        assert.isTrue(isStudent(student));
        // console.log(`student ${studentid1} classes ${util.inspect(student.classes)}`);
        assert.isArray(student.classes);
        let foundbw102 = false;
        for (let offered of student.classes) {
            assert.isTrue(isOfferedClass(offered));
            if (offered.code === "BW102") foundbw102 = true;
        }
        assert.isTrue(foundbw102);
    });

    let stud2 = {
        name: "Vicky Brown", 
        entered: 2005, grade: 12,
        gender: "female"
    };
    let studentid2;

    it('should add student to three classes', async function() {
        studentid2 = await createStudent(stud2);
        // console.log(`should add got studentid1 ${util.inspect(studentid2)}`);

        await enrollStudentInClass(studentid2, "BW102");
        await enrollStudentInClass(studentid2, "BW201");
        await enrollStudentInClass(studentid2, "BW203");

        let student = await getStudent(studentid2);
        // console.log(`should add got studentid ${util.inspect(studentid2)} student ${util.inspect(student)}`);

        assert.isTrue(isStudent(student));
        // console.log(`student ${studentid2} classes ${util.inspect(student.classes)}`);
        assert.isArray(student.classes);
        let foundbw102 = false;
        let foundbw201 = false;
        let foundbw203 = false;
        for (let offered of student.classes) {
            assert.isTrue(isOfferedClass(offered));
            if (offered.code === "BW102") foundbw102 = true;
            if (offered.code === "BW201") foundbw201 = true;
            if (offered.code === "BW203") foundbw203 = true;
        }
        assert.isTrue(foundbw102);
        assert.isTrue(foundbw201);
        assert.isTrue(foundbw203);
    });

    it('should show students registered in class', async function() {
        let classbw102 = await getOfferedClass("BW102");
        assert.isTrue(isOfferedClass(classbw102));
        let foundstudentid2 = false;
        let foundstudentid1 = false;
        for (let student of classbw102.students) {
            assert.isTrue(isStudent(student));
            if (student.id === studentid2) foundstudentid2 = true;
            if (student.id === studentid1) foundstudentid1 = true;
        }
        assert.isTrue(foundstudentid2);
        assert.isTrue(foundstudentid1);

        let classbw201 = await getOfferedClass("BW201");
        assert.isTrue(isOfferedClass(classbw201));
        foundstudentid2 = false;
        foundstudentid1 = false;
        for (let student of classbw201.students) {
            assert.isTrue(isStudent(student));
            if (student.id === studentid2) foundstudentid2 = true;
            if (student.id === studentid1) foundstudentid1 = true;
        }
        assert.isTrue(foundstudentid2);
        assert.isFalse(foundstudentid1);

        let classbw203 = await getOfferedClass("BW203");
        assert.isTrue(isOfferedClass(classbw203));
        foundstudentid2 = false;
        foundstudentid1 = false;
        for (let student of classbw203.students) {
            assert.isTrue(isStudent(student));
            if (student.id === studentid2) foundstudentid2 = true;
            if (student.id === studentid1) foundstudentid1 = true;
        }
        assert.isTrue(foundstudentid2);
        assert.isFalse(foundstudentid1);
    });


    it('should show enroll student in bulk classes', async function() {
        let student = await getStudent(studentid2);
        assert.isTrue(isStudent(student));
        // let oldclasses = student.classes;
        // console.log(oldclasses);
        await updateStudentEnrolledClasses(student.id, [
            "BW401", "BW303"
        ]);
        let studentUpdated = await getStudent(studentid2);
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