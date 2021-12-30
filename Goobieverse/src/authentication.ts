import { Params, ServiceAddons } from "@feathersjs/feathers";
import { AuthenticationService, JWTStrategy } from "@feathersjs/authentication";
import { LocalStrategy } from "@feathersjs/authentication-local";
import { expressOauth } from "@feathersjs/authentication-oauth";

import { Application } from "./declarations";

declare module "./declarations" {
  interface ServiceTypes {
    authentication: AuthenticationService & ServiceAddons<any>;
  }
}
// class MyLocalStrategy extends LocalStrategy {
//   async findEntity(username: any, params: Params) {
//     try {
//       const entity = await super.findEntity(username, params);

//       return entity;
//     } catch (error) {
//       throw new Error("Entity not found");
//     }
//   }

//   async comparePassword(entity: any, password: any) {
//     try {
//       const result = await super.comparePassword(entity, password);

//       return result;
//     } catch (error) {
//       throw new Error("Invalid password");
//     }
//   }
// }

export default function (app: Application): void {
  const authentication = new AuthenticationService(app);
  // const authService = new AuthenticationService(app);

  authentication.register("jwt", new JWTStrategy());
  authentication.register("local", new LocalStrategy());

  // authService.register("local", new MyLocalStrategy());
  // app.use("/authentication", authService);

  app.use("/authentication", authentication);
  app.configure(expressOauth());
}
