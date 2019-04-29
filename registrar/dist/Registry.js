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
const fs_extra_1 = require("fs-extra");
const util = require("util");
const yaml = require("js-yaml");
const Student_1 = require("./Student");
class Registry {
    set fileName(fn) { this._fileName = fn; }
    get fileName() { return this._fileName; }
    set YAML(yamlText) {
        this._yaml = yamlText;
        this._parsed = yaml.safeLoad(this._yaml);
    }
    get parsed() { return this._parsed; }
    load(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            let yamlText = yield fs_extra_1.default.readFile(fn, 'utf8');
            this.fileName = fn;
            this.loadFromString(yamlText);
        });
    }
    loadFromString(yamlText) {
        this.YAML = yamlText;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.fileName) {
                yield fs_extra_1.default.writeFile(this.fileName, yaml.safeDump(this._parsed, {
                    indent: 4
                }), 'utf8');
            }
        });
    }
    get students() {
        if (this._parsed) {
            let ret = [];
            for (let student of this._parsed.students) {
                try {
                    ret.push(new Student_1.StudentImpl(student.id, student.name, student.entered, student.grade, student.gender));
                }
                catch (e) {
                    console.error(`Could not convert student ${util.inspect(student)} because ${e}`);
                }
            }
            return ret;
        }
    }
    student(id) {
        if (!this._parsed || !this._parsed.students)
            return;
        for (let student of this._parsed.students) {
            if (student.id === id) {
                return new Student_1.StudentImpl(student.id, student.name, student.entered, student.grade, student.gender);
            }
        }
        return;
    }
    delStudent(id) {
        this._parsed.students = this._parsed.students.filter(student => {
            if (student.id !== id)
                return true;
            else
                return false;
        });
        this.save();
    }
    addStudent(student) {
        let stud = this.student(student.id);
        if (stud) {
            throw new Error(`addStudent found a student with id ${student.id} for ${util.inspect(student)}`);
        }
        if (!this._parsed)
            this._parsed = {};
        if (!this._parsed.students)
            this._parsed.students = [];
        this._parsed.students.push(new Student_1.StudentImpl(student.id, student.name, student.entered, student.grade, student.gender));
        this.save();
    }
    updateStudent(updated) {
        let stud = this.student(updated.id);
        if (!stud) {
            throw new Error(`updateStudent did not find a student with id ${updated.id} for ${util.inspect(updated)}`);
        }
        for (let student of this._parsed.students) {
            if (student.id === updated.id) {
                student.name = updated.name;
                student.entered = updated.entered;
                student.grade = updated.grade;
                student.gender = updated.gender;
                this.save();
            }
        }
    }
}
exports.Registry = Registry;
