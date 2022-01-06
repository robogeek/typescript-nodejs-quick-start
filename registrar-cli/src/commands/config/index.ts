import {Command, Flags} from '@oclif/core';

import * as Registrar from 'registrar';

export default class Configuration extends Command {
    static description = 'Print configuration information';

    static flags = {
        driver: Flags.boolean({
            description: 'Show driver information',
            required: false
        })
    };

    async run(): Promise<void> {
        const {args, flags} = await this.parse(Configuration);
        await Registrar.connect("registrardb.sqlite");
        if (!Registrar.connected) {
            throw new Error(`Database not connected`);
        }
        console.log({
            name: Registrar.connection.name,
            options: Registrar.connection.options
        });
        if (flags.driver) {
            console.log({
                driver: Registrar.connection.driver
            });
        }
    }
}
