// find a particular card by name
const perform = async (z, bundle) => {
  const response = await z.request({
    url: "https://us.api.blizzard.com/hearthstone/cards",
    params: {
      locale: bundle.inputData.locale,
      name: bundle.inputData.name,
    },
  });
  // this should return an array of objects (but only the first will be used)
  return response.data;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#searchschema
  key: "card",
  noun: "Card",

  display: {
    label: "Find Card",
    description: "Finds a card based on name.",
  },

  operation: {
    perform,

    inputFields: [
      {
        key: "name",
        required: true,
        label: "Name of Card",
        helpText: "Find the Card with this name.",
      },
      {
        key: "locale",
        required: false,
        label: "Data Locale",
        helpText: "Return localized data in this locale.",
      },
      {
        key: "class",
        required: true,
        choices: {
          neutral: "Neutral",
          deathknight: "Death Knight",
          demonhunter: "Demon Hunter",
          druid: "Druid",
          hunter: "Hunter",
          mage: "Mage",
          paladin: "Paladin",
          priest: "Priest",
          rogue: "Rogue",
          shaman: "Shaman",
          warlock: "Warlock",
          warrior: "Warrior",
        },
        helpText: "Search for cards in the specified class.",
      },
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      id: 1,
      name: "Test",
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      // these are placeholders to match the example `perform` above
      // {key: 'id', label: 'Person ID'},
      // {key: 'name', label: 'Person Name'}
    ],
  },
};
