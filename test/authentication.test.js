/* globals describe, it, expect */

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('session auth app', () => {
  it('has an exchange for clientId/clientSecret', async () => {
    const bundle = {
      authData: {
        clientId: 'myId',
        clientSecret: 'superSecret',
      },
    };

    const newAuthData = await appTester(
      App.authentication.sessionConfig.perform,
      bundle
    );

    expect(newAuthData.sessionKey).toBe('abc123');
  });

  it('has auth details added to every request', async () => {
    const bundle = {
      authData: {
        sessionKey: 'abc123',
      },
    };

    const response = await appTester(App.authentication.test, bundle);

    expect(response.status).toBe(200);
    expect(response.request.headers['Authorization']).toBe('Bearer abc123');
  });
});

