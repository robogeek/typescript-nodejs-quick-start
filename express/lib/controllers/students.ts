
import * as util from 'util';
import { Request, Response, NextFunction } from "express";
import {
    students as allStudents,
    student as getStudent,
    addStudent,
    updateStudent,
    destroyStudent
} from "../models/registrar";

export function home(req: Request, res: Response, next: NextFunction) {
    try {
        let students = allStudents();
        console.log(`controllers home ${util.inspect(students)}`);
        res.render('index', { title: 'Students', students });
    } catch(err) {
        console.error(`student home ERROR ${err.stack}`);
        next(err); 
    }
}

export function create(req: Request, res: Response, next: NextFunction) {
    try {
        res.render('studentedit', {
            title: 'Add Student',
            docreate: true,
            id: -1,
            student: undefined
        });
    } catch(err) {
        console.error(`student create ERROR ${err.stack}`);
        next(err); 
    }
}

export async function createUpdateStudent(req: Request, res: Response, next: NextFunction) {
    try {
        let studentid;
        if (req.body.docreate === "create") {
            let stud = {
                name: req.body.name,
                entered: req.body.entered,
                grade: req.body.grade,
                gender: req.body.gender
            };
            console.log(`createUpdateStudent CREATE ${util.inspect(stud)}`);
            studentid = await addStudent(stud);
        } else {
            let stud = {
                id: req.body.id,
                name: req.body.name,
                entered: req.body.entered,
                grade: req.body.grade,
                gender: req.body.gender
            };
            console.log(`createUpdateStudent UPDATE ${util.inspect(stud)}`);
            studentid = await updateStudent(stud);
        }
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
        console.log(req.query);
        let student = await getStudent(req.query.id);
        console.log(`update ${req.query.id} => ${util.inspect(student)}`);
        res.render('studentedit', {
            title: 'Edit Student',
            docreate: false,
            id: student.id,
            isMale: student.gender === "male" ? true : false,
            isFemale: student.gender === "female" ? true : false,
            student
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