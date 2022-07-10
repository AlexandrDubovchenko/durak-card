import { Component, createEffect, createMemo, createSignal, For, Match, Switch } from 'solid-js';

import styles from './App.module.css';
import { Card } from './components/Card';
import { canBeat, dealCards, generateCards } from './game';
import { ICard, IMoveState } from './types';

const cards = generateCards();
const gameState = dealCards(cards, 2);

const App: Component = () => {
  const [playersCards, setPlayersCards] = createSignal(gameState.playersCards)

  const [moves, setMoves] = createSignal<IMoveState[]>([])
  const [playerMove, setPlayerMove] = createSignal(0)
  const [attacker, setAttacker] = createSignal(0)
  const [activeDragCard, setActiveDragCard] = createSignal<ICard>()
  const canSucceedDefence = createMemo(() => (
    attacker() === playerMove() && moves().length && !moves().some(el => !el.cardDefence)
  ))
  const canTake = createMemo(() => attacker() !== playerMove() && moves().some(el => !el.cardDefence))
  const canComplete = createMemo(() => (
    attacker() === playerMove() ? moves().some(el => !el.cardDefence) : !moves().some(el => !el.cardDefence)
  ))

  const winner = createMemo(() => {
    if (moves().length) {
      return
    }
    return Object.entries(playersCards()).find(el => !el[1].length)?.[0]
  })

  const removePlayersCard = (removeCard: ICard, playerId: number) => {
    setPlayersCards((prev) => {
      return {
        ...prev, [playerId]:
          prev[playerId].filter(card => card.name + card.suit !== removeCard.name + removeCard.suit)
      }
    })
  }

  const canThrowInCard = (card: ICard) => {
    if (!moves().length) {
      return true
    }

    return moves().some(el => el.cardAttack.name === card.name || el.cardDefence?.name === card.name)
  }

  const onPlaygroundDrop = (e: DragEvent) => {
    const playerId = e.dataTransfer?.getData('text/plain')
    if (playerId !== playerMove().toString() || playerId !== attacker().toString()) {
      e.preventDefault()
      return
    }
    const activeCard = activeDragCard()

    if (activeCard && canThrowInCard(activeCard)) {
      setMoves((prev) => [...prev, {
        cardAttack: activeCard,
      }])
      removePlayersCard(activeCard, playerMove())
    }
  }

  const onCardDrop = (card: ICard) => (e: DragEvent) => {
    const playerId = e.dataTransfer?.getData('text/plain')

    if (playerId !== playerMove().toString() || playerId === attacker().toString()) {
      e.preventDefault()
      return
    }
    e.stopPropagation()
    const activeCard = activeDragCard()
    const currentMoveIndex = moves().findIndex(move => move.cardAttack.name + move.cardAttack.suit === card.name + card.suit)

    if (
      activeCard
      && !moves()[currentMoveIndex].cardDefence
      && canBeat(activeCard, moves()[currentMoveIndex].cardAttack, gameState.trump)) {
      setMoves((prev) => {
        const state = [...prev]
        state[currentMoveIndex] = { ...state[currentMoveIndex], cardDefence: activeCard }
        return state
      })
      removePlayersCard(activeCard, playerMove())
    }
  }

  const onDragStart = (card: ICard, playerId: number) => (e: DragEvent) => {
    setActiveDragCard(card)
    e.dataTransfer?.setData('text/plain', `${playerId}`)
  }

  const onComplete = () => {
    setPlayerMove(prev => !prev ? 1 : 0)
  }

  const onSuccessfullDefence = () => {
    setAttacker(prev => !prev ? 1 : 0)
    setMoves([])
    setPlayerMove(attacker())
  }

  const onTake = () => {
    const newCards = moves().reduce<ICard[]>((acc, el) => {
      acc.push(el.cardAttack)
      if (el.cardDefence) {
        acc.push(el.cardDefence)
      }
      return acc
    }, [])

    setPlayersCards(prev => ({
      ...prev, [playerMove()]: [...prev[playerMove()], ...newCards]
    }))

    setMoves([])
    setPlayerMove(attacker())
  }

  return (
    <div class={styles.field}>
      {winner() && <p>Winner is {winner()}</p>}
      <p>Trump is {gameState.trump}</p>
      <div class={styles.cardSet}>
        <For each={playersCards()[0]}>
          {card => <div draggable onDragStart={onDragStart(card, - 0)}>
            <Card card={card} />
          </div>}
        </For>
      </div>
      <div onDrop={onPlaygroundDrop} onDragOver={e => e.preventDefault()} class={styles.playground}>
        <For each={moves()}>
          {(move) => <div class={styles.move}>
            <div>
              <Card onDrop={onCardDrop(move.cardAttack)} fullWidth card={move.cardAttack} />
            </div>
            {move.cardDefence && <div class={styles.cardDefence}>
              <Card onDrop={onCardDrop(move.cardAttack)} fullWidth card={move.cardDefence} />
            </div>}
          </div>}
        </For>
        <div class={styles.controls}>
          <Switch>
            <Match when={canComplete()}>
              <button onClick={onComplete}>
                Complete
              </button>
            </Match>
            <Match when={canSucceedDefence()}>
              <button onClick={onSuccessfullDefence}>
                Successfull Defence
              </button>
            </Match>
            <Match when={canTake()}>
              <button onClick={onTake}>
                Take
              </button>
            </Match>
          </Switch>
        </div>
      </div >
      <div class={styles.cardSet}>
        <For each={playersCards()[1]}>
          {(card) => <div draggable onDragStart={onDragStart(card, 1)}>
            <Card card={card} />
          </div>}
        </For>
      </div>
    </div >
  );
};

export default App;
