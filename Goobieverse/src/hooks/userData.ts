import { Hook, HookContext } from "@feathersjs/feathers";

export async function myHook(context: any): Promise<HookContext> {
  // console.log(context, "myHook");

  return context;
}
