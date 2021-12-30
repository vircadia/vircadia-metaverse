import app from '../../src/app';

describe('\'profiles\' service', () => {
  it('registered the service', () => {
    const service = app.service('profiles');
    expect(service).toBeTruthy();
  });
});
