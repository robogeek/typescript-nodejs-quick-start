
import * as ForerunnerDB from 'forerunnerdb';
import * as path from 'path';
import { StudentDB } from './Student';
export { Student } from './Student';

export class RegistrarDB {
    private _fdb : ForerunnerDB;
    private _db;
    private _students;

    constructor(dbpath: string) {
        this._fdb = new ForerunnerDB();
        this._db = this._fdb.db("test");
        this._students = new StudentDB(this, "students");
        this._db.persist.dataDir(dbpath);
        this._db.load();
        console.log(`RegistrarDB dbpath ${dbpath}`);
    }

    get db() { return this._db; }
    get fdb() { return this._fdb; }
    get students() { return this._students; }
}

