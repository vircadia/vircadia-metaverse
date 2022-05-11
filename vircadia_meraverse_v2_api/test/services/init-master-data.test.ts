import app from '../../src/app';

describe('\'initMasterData\' service', () => {
    it('registered the service', () => {
        const service = app.service('init-master-data');
        expect(service).toBeTruthy();
    });
});
