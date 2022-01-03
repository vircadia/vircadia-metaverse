// Initializes the `users` service on path `/users`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Auth } from './auth.class';
import hooks from './auth.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    auth: Auth & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
    const options = {
        paginate: app.get('paginate'),
    };

    // Initialize our service with any options it requires
    app.use('/auth', new Auth(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('auth');

    service.hooks(hooks);
}
