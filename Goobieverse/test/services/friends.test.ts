import app from '../../src/app';

describe('\'friends\' service', () => {
    it('registered the service', () => {
        const service = app.service('friends');
        expect(service).toBeTruthy();
    });
});
