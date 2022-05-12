// Initializes the `reset-user` service on path `/reset-user`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ResetUser } from './reset-user.class';
import hooks from './reset-user.hooks';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'reset-user': ResetUser & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {
        paginate: app.get('paginate'),
        id: 'id',
        multi: ['remove'],
    };

    // Initialize our service with any options it requires
    app.use('/reset-user', new ResetUser(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('reset-user');

    service.hooks(hooks);
}
