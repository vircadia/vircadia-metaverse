// Initializes the `email` service on path `/email`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Email } from './email.class';
import hooks from './email.hooks';
import config from '../../appconfig';
import smtpTransport from 'nodemailer-smtp-transport';
import Mailer from 'feathers-mailer';


// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'email': Email & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const event = Mailer(smtpTransport(config.email));
  app.use('email', event);

  const service = app.service('email');

  service.hooks(hooks);
}
