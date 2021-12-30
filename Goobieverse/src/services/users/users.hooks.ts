import { HooksObject } from "@feathersjs/feathers";
import { myHook } from "../../hooks/userData";
import * as feathersAuthentication from "@feathersjs/authentication";
import * as local from "@feathersjs/authentication-local";
import bcrypt from "bcrypt";

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [hashPassword("password")],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [protect("password")],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
} as HooksObject;
