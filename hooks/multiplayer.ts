import { useCallback, useEffect, useState, useMemo } from 'react'
import { valueCards } from './yaniv'
import useWebSocket from './websocket'

export type LastMove = {
  type: 'turnUp',
  profileId: string,
  card: string,
} | {
  type: 'discardAndDraw',
  profileId: string,
  discards: string[],
  draw: string,
} | {
  type: 'yaniv',
  profileId: string,
}

export function useMultiplayer({
  eventsUri,
  gameId,
  me,
  restore,
  setUp,
  turnUp,
  discardAndDraw,
  hands,
  stack,
  pile,
}: {
  eventsUri: string,
  gameId: string | null,
  me: {
    id: string,
    name: string,
    avatar: string,
  },
  restore: (hands: { [handId: string]: string[]}, stack: string[], pile: string[][]) => void,
  setUp: (hands: { [profileId: string]: string[] }, stack: string[]) => void,
  turnUp: () => string,
  discardAndDraw: (handId: string, discards: string[], draw: string) => void,
  hands: { [profileId: string]: string[] },
  stack: string[],
  pile: string[][],
}) {
  const [connected, setConnected] = useState(false)
  const [dealerId, setDealerId] = useState(null)
  const [profiles, setProfiles] = useState<{ id: string, name: string, avatar: string }[]>([])
  const [lastMove, setLastMove] = useState<LastMove>(null)
  const [scores, setScores] = useState<{ [profileId: string]: number }[]>([])
  const currentProfileId = useMemo(() => {
    if (profiles.length === 0) {
      return null
    }

    if (!lastMove) {
      return profiles[0].id
    }

    const profileIndex = profiles.findIndex(profile => profile.id === lastMove.profileId)
    if (profileIndex + 1 >= profiles.length) {
      return profiles[0].id
    }

    return profiles[profileIndex + 1].id
  }, [lastMove, profiles])

  const onHello = useCallback(({ profile }, send) => {
    const updatedProfiles = profiles.find(p => p.id === profile.id)
      ? profiles.map(p => p.id === profile.id ? profile : p)
      : [...profiles, profile]

    if (me.id !== profile.id) {
      send({
        type: 'sync',
        gameId,
        profiles: updatedProfiles,
        dealerId,
        scores,
        lastMove,
        hands,
        stack,
        pile,
      })
    }
  }, [me, profiles, dealerId, scores, lastMove, hands, stack, pile])

  const onSync = useCallback(({ profiles, dealerId, scores, lastMove, hands, stack, pile }, send) => {
    setProfiles(profiles)
    setDealerId(dealerId)
    setScores(scores)
    setLastMove(lastMove)
    restore(hands, stack, pile)
  }, [restore])

  const onStart = useCallback(({ profile, hands, stack }, send) => {
    setUp(hands, stack)
    setDealerId(profile.id)
    setLastMove({ profileId: profile.id, type: 'turnUp', card: stack[0] })
  }, [setUp, turnUp, setLastMove])

  const onPlay = useCallback(({ profile, discards, draw }, send) => {
    discardAndDraw(profile.id, discards, draw)
    setLastMove({ profileId: profile.id, type: 'discardAndDraw', discards, draw })
  }, [discardAndDraw])

  const onYaniv = useCallback(({ profile }, send) => {
    const values = Object.entries(hands).reduce<{ [profileId: string]: number }>((values, [profileId, hand]) => ({
      ...values,
      [profileId]: valueCards(hand),
    }), {})

    const lowestOtherValue = Object.entries(values)
      .filter(([profileId]) => profileId !== profile.id)
      .map(([, value]) => value)
      .reduce<number>((lowest, value) => value < lowest ? value : lowest, Infinity)

    if (values[profile.id] < lowestOtherValue) {
      // it's a valid Yaniv, so we write zero points for the winner
      values[profile.id] = 0
    } else {
      // it's an invalid Yaniv, so we punish caller with +25 points
      values[profile.id] += 25
    }

    const previousScores = scores.length > 0 ? scores[scores.length - 1] : {}
    const newScores = profiles.reduce<{ [profileId: string]: number }>((scores, profile) => ({
      ...scores,
      [profile.id]: (previousScores[profile.id] || 0) + (values[profile.id] || 0),
    }), {})

    // TODO: apply halvings / resets

    setLastMove({ profileId: profile.id, type: 'yaniv' })
    setScores(scores => [...scores, newScores])

    // TODO: do not let dropped out profiles deal anymore
    const dealerIndex = profiles.findIndex(profile => profile.id === dealerId)
    if (dealerIndex + 1 >= profiles.length) {
      setDealerId(profiles[0].id)
    } else {
      setDealerId(profiles[dealerIndex + 1].id)
    }
  }, [hands, scores, profiles, dealerId])

  const onMessage = useCallback((message, send) => {
    switch (message.type) {
      case 'hello': onHello(message, send); break;
      case 'sync': onSync(message, send); break;
      case 'start': onStart(message, send); break;
      case 'play': onPlay(message, send); break;
      case 'yaniv': onYaniv(message, send); break;
      default:
    }
  }, [onHello, onStart, onPlay, onYaniv])

  const onConnect = useCallback((socket) => {
    socket.send(JSON.stringify({
      type: 'hello',
      gameId,
      profile: me,
    }))
  }, [gameId, me])

  const send = useWebSocket({ eventsUri, onMessage, onConnect })

  useEffect(() => {
    send({
      type: 'hello',
      gameId,
      profile: me,
    })
  }, [send, gameId, me])

  const start = useCallback(({
    hands,
    stack,
  }: {
    hands: { [profileId: string]: string[] },
    stack: string[]
  }) => {
    send({
      type: 'start',
      gameId,
      profile: me,
      hands,
      stack,
    })
  }, [send, gameId, me])

  const play = useCallback(({
    discards,
    draw,
  }: {
    discards: string[],
    draw: string,
  }) => {
    send({
      type: 'play',
      gameId,
      profile: me,
      discards,
      draw,
    })
  }, [send, gameId, me])

  const yaniv = useCallback(() => {
    send({
      type: 'yaniv',
      gameId,
      profile: me,
    })
  }, [send, gameId, me])

  return {
    connected,
    gameId,
    profiles,
    currentProfileId,
    dealerId,
    scores,
    lastMove,
    start,
    play,
    yaniv,
  }
}
