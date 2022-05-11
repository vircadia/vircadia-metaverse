import app from '../../src/app';

describe('\'quest\' service', () => {
    it('registered the service', () => {
        const service = app.service('quest');
        expect(service).toBeTruthy();
    });
});
