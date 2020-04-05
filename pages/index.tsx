import React, { useState, useRef, useEffect, useCallback } from 'react'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Router, { useRouter } from 'next/router'
import Card from '../components/card'
import { useMultiplayer } from '../hooks/multiplayer'
import { useYaniv, deck, shuffle } from '../hooks/yaniv'

export default function IndexPage({ baseUri, eventsUri }) {
  const joinRef = useRef<HTMLInputElement>()
  const nameRef = useRef<HTMLInputElement>()

  const { query: { game } } = useRouter()

  const {
    hands,
    pile,
    stack,
    setUp,
    turnUp,
    restock,
    discardAndDraw,
  } = useYaniv()

  const onSetUp = useCallback(() => {
    let stack = shuffle(deck)
    const hands = Array.from({ length: 4 }, x => stack.splice(0, 5))
    console.log(hands)

    setUp(hands, stack)
  }, [setUp])

  const [discardCardsMap, setDiscardCardsMap] = useState<{ [card: string]: boolean }>({})
  const [drawCard, setDrawCard] = useState(null)

  const onPlay = useCallback((hand: number) => {
    const discardCards = Object.keys(discardCardsMap)
      .map(card => ({ card, active: discardCardsMap[card] }))
      .filter(({ card, active }) => active)
      .map(({ card }) => card)
    discardAndDraw(hand, discardCards, drawCard)
    setDiscardCardsMap({})
    setDrawCard(null)
  }, [discardAndDraw, discardCardsMap, drawCard, setDiscardCardsMap, setDrawCard])

  const [currentCard, setCurrentCard] = useState('J1')

  const [name, setName] = useState('bunny')
  const { connected, gameId, counter, increment } = useMultiplayer({
    eventsUri,
    gameId: game?.toString(),
    name,
  })

  // useEffect(() => {
  //   Router.replace('/index', `/?game=${gameId}`, { shallow: true })
  // }, [gameId])

  const onJoin = useCallback(() => {
    if (joinRef.current) {
      Router.replace('/index', `/?game=${joinRef.current.value}`, { shallow: true })
    }
  }, [joinRef])

  const onRename = useCallback(() => {
    if (nameRef.current) {
      setName(nameRef.current.value)
    }
  }, [nameRef, setName])

  return (
    <div className='index'>
      <h1>Hello Yaniv</h1>

      <h2>All about the magic game</h2>

      <p>
        <button onClick={onSetUp}>set up game for 4 players</button>
      </p>
      <p>
        <button onClick={turnUp}>turn up first card</button>
      </p>
      <p>

      </p>
      <p>
        <button onClick={restock}>restock stack from old discard pile</button>
      </p>

      <dl>
        {hands.map((hand, i) => (
          <>
            <dt>Hand {i + 1}</dt>
            <dd>
              {hand.map(card => (
                <button
                  key={card}
                  type="button"
                  onClick={() => setDiscardCardsMap({ ...discardCardsMap, [card]: !discardCardsMap[card] })}
                  className={discardCardsMap[card] && 'active'}
                >
                  {card}
                </button>
              ))}
              <button type="button" onClick={() => onPlay(i)}>Play</button>
            </dd>
          </>
        ))}
        <dt>Stack</dt>
        <dd>
          {stack.map(card => (
            <button
              key={card}
              type="button"
              onClick={() => setDrawCard(card)}
              className={drawCard === card && 'active'}
            >
              {card}
            </button>
          ))}
        </dd>
        {pile.map((level, i) => (
          <>
            <dt>Pile Level {i + 1}</dt>
            <dd>
              {level.map(card => (
                <button
                  key={card}
                  type="button"
                  onClick={() => setDrawCard(card)}
                  className={drawCard === card && 'active'}
                >
                  {card}
                </button>
              ))}
            </dd>
          </>
        ))}
      </dl>

      <h2>All about the multiplayer magic</h2>

      <p>{connected ? 'Connected' : 'Not connected'} to {eventsUri}...</p>
      <p>Your game <input ref={joinRef} type="text" defaultValue="u3hr3" /> <button onClick={onJoin}>join</button></p>
      <p>Share {baseUri}/{game} for others to join.</p>
      <p>You are <input ref={nameRef} type="text" defaultValue={name} /> <button onClick={onRename}>change</button></p>
      <p>Counter is {counter}</p>
      <p><button onClick={increment}>Increment counter here</button></p>

      <h2>Check out these cool cards</h2>

      <p>
        {deck.map(card => (
          <button type="button" onClick={() => setCurrentCard(card)}>{card}</button>
        ))}
      </p>

      <Card type={currentCard} />

      <style jsx>{`
        .index {
          color: #333;
        }

        button.active {
          color: mediumblue;
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const baseUri = `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
  const eventsUri = process.env.PUSHPIN_REALM_URI || 'ws://localhost:8999/api/events'

  return {
    props: {
      baseUri,
      eventsUri,
    }
  }
}
