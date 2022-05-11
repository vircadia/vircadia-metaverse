import app from '../../src/app';

describe('\'itemHandler\' service', () => {
    it('registered the service', () => {
        const service = app.service('item-handler');
        expect(service).toBeTruthy();
    });
});
