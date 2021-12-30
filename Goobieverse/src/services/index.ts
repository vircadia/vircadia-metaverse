import { Application } from '../declarations';
import profiles from './profiles/profiles.service'; 
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(profiles);
}
