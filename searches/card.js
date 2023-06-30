const { HEARTHSTONE_API_URL } = require("../constants");

// find a particular card by name
const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${HEARTHSTONE_API_URL}/cards`,
    params: {
      locale: bundle.inputData.locale,
      class: bundle.inputData.class,
      textFilter: bundle.inputData.textFilter,
    },
  });
  // this should return an array of objects (but only the first will be used)
  return response.data.cards;
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
        key: "textFilter",
        required: true,
        label: "Text Filter for the Card",
        helpText: "Find the Card that contains this text somewhere in its content.",
      },
      {
        key: "locale",
        required: false,
        default: "en_US",
        choices: {
          de_DE: "German",
          en_US: "American English",
          es_ES: "Spanish",
          es_MX: "Spanish (Mexico)",
          fr_FR: "French",
          it_IT: "Italian",
          ja_JP: "Japanese",
          ko_KR: "Korean",
          pl_PL: "Polish",
          pt_BR: "Portuguese (Brazil)",
          ru_RU: "Russian",
          th_TH: "Thai",
          zh_TW: "Chinese (Taiwan)",
        },
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

    sample: {
      id: 63374,
      collectible: 1,
      slug: "63374-whetstone-hatchet",
      classId: 10,
      cardTypeId: 7,
      cardSetId: 1525,
      rarityId: 3,
      artistName: "Luca Zontini",
      attack: 1,
      manaCost: 1,
      durability: 4,
      name: "Whetstone Hatchet",
      text: "After your hero attacks, give a minion in your hand +1 Attack.",
      image:
        "https://d15f34w2p8l1cc.cloudfront.net/hearthstone/f9a83190455369908595cf241b225a406a606d0e8cf44077ea05faf28f1b2cd3.png",
      imageGold: "",
      flavorText: "A bad hatchet can make a good spear better.",
      cropImage:
        "https://d15f34w2p8l1cc.cloudfront.net/hearthstone/a416d77346ef1181de8af841a6dbb9c1bc7c2a16947504c0be6685d91881b785.png",
      parentId: 63374,
    },

    outputFields: [
      {key: "id", "label": "Unique ID for Card"},
      {key: "collectible", "label": "Whether the Card is collectible or not"},
      {key: "slug", "label": "The slug for the Card"},
      {key: "classId", "label": "The ID of the class the Card belongs to"},
      {key: "cardTypeId", "label": "The ID of the type of Card"},
      {key: "cardSetId", "label": "The ID of the set the Card belongs to"},
      {key: "rarityId", "label": "The ID of the rarity of the Card"},
      {key: "artistName", "label": "The name of the artist who drew the Card illustration"},
      {key: "attack", "label": "The attack value of the Card"},
      {key: "manaCost", "label": "The mana cost of the Card"},
      {key: "durability", "label": "The durability of the Card"},
      {key: "name", "label": "The name of the Card"},
      {key: "text",  "label": "The text of the Card that describes its effects"},
      {key: "image", "label": "The URL for the Card's main image"},
      {key: "imageGold", "label": "The URL for the Card's golden image"},
      {key: "flavorText", "label": "The flavor text of the Card"},
      {key: "cropImage", "label": "The URL for the Card's cropped image"},
      {key: "parentId", "label": "The ID of the parent Card, if it has one"},
    ],
  },
};
