
import * as util from 'util';

enum Gender {
    male = "male", female = "female"
}

export interface Student {
    id: any;
    name: string;
    entered: number;
    grade: number;
    gender: Gender;
};

export class StudentDB {
    private studentTable;

    constructor(registrar, table) {
        this.studentTable = registrar.db.collection(table,  {primaryKey: "id"});
    }

    async save() {
        return new Promise((resolve, reject) => {
            this.studentTable.save(err => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    get students(): Student[] {
        let ret: Student[] = [];
        for (let student of this.studentTable.find()) {
            try {
                ret.push(new StudentImpl(
                    student.id, student.name, 
                    student.entered, student.grade, 
                    student.gender));
            } catch (e) {
                console.error(`Could not convert student ${util.inspect(student)} because ${e}`);
            }
        }
        return ret;
    }

    async student(id: any): Promise<Student> {
        let students = await this.studentTable.find({
            id: { $eq: id }
        });
        if (students.length <= 0) throw new Error(`Did not find student id ${id}`);
        if (students.length > 1) throw new Error(`Found too many students for ${id} - ${util.inspect(students)}`);
        let student = students[0];
        // console.log(`student ${id} ${util.inspect(student)}`);
        return new StudentImpl(student.id,
            student.name, student.entered, student.grade, student.gender);
    }

    async delStudent(id: any) {
        await this.studentTable.remove({
            id: { $eq: id }
        });
        await this.save();
    }

    async addStudent(student: Student) {
        let s = new StudentImpl(
            undefined, student.name, student.entered, student.grade, student.gender
        );
        let r = await this.studentTable.insert({
            name: s.name, entered: s.entered, grade: s.grade, gender: s.gender
        });
        await this.save();
        // console.log(`addStudent ${util.inspect(r)}`);
        return r.inserted[0].id;
    }

    async updateStudent(updated: Student) {
        let s = new StudentImpl(
            undefined, updated.name, updated.entered, updated.grade, updated.gender
        );
        await this.studentTable.updateById(updated.id, {
            name: s.name, entered: s.entered, grade: s.grade, gender: s.gender
        });
        await this.save();
        return updated.id;
    }
}

export class StudentImpl implements Student {
    constructor(id: any, 
            name: string, 
            entered: number | string,
            grade: number | string, 
            gender: string) {
        this.setID(id);
        this.setName(name);
        this.setEntered(entered);
        this.setGrade(grade);
        this.setGender(gender);
    }

    private _id: any;
    private _name: string;
    private _entered: number;
    private _grade: number;
    private _gender: Gender;

    get id(): any { return this._id; }
    set id(id: any) { this.setID(id); }
    setID(id: any) {
        this._id = id;
    }

    get name() { return this._name; }
    set name(name: string) { this.setName(name); }
    setName(name: string) {
        if (typeof name !== 'string') {
            throw new Error(`Bad name: ${util.inspect(name)}`);
        }
        this._name = name; 
    }

    get entered(): number { return this._entered; }
    set entered(entered: number) { this.setEntered(entered); }
    setEntered(entered: number | string) {
        // console.log(`setEntered ${entered}`);
        this._entered = normalizeNumber(entered, 'Bad year entered'); 
    }

    get grade(): number { return this._grade; }
    set grade(grade: number) { this.setGrade(grade); }
    setGrade(grade: number | string) {
        this._grade = normalizeNumber(grade, 'Bad grade');
    }

    get gender(): Gender { return this._gender; }
    set gender(gender: Gender) { this.setGender(gender); }
    setGender(gender: string | Gender) {
        this._gender = parseGender(gender);
    }
}


function normalizeNumber(num: number | string, errorIfNotNumber: string): number {
    if (typeof num === 'undefined') {
        throw new Error(`${errorIfNotNumber} -- ${num}`);
    }
    if (typeof num === 'number') return num!;
    let ret = parseInt(num);
    if (isNaN(ret)) {
        throw new Error(`${errorIfNotNumber} ${ret} -- ${num}`);
    }
    return ret!;
}

function isGender(gender: any): gender is Gender {
    return typeof gender === 'string'
       && (gender === 'male' || gender === 'female');
}

function parseGender(gender: string): Gender {
    if (!isGender(gender)) throw new Error(`Bad gender: ${gender}`);
    return (gender === 'male') ? Gender.male : Gender.female;
}
