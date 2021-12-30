import { HookContext } from '@feathersjs/feathers';
import { IsNotNullOrEmpty } from '../utils/Misc';
import { Perm } from '../utils/Perm';
import { Response } from '../utils/response';

export default () => {
  return async (context: HookContext): Promise<HookContext> => {
     
    context.result = Response.error(context?.error?.message);
    return context;
  };
};