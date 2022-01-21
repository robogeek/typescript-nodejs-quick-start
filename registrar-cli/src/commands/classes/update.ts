import {Command, Flags} from '@oclif/core';

import * as Registrar from 'registrar';

export default class UpdateClasses extends Command {
    static description = 'Update a class'

    static flags = {
        code: Flags.string({
            description: 'Class code name',
            required: true
        }),
        name: Flags.string({
            description: 'Class name',
            required: false
        }),
        hours: Flags.integer({
            description: 'Credit hours for course',
            required: false
        })
    };

    async run(): Promise<void> {
        const {args, flags} = await this.parse(UpdateClasses);
        await Registrar.connect();

        const offered = new Registrar.OfferedClass();
        if (typeof flags.code !== 'undefined') {
            offered.code = flags.code;
        }
        if (typeof flags.name !== 'undefined') {
            offered.name = flags.name;
        }
        if (typeof flags.hours !== 'undefined') {
            offered.hours = flags.hours;
        }
        const code = await Registrar.getOfferedClassRepository()
                .updateOfferedClass(flags.code, offered);
        console.log(`UpdateClass ${code}`, offered);
    }
}
