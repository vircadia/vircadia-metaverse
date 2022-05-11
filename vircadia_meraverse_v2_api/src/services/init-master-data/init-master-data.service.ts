// Initializes the `initMasterData` service on path `/init-master-data`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { InitMasterData } from './init-master-data.class';
import hooks from './init-master-data.hooks';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'init-master-data': InitMasterData & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {};

    // Initialize our service with any options it requires
    app.use('/init-master-data', new InitMasterData(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('init-master-data');

    service.hooks(hooks);
}
