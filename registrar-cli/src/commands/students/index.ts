import {Command, Flags} from '@oclif/core';
import cli from 'cli-ux';

import * as Registrar from 'registrar';

export default class Students extends Command {
    static description = 'List students';

    async run(): Promise<void> {
        await Registrar.connect("registrardb.sqlite");
        const userlist = await Registrar.getStudentRepository()
                        .findAll();
        console.log(userlist);
    }
}
