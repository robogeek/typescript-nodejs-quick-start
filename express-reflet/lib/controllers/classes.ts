
import * as util from 'util';
import * as express from 'express';
import {
    Router, Get, Post, Req, Res, Next, Params, Body, Catch, Query, Use
} from '@reflet/express';

import { 
    Student,
    OfferedClass,
    getOfferedClassRepository
} from 'registrar';
import * as fileUpload from 'express-fileupload';
import { promises as fsp } from 'fs';

export function LogRequest() {
    console.log(`LogRequest outer function`);
    return Use((
            req: express.Request,
            res: express.Response,
            next: express.NextFunction) => {
        console.log(`LogRequest ${req.method} ${req.url} ${req.originalUrl}`);
        next();
    });
}

function IsGoodClassCode() {
    console.log(`IsGoodClassCode outer function`);
    return Use(async (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction) => {
        console.log(`IsGoodClassCode inner function`);
        if (typeof req.query === 'undefined') {
            return next({ status: 400, message: `No query object on ${req.url}` });
        }
        if (typeof req.query.code === 'undefined') {
            return next({ status: 400, message: `No class code on ${req.url}` });
        }
        if (typeof req.query.code !== 'string') {
            return next({
                status: 400,
                message: `Invalid class code on ${req.url} - ${req.query.code}`
            });
        }

        console.log(`IsGoodClassCode passed all checks for ${req.query.code}`);

        if (!await getOfferedClassRepository().classCodeExists(<string>req.query.code)) {
            return next({
                status: 400,
                message: `Class ${req.query.code} does not exist`
            });
        }
        // req.selectedClass = clazz;
        next();
    });
}

@Router('/classes')
export class ClassesController {

    @Catch((err, req, res, next) => {
        res.status(err.status);
        res.render('error.html', {
            message: `Could not list classes because: ${err.message}`
        });
    })
    @LogRequest()
    @Get('/list')
    async home(
        @Req() req: express.Request,
        @Res() res: express.Response,
        @Next() next: express.NextFunction): Promise<void> {

        let classes = await getOfferedClassRepository().allClasses();
        console.log(`controllers classes home ${util.inspect(classes)}`);
        res.render('classes.html', { title: 'Classes', classes });
    }

    @Catch((err, req, res, next) => {
        res.status(err.status);
        res.render('error.html', {
            message: `Could not read information on class because: ${err.message}`
        });
    })
    @LogRequest()
    @IsGoodClassCode()
    @Get('/read')
    async read(
        @Res() res: express.Response,
        @Query('code') code: string): Promise<void> {

        if (!code) {
            throw { status: 400, message: 'No class code supplied' };
        }
        let clazz = await getOfferedClassRepository().findOneClass(code);
        console.log(`read ${code} => ${util.inspect(clazz)}`);
        res.render('class.html', {
            title: clazz.name,
            code: clazz.code,
            class: clazz
        });
    }

    @LogRequest()
    @Post('/update/upload')
    async handleUpload(
        @Req() req: express.Request,
        @Res() res: express.Response,
        @Next() next: express.NextFunction): Promise<void> {

        // console.log(req.files);
        if (!req.files
         || Object.keys(req.files).length === 0) {
            res.status(400).send('No files were uploaded.');
            return;
        }

        const classesyaml = (<fileUpload.UploadedFile>req.files.classesyml);

        if (classesyaml.mimetype !== 'application/x-yaml') {
            res.status(400).send(`Uploaded file ${classesyaml} not a YAML file`);            
        }

        await getOfferedClassRepository().updateClasses(classesyaml.tempFilePath);
        await fsp.unlink(classesyaml.tempFilePath);
        res.redirect('/classes/list');
    }
}
