// Initializes the `connections` service on path `/connections`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Connections } from './connections.class';
import hooks from './connections.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'connections': Connections & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
    const options = {
        paginate: app.get('paginate'),
        id:'id'
    };

    // Initialize our service with any options it requires
    app.use('/connections', new Connections(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('connections');

    service.hooks(hooks);
}
