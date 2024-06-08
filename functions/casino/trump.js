class trump_card {
  suit;
  number;
  constructor(suit, number) {
    this.suit = suit;
    this.number = number;
  }
}

const suits = ["spades", "hearts", "diamonds", "clubs"];

const new_trump_deck = () => {
  const deck = new Array();
  for (let s = 0; s < 4; s++) {
    for (let n = 1; n <= 13; n++) {
      deck.push(new trump_card(suits[s], n));
    }
  }
  return deck;
};

const shuffle_trumps = (deck) => {
  if (!Array.isArray(deck)) {
    return null;
  }
  const shuffled = new Array();
  const deck_num = deck.length;
  for (let i = 0; i < deck_num; i++) {
    shuffled.push(deck.splice(Math.floor(Math.random() * deck.length), 1)[0]);
  }
  return shuffled;
};

const load_card = (json_object) => {
  return new trump_card(json_object.suit, json_object.number);
};

const load_deck = (json_object) => {
  const deck = new Array();
  json_object.forEach((element) => {
    deck.push(new trump_card(element.suit, element.number));
  });
  return deck;
};

module.exports = {
  trump_card,
  suits,
  new_trump_deck,
  shuffle_trumps,
  load_card,
  load_deck,
};
