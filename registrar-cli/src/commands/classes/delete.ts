import {Command, Flags} from '@oclif/core'

import * as Registrar from 'registrar';

export default class DeleteClass extends Command {
    static description = 'Delete an OfferedClass';

    static flags = {
        code: Flags.string({
            description: "Course code name",
            required: true
        })
    };

    async run(): Promise<void> {
        const {args, flags} = await this.parse(DeleteClass);
        await Registrar.connect("registrardb.sqlite");
        await Registrar.getOfferedClassRepository()
                        .deleteOfferedClass(flags.code);
    }
}
