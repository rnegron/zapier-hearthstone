"use strict";

const test = (z, bundle) =>
  z.request({
    url: "https://us.api.blizzard.com/hearthstone/metadata?locale=en_US",
  });

const getSessionKey = async (z, bundle) => {
  const body = { grant_type: "client_credentials" };

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization:
      "Basic " +
      Buffer.from(
        bundle.authData.clientId + ":" + bundle.authData.clientSecret
      ).toString("base64"),
  };

  const response = await z.request({
    url: "https://oauth.battle.net/token",
    method: "POST",
    headers,
    body,
  });

  return {
    sessionKey: response.data.access_token,
  };
};

// This function runs before every outbound request. You can have as many as you
// need. They'll need to each be registered in your index.js file.
const includeSessionKeyHeader = (request, z, bundle) => {
  if (bundle.authData.sessionKey) {
    request.headers = request.headers || {};
    request.headers["Authorization"] = `Bearer ${bundle.authData.sessionKey}`;
  }

  return request;
};

module.exports = {
  config: {
    // "session" auth exchanges user data for a different session token (that may be
    // periodically refreshed")
    type: "session",
    sessionConfig: { perform: getSessionKey },

    fields: [
      { key: "clientId", label: "Client ID", required: true },
      {
        key: "clientSecret",
        label: "Client Secret",
        required: true,
        type: "password",
      },
    ],

    // The test method allows Zapier to verify that the credentials a user provides
    // are valid. We'll execute this method whenever a user connects their account for
    // the first time.
    test,

    // This template string can access all the data returned from the auth test. If
    // you return the test object, you'll access the returned data with a label like
    // `{{json.X}}`. If you return `response.data` from your test, then your label can
    // be `{{X}}`. This can also be a function that returns a label. That function has
    // the standard args `(z, bundle)` and data returned from the test can be accessed
    // in `bundle.inputData.X`.
    connectionLabel: (z, bundle) => bundle.authData.clientId,
  },
  befores: [includeSessionKeyHeader],
  afters: [],
};
