import { Db } from "mongodb";
import { Service, MongoDBServiceOptions } from "feathers-mongodb";
import { Application } from "../../declarations";
import { Id, Params } from "@feathersjs/feathers";
import { AccountModel } from "../../interfaces/AccountModel";
import { isValidObject, isValidArray } from "../../utils/Misc";
import { Response } from "../../utils/response";
import { messages } from "../../utils/messages";
import { GenUUID } from "../../utils/Misc";
const trim = require("trim");

export class Users extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);

    const client: Promise<Db> = app.get("mongoClient");

    client.then((db) => {
      this.Model = db.collection("accounts");
    });
  }

  async create(data: AccountModel, params?: Params): Promise<any> {
    try {
      const id = GenUUID();
      const username = trim(data.username);
      const email = trim(data.email);
      const password = trim(data.password);
      if (
        id != "" &&
        typeof id != "undefined" &&
        username != "" &&
        typeof username != "undefined" &&
        email != "" &&
        typeof email != "undefined" &&
        password != "" &&
        typeof password != "undefined"
      ) {
        const newData = { ...data, id: id };
        const UserData = await super
          .create(newData)
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

  async find(params?: Params): Promise<any> {
    try {
      const UserData = await super
        .find()
        .then((result: any) => {
          let finalData = {};
          finalData = result == null ? {} : result;
          return finalData;
        })
        .catch((error: any) => {
          return error;
        });
      if (isValidArray(UserData.data)) {
        return Response.success(UserData.data);
      } else {
        return Response.error(messages.common_messages_records_not_available);
      }
    } catch (error: any) {
      return Response.error(messages.common_messages_error);
    }
  }

  async get(id: string, params?: Params): Promise<any> {
    try {
      const UserData = await super
        .get(id)
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
      } else {
        return Response.error(messages.common_messages_record_not_available);
      }
    } catch (error: any) {
      return Response.error(messages.common_messages_error);
    }
  }
}
