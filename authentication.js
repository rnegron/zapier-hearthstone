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
      { key: "clientId", label: "Client ID", required: true, helpText: 'Visit https://develop.battle.net/documentation/guides/using-oauth/client-credentials-flow to learn more about how to obtain these values.' },
      {
        key: "clientSecret",
        label: "Client Secret",
        required: true,
        type: "password",
      },
    ],
    test,
    connectionLabel: (z, bundle) => `Client ID Last 4 Characters: ${bundle.authData.clientId.slice(-4)}`,
  },
  befores: [includeSessionKeyHeader],
  afters: [],
};
