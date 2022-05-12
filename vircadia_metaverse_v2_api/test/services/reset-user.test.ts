import app from '../../src/app';

describe('\'reset-user\' service', () => {
    it('registered the service', () => {
        const service = app.service('reset-user');
        expect(service).toBeTruthy();
    });
});
