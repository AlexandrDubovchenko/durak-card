import { images as Six } from './6'
import { images as Seven } from './7'
import { images as Eight } from './8'
import { images as Nine } from './9'
import { images as Ten } from './10'
import { images as Jack } from './Jack'
import { images as Queen } from './Queen'
import { images as King } from './King'
import { images as Ace } from './Ace'
import { CardImages, CardNames } from '../types'

export const images: {
  [key in CardNames]: CardImages
} = {
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King,
  Ace
}
