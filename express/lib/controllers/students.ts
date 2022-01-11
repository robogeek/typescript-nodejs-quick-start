
import * as util from 'util';
import * as express from 'express';
import { 
    Student,
    getStudentRepository,
    OfferedClass,
    getOfferedClassRepository
} from 'registrar';

export async function home(
            req: express.Request,
            res: express.Response,
            next: express.NextFunction): Promise<void> {
    try {
        let students = await getStudentRepository().findAll();
        console.log(`controllers home ${util.inspect(students)}`);
        res.render('index.html', { title: 'Students', students });
    } catch(err) {
        console.error(`student home ERROR ${err.stack}`);
        next(err); 
    }
}

export async function create(
            req: express.Request,
            res: express.Response,
            next: express.NextFunction): Promise<void> {
    try {
        res.render('studentedit.html', {
            title: 'Add Student',
            docreate: true,
            id: -1,
            student: undefined,
            classes: await classesForStudent(undefined)
        });
    } catch(err) {
        console.error(`student create ERROR ${err.stack}`);
        next(err); 
    }
}

export async function createUpdateStudent(
            req: express.Request,
            res: express.Response,
            next: express.NextFunction): Promise<void> {
    try {
        console.log(`createUpdateStudent ${util.inspect(req.body)}`);
        let studentid;
        let stud = new Student();
        stud.name = req.body.name;
        stud.entered = ensureNumber(req.body.entered);
        stud.grade = ensureNumber(req.body.grade);
        stud.gender = req.body.gender;
        if (req.body.docreate === "create") {
            console.log(`createUpdateStudent CREATE ${util.inspect(stud)}`);
            studentid = await getStudentRepository().createAndSave(stud);
        } else {
            stud.id = ensureNumber(req.body.id);
            console.log(`createUpdateStudent UPDATE ${util.inspect(stud)}`);
            studentid = await getStudentRepository()
                                    .updateStudent(stud.id, stud);
        }
        if (typeof req.body['enrolled-class'] !== 'undefined') {
            let codes;
            if (Array.isArray(req.body['enrolled-class'])) {
                codes = req.body['enrolled-class'];
            } else if (typeof req.body['enrolled-class'] === 'string') {
                codes = [ req.body['enrolled-class'] ];
            }
            if (codes) {
                await  getOfferedClassRepository()
                    .updateStudentEnrolledClasses(studentid, codes);
            }
        }
        res.redirect(`/registrar/students/read?id=${studentid}`);
    } catch(err) {
        console.error(`student createUpdateStudent ERROR ${err.stack}`);
        next(err); 
    }
}

export async function read(
            req: express.Request,
            res: express.Response,
            next: express.NextFunction): Promise<void> {
    try {
        console.log(req.query);
        let student;
        let studentid = parseInt(<string>req.query.id);
        student = await getStudentRepository()
                            .findOneStudent(studentid);
        console.log(`read ${req.query.id} => ${util.inspect(student)}`);
        res.render('student.html', {
            title: student.name,
            id: student.id,
            student
        });
    } catch(err) {
        console.error(`student read ERROR ${err.stack}`);
        next(err); 
    }
}

export async function update(
            req: express.Request,
            res: express.Response,
            next: express.NextFunction): Promise<void> {
    try {
        console.log(`update req.query ${util.inspect(req.query)}`);
        let studentid = parseInt(<string>req.query.id);
        let student = await getStudentRepository()
                                .findOneStudent(studentid);
        console.log(`update ${req.query.id} => ${util.inspect(student)}`);
        res.render('studentedit.html', {
            title: 'Edit Student',
            docreate: false,
            id: student.id,
            isMale: student.gender === "male" ? true : false,
            isFemale: student.gender === "female" ? true : false,
            student,
            classes: await classesForStudent(student)
        });
    } catch(err) {
        console.error(`student update ERROR ${err.stack}`);
        next(err); 
    }
}

export async function destroy(
            req: express.Request,
            res: express.Response,
            next: express.NextFunction): Promise<void> {
    try {
        console.log(req.query);
        let studentid = parseInt(<string>req.query.id);
        let student = await getStudentRepository()
                                .findOneStudent(studentid);
        console.log(`destroy ${req.query.id} => ${util.inspect(student)}`);
        res.render('dodestroy.html', {
            title: 'Delete Student',
            id: student.id,
            student
        });
    } catch(err) {
        console.error(`student destroy ERROR ${err.stack}`);
        next(err); 
    }
}

export async function dodestroy(
            req: express.Request,
            res: express.Response,
            next: express.NextFunction): Promise<void> {
    try {
        console.log(req.body);
        let studentid = parseInt(<string>req.body.id);
        // console.log(`dodestroy ${req.body.id} ==> ${studentid}`);
        let student = await getStudentRepository()
                                .findOneStudent(studentid);
        // console.log(`dodestroy ${req.body.id} => ${util.inspect(student)}`);
        getStudentRepository().deleteStudent(student.id);
        res.redirect('/');
    } catch(err) {
        console.error(`student dodestroy ERROR ${err.stack}`);
        next(err); 
    }
}

function ensureNumber(val: number | string): number {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseInt(val);
    throw new Error(`ensureNumber couldn't deal with ${val}`);
}

export async function classesForStudent(student: Student): Promise<OfferedClass[]> {
    let classes = await getOfferedClassRepository().allClasses();
    let ret = [];
    for (let clazz of classes) {
        let isEnrolled = false;

        if (student) {
            for (let enrolledClass of student.classes) {
                if (clazz.code === enrolledClass.code) {
                    isEnrolled = true;
                }
            }
        }

        ret.push({
            code: clazz.code,
            name: clazz.name,
            hours: clazz.hours,
            students: clazz.students,
            isEnrolled: isEnrolled
        });
    }

    console.log(`classesForStudent ${util.inspect(student)} => ${util.inspect(ret)}`);
    return ret;
}
