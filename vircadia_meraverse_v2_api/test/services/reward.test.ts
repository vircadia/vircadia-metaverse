import app from '../../src/app';

describe('\'reward\' service', () => {
    it('reward the service', () => {
        const service = app.service('reward-item');
        expect(service).toBeTruthy();
    });
});
