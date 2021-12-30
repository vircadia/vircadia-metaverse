// Initializes the `friends` service on path `/friends`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Friends } from './friends.class';
import hooks from './friends.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    friends: Friends & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/friends', new Friends(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('friends');

  service.hooks(hooks);
}
