import app from '../../src/app';

describe('\'current\' service', () => {
    it('registered the service', () => {
        const service = app.service('current');
        expect(service).toBeTruthy();
    });
});
