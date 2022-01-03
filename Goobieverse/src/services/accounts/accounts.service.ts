// Initializes the `accounts` service on path `/accounts`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Accounts } from './accounts.class'; 
import hooks from './accounts.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'accounts': Accounts & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
    const options = {
        paginate: app.get('paginate'),
        id:'id',
        multi:['remove']
    };

    // Initialize our service with any options it requires
    app.use('/accounts', new Accounts(options, app));
  
    //app.use('/accounts/:accountId/field/:fieldName', app.service('accounts'));
    // Get our initialized service so that we can register hooks
    const service = app.service('accounts');
    service.hooks(hooks);
}
