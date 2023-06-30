const zapier = require("zapier-platform-core");
const nock = require("nock");

// Use this to make test calls into your app:
const App = require("../../index");
const appTester = zapier.createAppTester(App);

const { HEARTHSTONE_API_URL } = require("../../constants");

// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe("searches.card", () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  it("should search for cards based on specified filters", async () => {
    const bundle = {
      inputData: {
        textFilter: "Murloc",
        locale: "en_US",
        class: "neutral",
        manaCost: 8,
        health: "",
        attack: "",
        collectible: true,
        rarity: "",
        minionType: "",
        type: "",
      },
    };

    nock(HEARTHSTONE_API_URL)
      .get("/cards")
      .query({
        ...bundle.inputData,
        collectible: 1,
      })
      .replyWithFile(
        200,
        __dirname + "/fixtures/textFilterMurlocManaCost8.json",
        {
          "Content-Type": "application/json",
        }
      );

    const results = await appTester(
      App.searches.card.operation.perform,
      bundle
    );
    expect(results[0].id).toBe(63398);
    expect(results[0].name).toBe("Mutanus the Devourer");
  });
});
