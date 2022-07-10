
import { images } from '../assets'
import { CardNames, Suits, ICard } from '../types'

function createCard(name: CardNames, suit: Suits): ICard {
  return {
    name,
    suit,
    image: images[name][suit]
  }
}


export function generateCards(): ICard[] {
  const cards = []
  for (const name in CardNames) {
    for (const suit in Suits) {
      cards.push(createCard(CardNames[name as keyof typeof CardNames], Suits[suit as keyof typeof Suits]))
    }
  }

  return cards
}

export const cardsStrengths = {
  [CardNames.SIX]: 0,
  [CardNames.SEVEN]: 1,
  [CardNames.EIGHT]: 2,
  [CardNames.NINE]: 3,
  [CardNames.TEN]: 4,
  [CardNames.JACK]: 5,
  [CardNames.QUEEN]: 6,
  [CardNames.KING]: 7,
  [CardNames.ACE]: 8,
}

export const trumpStrengthBonus = Object.keys(cardsStrengths).length

export const dealCards = (cards: ICard[], playersNumber: number) => {
  const playersCards: { [key: number]: ICard[] } = {};

  const restCards = [...cards]

  let nextPlayer = 0
  let trump: Suits = Suits.HEARTS

  while (restCards.length) {
    if (!playersCards[nextPlayer]) {
      playersCards[nextPlayer] = []
    }
    const currentPlayerCards = playersCards[nextPlayer]
    const randomIndex = Math.floor(Math.random() * restCards.length)
    const card = restCards[randomIndex]
    currentPlayerCards.push(card)
    restCards.splice(randomIndex, 1)
    if (!restCards.length) {
      trump = card.suit
    }

    playersNumber - 1 > nextPlayer ? nextPlayer += 1 : nextPlayer = 0
  }

  return {
    playersCards,
    trump
  }
}

const isTrump = (card: ICard, trump: Suits) => card.suit === trump

const getCardStrength = (card: ICard, trump: Suits) => cardsStrengths[card.name] + (isTrump(card, trump) ? trumpStrengthBonus : 0)

export const canBeat = (defenceCard: ICard, attackCard: ICard, trump: Suits) => {
  console.log(!isTrump(defenceCard, trump) && defenceCard.suit !== attackCard.suit);
  
  if (!isTrump(defenceCard, trump) && defenceCard.suit !== attackCard.suit) {
    return false
  }

  const defenceStrength = getCardStrength(defenceCard, trump)
  const attackStrength = getCardStrength(attackCard, trump)

  return defenceStrength > attackStrength
}