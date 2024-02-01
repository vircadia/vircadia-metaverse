import app from '../../src/app';

describe('\'place\' service', () => {
    it('registered the service', () => {
        const service = app.service('place');
        expect(service).toBeTruthy();
    });
});
