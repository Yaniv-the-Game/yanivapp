import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { customAlphabet } from 'nanoid'
import Router from 'next/router'
import { CSSTransition } from 'react-transition-group'
import createPersistedState from 'use-persisted-state';
import { useMultiplayer } from '../hooks/multiplayer'
import { useYaniv, deck, shuffle, inspect } from '../hooks/yaniv'
import Players from '../components/players'
import Avatar from '../components/avatar'
import Hand from '../components/hand'
import Table from '../components/table'
import PlayButton from '../components/play-button'
import EditProfile from '../components/edit-profile'


const useProfileState = createPersistedState('profile');

const generateGameId = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 3)
const generateProfileId = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 4)

export default function IndexPage({ initialGameId, baseUri, eventsUri }) {
  const [profile, setProfile] = useProfileState({
    id: generateProfileId(),
    name: 'Name',
    avatar: 'avocado',
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
    currentDealerId,
    scores,
    lastMove,
    start,
    play,
    yaniv,
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
  const [drawCard, setDrawCard] = useState(null) // null means draw from stack

  const onToggleCardToDiscard = useCallback((card: string) => {
    setCardsToDiscard(cards => ({ ...cards, [card]: !cards[card] }))
  }, [setCardsToDiscard])

  const onToggleDrawCard = useCallback((card: string | null) => {
    setDrawCard((drawCard) => drawCard !== card ? card : null)
  }, [setDrawCard])

  const onPlay = useCallback(() => {
    // get an array of cards to discard from the cardsToDiscard map
    const discards = Object.keys(cardsToDiscard)
      .map(card => ({ card, active: cardsToDiscard[card] }))
      .filter(({ active }) => active)
      .map(({ card }) => card)

    play({ discards, draw: drawCard || stack[0]})
    setCardsToDiscard({})
    setDrawCard(null)

  }, [cardsToDiscard, setCardsToDiscard, stack, drawCard, setDrawCard, play, pile])

  const [myTurn, setMyTurn] = useState(false);

   // TODO call onYaniv() to signal Yaniv!
  const onYaniv = useCallback(() => {
    console.log("Yaniv!")
    yaniv()
  }, [yaniv])

// TODO callculate current score for this user at hand
const score = useMemo(() => {
  if(!hand){return null}
  return  hand.map(card => inspect(card).value).reduce((total, value)=>total+value,0);
},[hand])

  return (
    <div className='yaniv'>
      <Head>
        <title>yaniv!</title>
      </Head>
      <CSSTransition
        in={!playing}
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <div className='setup'>
        <img src='/img/header.png' alt="Yaniv" height="148px" width="250px" />
          <h1>The Worlds greatest game {connected ? 'Online' : 'Offline'}</h1>
          <p>Send your friends this link to join the game:</p>
          <div className="share">
            <a className='gamelink' href={`https://yanivapp.now.sh/?game=${gameId}`}>yanivapp.now.sh/?game={gameId}</a>
            <div className="Whatsapp">
              <a className='whatsapplink' href={`https://wa.me/?text=Let%27s%20play%20yaniv%21%20Join%20on%20https%3A%2F%2Fyanivapp.now.sh/?game=${gameId}`}>
                <img src='/img/whatsapp.png' className="whatsappimage" alt="Share on Whatsapp" height="25px" width="25px" />
                <span>Share on WhatsApp</span>
              </a>
            </div>
          </div>
          <div className='onlinePlayers'>
          <h2>Players</h2>
          {profiles.map((p) => (
            <li key={p.id}>
              <Avatar name={p.avatar} mood={'good'} size={30} />
             {p.name} {p.id === profile.id && '(you)'}
             </li>
          ))}
          </div>
          <button onClick={onStart}>begin</button>
          <EditProfile
            profile={profile}
            onChange={(profile) => setProfile(profile)}
          />
        </div>
      </CSSTransition>
      <CSSTransition
        in={playing}
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
      <div className='playground'>
        <Players
          profiles={profiles}
          hands={hands}
          myTurn={currentProfileId === profile.id}
          myProfileId={profile.id}
          currentProfileId={currentProfileId}
        />
        <div className='handsarea'>
        <Table
          pile={pile}
          drawCard={drawCard}
          onToggleDrawCard={onToggleDrawCard}
          myTurn={currentProfileId === profile.id}
        />
        {hand && (
          <Hand
            hand={hand}
            cardsToDiscard={cardsToDiscard}
            onToggleCardToDiscard={onToggleCardToDiscard}
            myTurn={currentProfileId === profile.id}
            lastMove={lastMove}
          />
        )}
        <PlayButton onPlay={onPlay} onYaniv={onYaniv} score={score} cardsToDiscard={cardsToDiscard} myTurn={currentProfileId === profile.id} />
        </div>
      </div>
      </CSSTransition>
      <style jsx>{`
        .yaniv {
          color: #333;
          max-height: 100vh;
          height: 100%;
        }

        .whatsappimage{
          vertical-align:middle;
        }

        h1{
          font-size:24px;
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
          overflow: scroll;
          padding-top:30px;
        }
        .playground{
          text-align:center;
        }
        .share{
          font-size:16px;
        }
        .setup.exit {
          top: -100%;
        }

        .setup.enter {
          top: -100%;
        }

        .setup .gamelink {
          font-size: 24px;
        }
        .onlinePlayers > li{
          list-style:none;
          height:45px;
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
