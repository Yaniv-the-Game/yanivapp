import { useCallback, useEffect, useState, useMemo } from 'react'
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
  setUp,
  turnUp,
  discardAndDraw,
}: {
  eventsUri: string,
  gameId: string | null,
  me: {
    id: string,
    name: string,
    avatar: string,
  },
  setUp: (hands: { [profileId: string]: string[] }, stack: string[]) => void,
  turnUp: () => string,
  discardAndDraw: (handId: string, discards: string[], draw: string) => void,
}) {
  const [connected, setConnected] = useState(false)
  const [currentDealerId, setDealerId] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [profiles, setProfiles] = useState<{ id: string, name: string, avatar: string }[]>([])
  const [lastMove, setLastMove] = useState<LastMove>(null)
  const [scores, setScores] = useState([])
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

  // const scores = [
  //   { j2s: 12, xxz: 0, p87: 5 },
  //   { j2s: 12, xxz: 0, p87: 5 },
  //   { j2s: 12, xxz: 0, p87: 5 },
  // ]

  const onHello = useCallback(({ profile }, send) => {
    setProfiles((profiles) => {
      const updated = profiles.find(p => p.id === profile.id)
        ? profiles.map(p => p.id === profile.id ? profile : p)
        : [...profiles, profile]

      if (me.id !== profile.id) {
        send({
          type: 'updateProfiles',
          gameId,
          profiles: updated,
        })

        // TODO also send game state if client isn't synced anymore
      }

      return updated
    })
  }, [setProfiles])

  const onUpdateProfiles = useCallback(({ profiles }, send) => {
    setProfiles(profiles)
  }, [setProfiles])

  const onStart = useCallback(({ profile, hands, stack }, send) => {
    setUp(hands, stack)
    // const card = turnUp()
    setLastMove({ profileId: profile.id, type: 'turnUp', card: stack[0] })
    setPlaying(true)
  }, [setUp, turnUp, setLastMove, setPlaying])

  const onPlay = useCallback(({ profile, discards, draw }, send) => {
    discardAndDraw(profile.id, discards, draw)
    setLastMove({ profileId: profile.id, type: 'discardAndDraw', discards, draw })
  }, [discardAndDraw])

  const onYaniv = useCallback(({ profile }, send) => {
    setLastMove({ profileId: profile.id, type: 'yaniv' })
  }, [])

  const onMessage = useCallback((message, send) => {
    switch (message.type) {
      case 'hello': onHello(message, send); break;
      case 'updateProfiles': onUpdateProfiles(message, send); break;
      case 'start': onStart(message, send); break;
      case 'play': onPlay(message, send); break;
      case 'yaniv': onYaniv(message, send); break;
      default:
    }
  }, [onHello, onUpdateProfiles, onStart, onPlay, onYaniv])

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
    playing,
    gameId,
    profiles,
    currentProfileId,
    currentDealerId,
    scores,
    lastMove,
    start,
    play,
    yaniv,
  }
}
