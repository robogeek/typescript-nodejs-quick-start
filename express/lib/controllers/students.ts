
import * as util from 'util';
import { Request, Response, NextFunction } from "express";
import {
    students as allStudents,
    student as getStudent,
    addStudent,
    updateStudent,
    destroyStudent
} from "../models/registrar";

export function home(req: Request, res: Response) {
    let students = allStudents();
    console.log(`controllers home ${util.inspect(students)}`);
    res.render('index', { title: 'Students', students });
}

export function create(req: Request, res: Response) {
    res.render('studentedit', {
        title: 'Add Student',
        docreate: true,
        id: -1,
        student: undefined
    });
}

export async function createUpdateStudent(req: Request, res: Response) {
    let studentid;
    if (req.body.docreate === "create") {
        studentid = await addStudent({
            id: -1,
            name: req.body.name,
            entered: req.body.entered,
            grade: req.body.grade,
            gender: req.body.gender
        });
    } else {
        studentid = await updateStudent({
            id: req.body.id,
            name: req.body.name,
            entered: req.body.entered,
            grade: req.body.grade,
            gender: req.body.gender
        });
    }
    res.redirect(`/registrar/students/read?id=${studentid}`);
}

export function read(req: Request, res: Response) {
    let student = getStudent(req.query.id);
    res.render('student', {
        title: student.name,
        id: student.id,
        student
    });
}

export function update(req: Request, res: Response) {
    let student = getStudent(req.query.id);
    res.render('studentedit', {
        title: 'Edit Student',
        docreate: false,
        id: student.id,
        student
    });
}

export function destroy(req: Request, res: Response) {
    let student = getStudent(req.query.id);
    res.render('dodestroy', {
        title: 'Delete Student',
        id: student.id,
        student
    });
}

export function dodestroy(req: Request, res: Response) {
    let student = getStudent(req.query.id);
    destroyStudent(student);
    res.redirect('/');
}