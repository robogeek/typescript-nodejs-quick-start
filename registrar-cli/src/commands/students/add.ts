import {Command, Flags} from '@oclif/core';
import cli from 'cli-ux';

import * as Registrar from 'registrar';

export default class AddStudents extends Command {
    static description = 'Add a student'

    static flags = {
        name: Flags.string({
            description: 'Student name',
            required: false
        }),
        entered: Flags.integer({
            description: 'Year entered',
            required: false
        }),
        grade: Flags.integer({
            description: 'Current level at school',
            required: false
        }),
        gender: Flags.string({
            description: 'Gender',
            required: false
        })
    };

    async run(): Promise<void> {
        const {args, flags} = await this.parse(AddStudents);
        await Registrar.connect();

        const student = new Registrar.Student();

        if (typeof flags.name === 'undefined') {
            student.name = await cli.prompt('Enter the students name');
        } else {
            student.name = flags.name;
        }
        if (typeof flags.entered === 'undefined') {
            student.entered = await cli.prompt('What year did the students first enroll');
        } else {
            student.entered = flags.entered;
        }
        if (typeof flags.grade === 'undefined') {
            student.grade = await cli.prompt('What grade is the student');
        } else {
            student.grade = flags.grade;
        }
        if (typeof flags.gender === 'undefined') {
            student.gender = await cli.prompt('What gender is the student');
        } else {
            student.gender = flags.gender;
        }
        const idnum = await Registrar.getStudentRepository()
                .createAndSave(student);
        console.log(`AddStudent ${idnum}`, student);
    }
}
