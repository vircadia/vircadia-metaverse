import { HooksObject } from "@feathersjs/feathers";
import { myHook } from "../../hooks/userData";

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [myHook],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
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
