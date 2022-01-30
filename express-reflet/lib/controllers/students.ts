
import * as util from 'util';
import * as express from 'express';
import {
        Router, Get, Post, Req, Res, Next, Params, Body, Use, Catch, Query
} from '@reflet/express';
import { 
    Student,
    getStudentRepository,
    OfferedClass,
    getOfferedClassRepository
} from 'registrar';
import { LogRequest } from './classes.js';

function IsGoodStudentID() {
    console.log(`IsGoodStudentID outer function`);
    return Use(async (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction) => {
        console.log(`IsGoodStudentID inner function`);
        if (typeof req.query === 'undefined') {
            return next({ status: 400, message: `No query object on ${req.url}` });
        }
        if (typeof req.query.id === 'undefined') {
            return next({ status: 400, message: `No student ID on ${req.url}` });
        }
        if (typeof req.query.id !== 'string') {
            return next({
                status: 400,
                message: `Invalid student ID on ${req.url} - ${req.query.id}`
            });
        }

        let studentid = ensureNumber(req.query.id);

        console.log(`IsGoodStudentID passed all checks for ${studentid}`);

        if (!await getStudentRepository().studentIDexists(studentid)) {
            console.log(`IsGoodStudentID student ID ${studentid} does not exist`);
            return next({
                status: 400,
                message: `Student ${studentid} does not exist`
            });
        }
        console.log(`IsGoodStudentID student ID ${studentid} exists -- FINI`);
        next();
    });
}

@Router('/')
export class HomePageController {
    @LogRequest()
    @Get('/')
    async home(
        @Req() req: express.Request,
        @Res() res: express.Response,
        @Next() next: express.NextFunction): Promise<void> {

        let students = await getStudentRepository().findAll();
        console.log(`controllers home ${util.inspect(students)}`);
        res.render('index.html', { title: 'Students', students });
    }
}

@Catch((err, req, res, next) => {
    res.status(err.status);
    res.render('error.html', {
        message: `StudentsController FAIL because: ${err.message}`
    });
})
@Router('/registrar/students')
export class StudentsController {
    @LogRequest()
    @Get('/create')
    async create(
        @Req() req: express.Request,
        @Res() res: express.Response,
        @Next() next: express.NextFunction): Promise<void> {

        res.render('studentedit.html', {
            title: 'Add Student',
            docreate: true,
            id: -1,
            student: undefined,
            classes: await classesForStudent(undefined)
        });
    }

    @LogRequest()
    @Post('/')
    async createUpdateStudent(
        @Req() req: express.Request,
        @Res() res: express.Response,
        @Next() next: express.NextFunction): Promise<void> {

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
    }

    @IsGoodStudentID()
    @LogRequest()
    @Get('/read')
    async read(
        @Req() req: express.Request,
        @Res() res: express.Response,
        @Next() next: express.NextFunction,
        @Query('id') id: string): Promise<void> {

        console.log(`StudentsController read id ${id}`);
        let student;
        let studentid = parseInt(id);
        student = await getStudentRepository()
                            .findOneStudent(studentid);
        console.log(`read ${req.query.id} => ${util.inspect(student)}`);
        res.render('student.html', {
            title: student.name,
            id: student.id,
            student
        });
    }

    @IsGoodStudentID()
    @LogRequest()
    @Get('/update')
    async update(
        @Req() req: express.Request,
        @Res() res: express.Response,
        @Next() next: express.NextFunction): Promise<void> {

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
    }

    @IsGoodStudentID()
    @LogRequest()
    @Get('/destroy')
    async destroy(
        @Req() req: express.Request,
        @Res() res: express.Response,
        @Next() next: express.NextFunction): Promise<void> {

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
    }

    @IsGoodStudentID()
    @LogRequest()
    @Post('/destroy/confirm')
    async dodestroy(
        @Req() req: express.Request,
        @Res() res: express.Response,
        @Next() next: express.NextFunction): Promise<void> {

        console.log(req.body);
        let studentid = parseInt(<string>req.body.id);
        // console.log(`dodestroy ${req.body.id} ==> ${studentid}`);
        let student = await getStudentRepository()
                                .findOneStudent(studentid);
        // console.log(`dodestroy ${req.body.id} => ${util.inspect(student)}`);
        getStudentRepository().deleteStudent(student.id);
        res.redirect('/');
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
