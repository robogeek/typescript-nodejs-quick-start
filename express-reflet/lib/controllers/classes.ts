
import * as util from 'util';
import * as express from 'express';
import {
    Router, Get, Post, Req, Res, Next, Params, Body, Catch, Query 
} from '@reflet/express';

import { 
    Student,
    OfferedClass,
    getOfferedClassRepository
} from 'registrar';
import * as fileUpload from 'express-fileupload';
import { promises as fsp } from 'fs';

@Router('/classes')
export class ClassesController {

    @Catch((err, req, res, next) => {
        res.status(err.status);
        res.render('error.html', {
            message: `Could not list classes because: ${err.message}`
        });
    })
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
