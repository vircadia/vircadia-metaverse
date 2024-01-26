import app from '../../src/app';

describe('\'resetPassword\' service', () => {
    it('registered the service', () => {
        const service = app.service('reset-password');
        expect(service).toBeTruthy();
    });
});
