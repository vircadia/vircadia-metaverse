import app from '../../src/app';

describe('\'inventory-transfer\' service', () => {
    it('registered the service', () => {
        const service = app.service('inventory-transfer');
        expect(service).toBeTruthy();
    });
});
