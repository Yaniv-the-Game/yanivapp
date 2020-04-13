import { useState, useCallback } from 'react'

export const deck = ['CX', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'CA', 'CJ', 'CK', 'CQ', 'HX', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'HA', 'HJ', 'HK', 'HQ', 'J1', 'J2', 'PX', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'PA', 'PJ', 'PK', 'PQ', 'TX', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'TA', 'TJ', 'TK', 'TQ']

/**
 * parse the two letter card code into a more verbose
 * representation, including the game value of that card
 *
 * @param card two letter card code to be inspected
 */
export function inspect(card: string) {
  const suit = card[0]

  if (suit === 'J') {
    // it's a joker!
    return {
      card,
      suit: null,
      rank: '0',
      value: 0,
    };
  }

  const rank = card.substr(1) // ex. C for clover
  const value = rank === 'A' ? 1 : parseInt(rank, 10) || 10 //

  return {
    card,
    suit,
    rank,
    value,
  }
}

const order = '0123456789XJQK'
const orderMap = order.split('').reduce((m, v, i) => ({ ...m, [v]: i }), {})

/**
 * order a set of cards according to their rank,
 * needed when discarding multiple consecutive cards
 * at once
 *
 * @param cards set of two letter codes of card codes to be ordered
 */
export function orderCards(cards: string[]) {
  const infos = cards.map(inspect)
  return infos.sort((a, b) => orderMap[a.rank] - orderMap[b.rank]).map(i => i.card)
}

/**
 * check if a set of cards meets the criteria to be discarded
 * at once
 *
 * @param discards set of two letter codes of cards to be discarded
 */
export function checkDiscards(discards: string[]) {
  if (orderCards.length < 1) {
    // at least one card must be discarded
    return false
  }

  if (discards.length === 1) {
    // one card can always be discarded
    return true
  }

  const infos = discards.map(inspect)
  const allSameRank = infos.every((info, i, infos) => info.rank === infos[0].rank)
  const allSameSuit = infos.every((info, i, infos) => info.suit === infos[0].suit)
  const orderedInfos = infos.sort((a, b) => orderMap[a.rank] - orderMap[b.rank])
  const consecutive = order.indexOf(orderedInfos.map(i => i.rank).join('')) >= 0

  return allSameRank || (allSameSuit && consecutive && discards.length >= 3)
}

/**
 * randomly shuffle any set of values in an array
 *
 * @param values set of any values
 */
export function shuffle<T>(values: T[]): T[] {
  const array = [...values]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

/**
 * React hook that manages the complex state of one Yanif game
 * exposing simple functions that represent game actions
 * and modify the state of the game in a consistent way,
 * keeping track of cards on hand, the stack and pile of discarded cards
 */
export function useYaniv() {
  const [hands, setHands] = useState<{ [handId: string]: string[]}>({})
  const [stack, setStack] = useState<string[]>([])
  const [pile, setPile] = useState<string[][]>([])

  /**
   * set up the game by providing the hands and stack cards
   */
  const setUp = useCallback((hands: { [handId: string]: string[]}, stack: string[]) => {
    setHands(hands)
    // setStack(stack)
    // setPile([])
    setPile([[stack[0]], ...pile])
    setStack(stack.slice(1))
  }, [setHands, setStack])

  /**
   * turn up the first card from the stack onto the pile
   */
  const turnUp = useCallback(() => {
    if (!stack[0]) {
      // do nothing if stack is empty
      return
    }

    setPile([[stack[0]], ...pile])
    setStack(stack.slice(1))
  }, [stack, pile, setPile])

  /**
   * reshuffle old pile of cards (except for the cards from the last turn)
   * and restock the stack from behind
   */
  const restock = useCallback(() => {
    if (pile.length <= 1) {
      // do nothing if pile is not high enough
      return
    }

    const discardedCards = pile.slice(1).reduce((all, turn) => [...all, ...turn], [])
    setPile([pile[0]])

    const shuffledDiscardedCards = shuffle(discardedCards)
    setStack([...stack, ...shuffledDiscardedCards])
  }, [pile, setPile, stack, setStack])

  /**
   * discard at least one card and draw one either from
   * stack or the discard pile
   */
  const discardAndDraw = useCallback((handId: string, discards: string[], draw: string) => {
    const hand = hands[handId]
    if (!discards.every((discard => hand.indexOf(discard) >= 0))) {
      throw new Error('cannot discard cards that are not on hand')
    }

    if (!checkDiscards(discards)) {
      throw new Error('cannot discard these cards')
    }

    if (stack[0] === draw) {
      setHands({ ...hands, [handId]: [...hand, draw].filter(card => discards.indexOf(card) < 0) })
      setStack(stack.splice(1))
      const orderedDiscards = orderCards(discards)
      setPile([orderedDiscards, ...pile])
    } else if (pile[0]?.[0] === draw || pile[0]?.[pile[0].length - 1] === draw) {
      setHands({ ...hands, [handId]: [...hand, draw].filter(card => discards.indexOf(card) < 0) })
      const orderedDiscards = orderCards(discards)
      setPile([orderedDiscards, ...pile.map((level, i) => i === 0 ? level.filter(card => card !== draw) : level).filter(level => level.length > 0)])
    } else {
      throw new Error('cannot draw card that is neither on top of stack nor on pile')
    }
  }, [hands, pile, setPile, stack, setStack])

  return {
    hands,
    pile,
    stack,
    setUp,
    turnUp,
    // restock,
    discardAndDraw,
  }
}
