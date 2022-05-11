import app from '../../src/app';

describe('\'achievementItems\' service', () => {
    it('registered the service', () => {
        const service = app.service('achievement-items');
        expect(service).toBeTruthy();
    });
});
