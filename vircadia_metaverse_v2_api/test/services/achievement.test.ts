import app from '../../src/app';

describe('\'achievement\' service', () => {
    it('registered the service', () => {
        const service = app.service('achievement');
        expect(service).toBeTruthy();
    });
});
