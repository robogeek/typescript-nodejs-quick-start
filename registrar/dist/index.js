"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ForerunnerDB = require("forerunnerdb");
const path = require("path");
const Student_1 = require("./Student");
class RegistrarDB {
    constructor() {
        this._fdb = new ForerunnerDB();
        this._db = this._fdb.db("test"),
            this._db.persist.dataDir(path.join(__dirname, '..', 'registrarDB'));
        this._students = new Student_1.StudentDB(this, "students");
    }
    get db() { return this._db; }
    get fdb() { return this._fdb; }
    get students() { return this._students; }
}
exports.RegistrarDB = RegistrarDB;
