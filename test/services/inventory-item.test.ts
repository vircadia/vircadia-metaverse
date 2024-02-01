import app from '../../src/app';

describe('\'InventoryItem\' service', () => {
    it('registered the service', () => {
        const service = app.service('inventory-item');
        expect(service).toBeTruthy();
    });
});
