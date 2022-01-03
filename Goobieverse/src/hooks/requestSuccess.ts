import { HookContext } from '@feathersjs/feathers';
import { Response } from '../utils/response';

export default () => {
    return async (context: HookContext): Promise<HookContext> => {
        context.result = Response.success(context.result);
        return context;
    };
};