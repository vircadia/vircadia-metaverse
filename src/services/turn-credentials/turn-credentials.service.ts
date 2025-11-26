import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TurnCredentials } from './turn-credentials.class';
import hooks from './turn-credentials.hooks';

declare module '../../declarations' {
    interface ServiceTypes {
        'turn-credentials': TurnCredentials & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const turnCredentials = new TurnCredentials(app);

    // Initialize our service with any options it requires
    app.use('/turn-credentials', turnCredentials);

    // Get our initialized service so that we can register hooks
    const service = app.service('turn-credentials');

    service.hooks(hooks);
}
