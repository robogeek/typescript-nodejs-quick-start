import {Command, Flags} from '@oclif/core';

import * as Registrar from 'registrar';

export default class EnrollStudent extends Command {
    static description = 'Enroll a student in a class'

    static flags = {
        code: Flags.string({
            description: 'Class code name',
            required: true
        }),
        id: Flags.integer({
            description: 'Student ID number',
            required: true
        })
    };

    async run(): Promise<void> {
        const {args, flags} = await this.parse(EnrollStudent);
        await Registrar.connect();

        await Registrar.getOfferedClassRepository()
                .enrollStudentInClass(flags.id, flags.code);
    }
}
