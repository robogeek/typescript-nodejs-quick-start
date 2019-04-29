"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
var Gender;
(function (Gender) {
    Gender["male"] = "male";
    Gender["female"] = "female";
})(Gender || (Gender = {}));
;
class StudentDB {
    constructor(registrar, table) {
        this.studentTable = registrar.db.collection(table, { primaryKey: "id" });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.studentTable.save(err => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        });
    }
    get students() {
        let ret = [];
        for (let student of this.studentTable.find()) {
            try {
                ret.push(new StudentImpl(student.id, student.name, student.entered, student.grade, student.gender));
            }
            catch (e) {
                console.error(`Could not convert student ${util.inspect(student)} because ${e}`);
            }
        }
        return ret;
    }
    student(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let students = yield this.studentTable.find({
                id: { $eq: id }
            });
            if (students.length <= 0)
                throw new Error(`Did not find student id ${id}`);
            if (students.length > 1)
                throw new Error(`Found too many students for ${id} - ${util.inspect(students)}`);
            let student = students[0];
            // console.log(`student ${id} ${util.inspect(student)}`);
            return new StudentImpl(student.id, student.name, student.entered, student.grade, student.gender);
        });
    }
    delStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.studentTable.remove({
                id: { $eq: id }
            });
            yield this.save();
        });
    }
    addStudent(student) {
        return __awaiter(this, void 0, void 0, function* () {
            let s = new StudentImpl(undefined, student.name, student.entered, student.grade, student.gender);
            let r = yield this.studentTable.insert({
                name: s.name, entered: s.entered, grade: s.grade, gender: s.gender
            });
            yield this.save();
            // console.log(`addStudent ${util.inspect(r)}`);
            return r.inserted[0].id;
        });
    }
    updateStudent(updated) {
        return __awaiter(this, void 0, void 0, function* () {
            let s = new StudentImpl(undefined, updated.name, updated.entered, updated.grade, updated.gender);
            yield this.studentTable.updateById(updated.id, {
                name: s.name, entered: s.entered, grade: s.grade, gender: s.gender
            });
            yield this.save();
            return updated.id;
        });
    }
}
exports.StudentDB = StudentDB;
class StudentImpl {
    constructor(id, name, entered, grade, gender) {
        this.setID(id);
        this.setName(name);
        this.setEntered(entered);
        this.setGrade(grade);
        this.setGender(gender);
    }
    get id() { return this._id; }
    set id(id) { this.setID(id); }
    setID(id) {
        this._id = id;
    }
    get name() { return this._name; }
    set name(name) { this.setName(name); }
    setName(name) {
        if (typeof name !== 'string') {
            throw new Error(`Bad name: ${util.inspect(name)}`);
        }
        this._name = name;
    }
    get entered() { return this._entered; }
    set entered(entered) { this.setEntered(entered); }
    setEntered(entered) {
        // console.log(`setEntered ${entered}`);
        this._entered = normalizeNumber(entered, 'Bad year entered');
    }
    get grade() { return this._grade; }
    set grade(grade) { this.setGrade(grade); }
    setGrade(grade) {
        this._grade = normalizeNumber(grade, 'Bad grade');
    }
    get gender() { return this._gender; }
    set gender(gender) { this.setGender(gender); }
    setGender(gender) {
        this._gender = parseGender(gender);
    }
}
exports.StudentImpl = StudentImpl;
function normalizeNumber(num, errorIfNotNumber) {
    if (typeof num === 'undefined') {
        throw new Error(`${errorIfNotNumber} -- ${num}`);
    }
    if (typeof num === 'number')
        return num;
    let ret = parseInt(num);
    if (isNaN(ret)) {
        throw new Error(`${errorIfNotNumber} ${ret} -- ${num}`);
    }
    return ret;
}
function isGender(gender) {
    return typeof gender === 'string'
        && (gender === 'male' || gender === 'female');
}
function parseGender(gender) {
    if (!isGender(gender))
        throw new Error(`Bad gender: ${gender}`);
    return (gender === 'male') ? Gender.male : Gender.female;
}
