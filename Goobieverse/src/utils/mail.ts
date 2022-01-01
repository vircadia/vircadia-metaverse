import { Application } from '../declarations';
import { BadRequest } from '@feathersjs/errors';

export async function sendEmail(app: Application, email: any): Promise<void> {
  if (email.to) {
    email.html = email.html.replace(/&amp;/g, '&');
    try {
      const abc = await app
        .service('email')
        .create(email)
        .then(function (result) {
          return result;
        });
      return abc;
    } catch (error: any) {
      return Promise.reject(new BadRequest(error));
    }
  }
}