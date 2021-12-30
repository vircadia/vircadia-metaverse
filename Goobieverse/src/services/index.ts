import { Application } from '../declarations';
import users from './users/users.service';
import friends from './friends/friends.service';
//import metaverseInfo from './metaverse_info/metaverse_info.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(friends);
}
