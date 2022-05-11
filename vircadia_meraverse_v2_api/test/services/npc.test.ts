import app from '../../src/app';

describe('\'npc\' service', () => {
    it('registered the service', () => {
        const service = app.service('npc');
        expect(service).toBeTruthy();
    });
});
