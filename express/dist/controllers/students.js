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
const registrar_1 = require("../models/registrar");
function home(req, res) {
    let students = registrar_1.students();
    console.log(`controllers home ${util.inspect(students)}`);
    res.render('index', { title: 'Students', students });
}
exports.home = home;
function create(req, res) {
    res.render('studentedit', {
        title: 'Add Student',
        docreate: true,
        id: -1,
        student: undefined
    });
}
exports.create = create;
function createUpdateStudent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let studentid;
        if (req.body.docreate === "create") {
            studentid = yield registrar_1.addStudent({
                id: -1,
                name: req.body.name,
                entered: req.body.entered,
                grade: req.body.grade,
                gender: req.body.gender
            });
        }
        else {
            studentid = yield registrar_1.updateStudent({
                id: req.body.id,
                name: req.body.name,
                entered: req.body.entered,
                grade: req.body.grade,
                gender: req.body.gender
            });
        }
        res.redirect(`/registrar/students/read?id=${studentid}`);
    });
}
exports.createUpdateStudent = createUpdateStudent;
function read(req, res) {
    let student = registrar_1.student(req.query.id);
    res.render('student', {
        title: student.name,
        id: student.id,
        student
    });
}
exports.read = read;
function update(req, res) {
    let student = registrar_1.student(req.query.id);
    res.render('studentedit', {
        title: 'Edit Student',
        docreate: false,
        id: student.id,
        student
    });
}
exports.update = update;
function destroy(req, res) {
    let student = registrar_1.student(req.query.id);
    res.render('dodestroy', {
        title: 'Delete Student',
        id: student.id,
        student
    });
}
exports.destroy = destroy;
function dodestroy(req, res) {
    let student = registrar_1.student(req.query.id);
    registrar_1.destroyStudent(student);
    res.redirect('/');
}
exports.dodestroy = dodestroy;
