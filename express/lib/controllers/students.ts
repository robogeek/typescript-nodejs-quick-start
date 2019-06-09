
import * as util from 'util';
import { Request, Response, NextFunction } from "express";
import {
    students as allStudents,
    student as getStudent,
    addStudent,
    doUpdateStudent,
    destroyStudent
} from '../models/registrar.js';
import {
    classesForStudent,
    updateStudentEnrolledClasses
} from '../models/classes';
import { Student } from 'registrar/dist/entities/Student';

export async function home(req: Request, res: Response, next: NextFunction) {
    try {
        let students = await allStudents();
        console.log(`controllers home ${util.inspect(students)}`);
        res.render('index', { title: 'Students', students });
    } catch(err) {
        console.error(`student home ERROR ${err.stack}`);
        next(err); 
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        res.render('studentedit', {
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

export async function createUpdateStudent(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`createUpdateStudent ${util.inspect(req.body)}`);
        let studentid;
        let stud = new Student();
        stud.name = req.body.name;
        stud.entered = req.body.entered;
        stud.grade = req.body.grade;
        stud.gender = req.body.gender;
        if (req.body.docreate === "create") {
            console.log(`createUpdateStudent CREATE ${util.inspect(stud)}`);
            studentid = await addStudent(stud);
        } else {
            stud.id = req.body.id;
            console.log(`createUpdateStudent UPDATE ${util.inspect(stud)}`);
            studentid = await doUpdateStudent(stud);
        }
        await updateStudentEnrolledClasses(studentid, req.body['enrolled-class']);
        res.redirect(`/registrar/students/read?id=${studentid}`);
    } catch(err) {
        console.error(`student createUpdateStudent ERROR ${err.stack}`);
        next(err); 
    }
}

export async function read(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.query);
        let student = await getStudent(req.query.id);
        console.log(`read ${req.query.id} => ${util.inspect(student)}`);
        res.render('student', {
            title: student.name,
            id: student.id,
            student
        });
    } catch(err) {
        console.error(`student read ERROR ${err.stack}`);
        next(err); 
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`update req.query ${util.inspect(req.query)}`);
        let student = await getStudent(req.query.id);
        console.log(`update ${req.query.id} => ${util.inspect(student)}`);
        res.render('studentedit', {
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

export async function destroy(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.query);
        let student = await getStudent(req.query.id);
        console.log(`destroy ${req.query.id} => ${util.inspect(student)}`);
        res.render('dodestroy', {
            title: 'Delete Student',
            id: student.id,
            student
        });
    } catch(err) {
        console.error(`student destroy ERROR ${err.stack}`);
        next(err); 
    }
}

export async function dodestroy(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.body);
        let student = await getStudent(req.body.id);
        console.log(`dodestroy ${req.body.id} => ${util.inspect(student)}`);
        destroyStudent(student);
        res.redirect('/');
    } catch(err) {
        console.error(`student dodestroy ERROR ${err.stack}`);
        next(err); 
    }
}
