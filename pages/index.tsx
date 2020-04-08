import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { customAlphabet } from 'nanoid'
import Router from 'next/router'
import { CSSTransition } from 'react-transition-group'
import createPersistedState from 'use-persisted-state';
import Card from '../components/card'
import { useMultiplayer } from '../hooks/multiplayer'
import { useYaniv, deck, shuffle } from '../hooks/yaniv'
import Players from '../components/players'
import Hand from '../components/hand'

const useProfileState = createPersistedState('profile');

const generateGameId = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 3)
const generateProfileId = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 4)

export default function IndexPage({ initialGameId, baseUri, eventsUri }) {
  const [profile, setProfile] = useProfileState({
    id: generateProfileId(),
    name: 'Muesli',
    avatar: 'muesli',
  });

  const joinRef = useRef<HTMLInputElement>()
  const nameRef = useRef<HTMLInputElement>()

  const [gameId, setGameId] = useState(initialGameId)

  useEffect(() => {
    Router.replace('/index', `/?game=${gameId}`, { shallow: true })
  }, [gameId])

  const [myHand, setMyHand] = useState(0)
  const [currentHand, setCurrentHand] = useState(0)

  const {
    hands,
    pile,
    stack,
    setUp,
    turnUp,
    restock,
    discardAndDraw,
  } = useYaniv()

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

  const {
    connected,
    playing,
    profiles,
    start,
  } = useMultiplayer({
    eventsUri,
    gameId: gameId,
    me: profile,
    // hands,
    // pile,
    // stack,
    setUp,
    turnUp,
    // restock,
    // discardAndDraw,
  })

  const hand = useMemo(() => {
    return hands[profiles.findIndex((p) => p.id === profile.id)]
  }, [hands, profiles, profile])

  const onStart = useCallback(() => {
    let stack = shuffle(deck)
    const hands = profiles.map(() => stack.splice(0, 5))
    start({ hands, stack })
  }, [start, profiles])

  return (
    <div className='yaniv'>
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
        <Players hands={hands} currentHand={currentHand} myHand={myHand} />
        {/* <Table />
          <PlayButton onPlay={onPlay} />
        */}
        {hand && (
          <Hand hand={hand} />
        )}
      </div>
      <style jsx>{`
        .yaniv {
          color: #333;
          max-height: 100vh;
          height: 100%;
          overflow: hidden;
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
  const eventsUri = process.env.PUSHPIN_REALM_URI || 'ws://localhost:8999/api/events'

  return {
    props: {
      initialGameId: query.game || generateGameId(),
      baseUri,
      eventsUri,
    }
  }
}
