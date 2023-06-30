const zapier = require("zapier-platform-core");
const nock = require("nock");

// Use this to make test calls into your app:
const App = require("../../index");
const appTester = zapier.createAppTester(App);

const { HEARTHSTONE_API_URL } = require("../../constants");

const murlocFixture = require("../fixtures/textFilterMurlocManaCost8.json");

// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe("searches.card", () => {
  it("should run", async () => {
    const bundle = {
      inputData: { textFilter: "Murloc", locale: "en_US", class: "neutral", manaCost: 8 },
    };

    nock(HEARTHSTONE_API_URL)
      .get("/cards")
      .query(bundle.inputData)
      .reply(200, murlocFixture);

    const results = await appTester(
      App.searches.card.operation.perform,
      bundle
    );
    expect(results).toBeDefined();
    expect(results.id).toBe(1);
  });
});
