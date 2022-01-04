import {Command, Flags} from '@oclif/core';

import * as Registrar from 'registrar';

export default class AddClasses extends Command {
    static description = 'Add a class'

    static flags = {
        code: Flags.string({
            description: 'Class code name',
            required: true
        }),
        name: Flags.string({
            description: 'Class name',
            required: true
        }),
        hours: Flags.integer({
            description: 'Credit hours for course',
            required: true
        })
    };

    async run(): Promise<void> {
        const {args, flags} = await this.parse(AddClasses);
        await Registrar.connect("registrardb.sqlite");

        const offered = new Registrar.OfferedClass();
        offered.code = flags.code;
        offered.name = flags.name;
        offered.hours = flags.hours;
        const code = await Registrar
                .getOfferedClassRepository()
                .createAndSave(offered);
        console.log(`AddClasses ${code}`, offered);
    }
}
