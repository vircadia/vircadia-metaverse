import app from '../../src/app';

describe('\'location\' service', () => {
    it('registered the service', () => {
        const service = app.service('location');
        expect(service).toBeTruthy();
    });
});
