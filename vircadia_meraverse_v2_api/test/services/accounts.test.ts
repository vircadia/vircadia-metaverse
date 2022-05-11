import app from '../../src/app';

describe('\'accounts\' service', () => {
    it('registered the service', async () => {
        const service = app.service('accounts');
        expect(service).toBeTruthy();
    });
});
