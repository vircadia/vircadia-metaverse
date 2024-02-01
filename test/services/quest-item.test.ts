import app from '../../src/app';

describe('\'quest-item\' service', () => {
    it('registered the service', () => {
        const service = app.service('quest-item');
        expect(service).toBeTruthy();
    });
});
