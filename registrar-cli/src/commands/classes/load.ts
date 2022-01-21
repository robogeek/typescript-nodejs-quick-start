import {Command, Flags} from '@oclif/core';

import * as Registrar from 'registrar';

export default class LoadClasses extends Command {
    static description = 'Load classes'

    static args = [
        { name: 'classes' }
    ];

    async run(): Promise<void> {
        const {args, flags} = await this.parse(LoadClasses);
        await Registrar.connect();
        await Registrar.getOfferedClassRepository()
                        .updateClasses(args.classes);
    }
}
