import {Command, Flags} from '@oclif/core'

import * as Registrar from 'registrar';

export default class DeleteStudents extends Command {
    static description = 'Delete a student';

    static flags = {
        id: Flags.integer({
            description: "ID number",
            required: true
        })
    };

    async run(): Promise<void> {
        const {args, flags} = await this.parse(DeleteStudents);
        await Registrar.connect();
        await Registrar.getStudentRepository()
                        .deleteStudent(flags.id);
    }
}
