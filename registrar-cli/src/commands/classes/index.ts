import {Command, Flags} from '@oclif/core'

import * as Registrar from 'registrar';

export default class Classes extends Command {
    static description = 'List classes'

    async run(): Promise<void> {
        await Registrar.connect("registrardb.sqlite");
        const classlist = await Registrar.getOfferedClassRepository()
                        .allClasses();
        console.log(classlist);
    }
}
