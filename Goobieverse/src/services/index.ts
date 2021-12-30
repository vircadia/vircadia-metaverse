import { Application } from '../declarations';
import users from './users/users.service';
import friends from './friends/friends.service';
import auth from './auth/auth.service';

export default function (app: Application): void {
  app.configure(auth);
  app.configure(users);
  app.configure(friends);
}
