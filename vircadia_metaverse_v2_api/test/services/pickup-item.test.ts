import app from '../../src/app';

describe('\'PickupItem\' service', () => {
    it('registered the service', () => {
        const service = app.service('pickup-item');
        expect(service).toBeTruthy();
    });
});
