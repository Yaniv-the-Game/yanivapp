import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { customAlphabet } from 'nanoid'
import Router from 'next/router'
import { CSSTransition } from 'react-transition-group'
import createPersistedState from 'use-persisted-state';
import { useMultiplayer } from '../hooks/multiplayer'
import { useYaniv, deck, shuffle } from '../hooks/yaniv'
import Players from '../components/players'
import Hand from '../components/hand'
import Table from '../components/table'
import PlayButton from '../components/play-button'

const useProfileState = createPersistedState('profile');

const generateGameId = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 3)
const generateProfileId = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 4)

export default function IndexPage({ initialGameId, baseUri, eventsUri }) {
  const [profile, setProfile] = useProfileState({
    id: generateProfileId(),
    name: 'Muesli',
    avatar: 'muesli',
  });

  const [gameId, setGameId] = useState(initialGameId)

  useEffect(() => {
    // update the URL if setGameId is used to switch to another game
    Router.replace('/index', `/?game=${gameId}`, { shallow: true })
  }, [gameId])

  const {
    hands,
    pile,
    stack,
    setUp,
    turnUp,
    discardAndDraw,
  } = useYaniv()

  const {
    connected,
    playing,
    profiles,
    currentProfileId,
    start,
    play,
  } = useMultiplayer({
    eventsUri,
    gameId: gameId,
    me: profile,
    setUp,
    turnUp,
    discardAndDraw,
  })

  const hand = useMemo(() => {
    return hands[profile.id]
  }, [hands, profile])

  const onStart = useCallback(() => {
    // shuffle a complete deck and use it as our stack
    let stack = shuffle(deck)

    // splice five cards per player from the top of the stack
    const hands = profiles.reduce((hands: { [profileId: string]: string[] }, profile: { id: string }) => ({ ...hands, [profile.id]: stack.splice(0, 5) }), {})

    // start the game with the remaining stack and predefined hand cards
    start({ hands, stack })
  }, [start, profiles])

  const [cardsToDiscard, setCardsToDiscard] = useState({})
  const [drawCard, setDrawCard] = useState(null)

  const onToggleCardToDiscard = useCallback((card: string) => {
    setCardsToDiscard(cards => ({ ...cards, [card]: !cards[card] }))
  }, [setCardsToDiscard])

  const onToggleDrawCard = useCallback((card: string | null) => {
    setDrawCard((drawCard) => drawCard !== card ? card : null)
  }, [setDrawCard])

  const onPlay = useCallback(() => {
    const discards = Object.keys(cardsToDiscard)
      .map(card => ({ card, active: cardsToDiscard[card] }))
      .filter(({ active }) => active)
      .map(({ card }) => card)

    play({ discards, draw: drawCard || stack[0]})
    setCardsToDiscard({})
    setDrawCard(null)
  }, [cardsToDiscard, setCardsToDiscard, stack, drawCard, setDrawCard, play, pile])

  return (
    <div className='yaniv'>
      <Head>
        <title>Janiv</title>
      </Head>
      <CSSTransition
        in={!playing}
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <div className='setup'>
          <h1>Yaniv {connected ? 'Online' : 'Offline'}</h1>
          <p>Send your friends this link to join the game:</p>
          <p>
            <a className='gamelink' href={`https://yanivapp.now.sh/${gameId}`}>yanivapp.now.sh/{gameId}</a>
          </p>
          {profiles.map((p) => (
            <li>{p.name} {p.id === profile.id && '<-- that is you'}</li>
          ))}
          <button onClick={onStart}>begin</button>
        </div>
      </CSSTransition>
      <div className='playground'>
        <Players
          profiles={profiles}
          hands={hands}
          currentProfileId={currentProfileId}
          myProfileId={profile.id}
        />
        <div className='handsarea'>
        <Table pile={pile} onToggleDrawCard={onToggleDrawCard} />
        {hand && (
          <Hand
            hand={hand}
            cardsToDiscard={cardsToDiscard}
            onToggleCardToDiscard={onToggleCardToDiscard}
          />
        )}
        <PlayButton onPlay={onPlay} />
        </div>
      </div>
      <style jsx>{`
        .yaniv {
          color: #333;
          max-height: 100vh;
          height: 100%;
        }

        .setup {
          color: white;
          text-align: center;
          background-color: #A9C3A6;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: top 0.3s ease;
        }
        .playground{
          text-align:center;
        }
        .handsarea{

        }
        .setup.exit {
          top: -100%;
        }

        .setup.enter {
          top: -100%;
        }

        .setup .gamelink {
          font-size: 30px;
        }

        .playground {
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  const baseUri = `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
  const eventsUri = process.env.EVENTS_WEBSOCKET_URI || 'ws://localhost:8999/api/events'

  return {
    props: {
      initialGameId: query.game || generateGameId(),
      baseUri,
      eventsUri,
    }
  }
}
