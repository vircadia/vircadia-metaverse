import { HookContext } from '@feathersjs/feathers';

export default (): any => {
  return (context:HookContext): boolean => {
    return !!(context.params.headers?.authorization&& context.params.headers.authorization !== 'null'&& context.params.headers.authorization !== '');
  };
};