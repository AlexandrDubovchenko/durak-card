export enum Suits {
  HEARTS = 'hearts',
  CLUBS = 'clubs',
  DIAMONDS = 'diamonds',
  SPADES = 'spades'
}

export enum CardNames {
  SIX = 'Six',
  SEVEN = 'Seven',
  EIGHT = 'Eight',
  NINE = 'Nine',
  TEN = 'Ten',
  JACK = 'Jack',
  QUEEN = 'Queen',
  KING = 'King',
  ACE = 'Ace'
}

export type CardImages = {
  [key in Suits]: string
}

export interface ICard {
  name: CardNames,
  suit: Suits,
  image: string
}

export interface IMoveState {
  cardAttack: ICard;
  cardDefence?: ICard
}