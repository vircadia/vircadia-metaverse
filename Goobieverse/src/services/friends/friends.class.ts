import { Db } from "mongodb";
import { Service, MongoDBServiceOptions } from "feathers-mongodb";
import { Application } from "../../declarations";
import { Id, Params } from "@feathersjs/feathers";
import { AccountModel } from "../../interfaces/AccountModel";
import { isValidObject, isValidArray } from "../../utils/Misc";
import { Response } from "../../utils/response";
import { messages } from "../../utils/messages";
const trim = require("trim");

export class Friends extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);

    const client: Promise<Db> = app.get("mongoClient");

    client.then((db) => {
      this.Model = db.collection("friends");
    });
  }

  async create(data: any, params?: Params): Promise<any> {
    try {
      const username = trim(data.username);
      if (username != "" && typeof username != "undefined") {
        const UserData = await super
          .create(data)
          .then((result: any) => {
            let finalData = {};
            finalData = result == null ? {} : result;
            return finalData;
          })
          .catch((error: any) => {
            return error;
          });
        if (isValidObject(UserData) && !UserData.type) {
          return Response.success(UserData);
        }
      } else {
        return Response.error(messages.common_messages_record_added_failed);
      }
    } catch (error: any) {
      return Response.error(messages.common_messages_error);
    }
  }
}
