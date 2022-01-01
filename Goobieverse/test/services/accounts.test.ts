import app from '../../src/app';

describe('\'accounts\' service', () => {
  it('registered the service', () => {
    const service = app.service('accounts');
    expect(service).toBeTruthy();
  });
});
