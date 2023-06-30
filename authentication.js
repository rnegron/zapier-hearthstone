"use strict";

const { BATTLE_NET_OAUTH_URL, HEARTHSTONE_API_URL } = require("./constants");

const AUTHENTICATION_URL = `${BATTLE_NET_OAUTH_URL}/token`;

const test = async (z, bundle) => {
  const response = await z.request({
    url: `${HEARTHSTONE_API_URL}/metadata/classes`,
    params: { locale: "en_US" },
  });

  return response;
};

const getSessionKey = async (z, bundle) => {
  const encodedCredentials = Buffer.from(
    `${bundle.authData.clientId}:${bundle.authData.clientSecret}`,
    "utf8"
  );
  const body = { grant_type: "client_credentials" };

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + encodedCredentials.toString("base64"),
  };

  // Blizzard's OAuth API fails if you send an existing sessionKey when authenticating
  if (bundle.authData && bundle.authData.sessionKey) {
    delete bundle.authData.sessionKey;
  }

  const response = await z.request({
    url: AUTHENTICATION_URL,
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
