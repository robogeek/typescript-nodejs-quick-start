import {Command, Flags} from '@oclif/core'

import * as Registrar from 'registrar';

export default class UpdateStudents extends Command {
    static description = 'Update a student'

    static flags = {
        id: Flags.integer({
            description: "ID number",
            required: true
        }),
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

    static args = [];

    async run(): Promise<void> {
        const {args, flags} = await this.parse(UpdateStudents);
        await Registrar.connect("registrardb.sqlite");

        const student = new Registrar.Student();
        if (typeof flags.name !== 'undefined') {
            student.name = flags.name;
        }
        if (typeof flags.entered !== 'undefined') {
            student.entered = flags.entered;
        }
        if (typeof flags.grade !== 'undefined') {
            student.grade = flags.grade;
        }
        if (typeof flags.gender !== 'undefined') {
            student.gender = flags.gender;
        }
        const idnum = await Registrar.getStudentRepository()
                .updateStudent(flags.id, student);
        console.log(`AddStudent ${idnum}`, student);
    }
}
