import app from '../../src/app';

describe('\'metaverse_info\' service', () => {
    it('registered the service', () => {
        const service = app.service('metaverse_info');
        expect(service).toBeTruthy();
    });
});
