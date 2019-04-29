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
let registrar;
function init(_registrar) {
    registrar = _registrar;
}
exports.init = init;
function students() {
    return registrar.students.students;
}
exports.students = students;
function student(id) {
    return registrar.students.student(id);
}
exports.student = student;
function addStudent(student) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield registrar.students.addStudent(student);
    });
}
exports.addStudent = addStudent;
function updateStudent(student) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield registrar.students.updateStudent(student);
    });
}
exports.updateStudent = updateStudent;
function destroyStudent(student) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield registrar.students.delStudent(student.id);
    });
}
exports.destroyStudent = destroyStudent;
