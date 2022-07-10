import type { Component } from 'solid-js';
import { ICard } from '../../types';

import styles from './styles.module.css';

export const Card: Component<{ card: ICard, fullWidth?: boolean, onDrop?: (e: DragEvent) => void }> = ({ card, fullWidth, onDrop }) => {
  return (
    <div onDrop={onDrop} class={styles.cardContainer + ` ${fullWidth && styles.fullWidth}`} >
      <img src={card.image} />
    </div>
  )
}
