import { useCallback, useEffect, useState, useRef } from 'react'

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
  turnUp: () => void,
  discardAndDraw: (handId: string, discards: string[], draw: string) => void,
}) {
  const [connected, setConnected] = useState(false)
  const [currentProfileId, setCurrentProfileId] = useState(null)
  const [currentDealerId, setDealerId] = useState(null)
  const [playing, setPlaying] = useState(false)
  const socket = useRef<WebSocket>()
  const [profiles, setProfiles] = useState<{ id: string, name: string, avatar: string }[]>([])
  const [scores, setScores] = useState([])
  // const scores = [
  //   { j2s: 12, xxz: 0, p87: 5 },
  //   { j2s: 12, xxz: 0, p87: 5 },
  //   { j2s: 12, xxz: 0, p87: 5 },
  // ]

  const onHello = useCallback(({ profile }) => {
    setProfiles((profiles) => {
      const updated = profiles.find(p => p.id === profile.id)
        ? profiles.map(p => p.id === profile.id ? profile : p)
        : [...profiles, profile]

      if (me.id !== profile.id) {
        socket.current?.send(JSON.stringify({
          type: 'updateProfiles',
          gameId,
          profiles: updated,
        }))

        // TODO also send game state if client isn't synced anymore
      }

      return updated
    })
  }, [setProfiles])

  const onUpdateProfiles = useCallback(({ profiles }) => {
    setProfiles(profiles)
  }, [setProfiles])

  const onStart = useCallback(({ profile, hands, stack }) => {
    setUp(hands, stack)
    turnUp()
    setPlaying(true)
    setCurrentProfileId(profile.id)
  }, [setUp, turnUp, setPlaying])

  const onPlay = useCallback(({ profile, discards, draw }) => {
    discardAndDraw(profile.id, discards, draw)
  }, [discardAndDraw])

  const onYaniv = useCallback(({ profile }) => {
    // TODO check and update game state
    console.log(`${profile.id} says Yaniv!`)
  }, [])

  /**
   * connect through websocket and manage connection
   */
  useEffect(() => {
    const webSocket = new WebSocket(eventsUri)
    webSocket.onopen = () => {
      socket.current = webSocket
      setConnected(true)
    }
    webSocket.onclose = () => {
      setConnected(false)
    }
    webSocket.onerror = () => {
      setConnected(false)
    }
    webSocket.onmessage = ({ data }) => {
      const message = JSON.parse(data)

      switch (message.type) {
        case 'hello': onHello(message); break;
        case 'updateProfiles': onUpdateProfiles(message); break;
        case 'start': onStart(message); break;
        case 'play': onPlay(message); break;
        case 'yaniv': onYaniv(message); break;
        default:
      }
    }
    return () => {
      webSocket.close()
      socket.current = null
      setConnected(false)
    }
  }, [eventsUri, socket, setConnected, socket, onPlay])

  useEffect(() => {
    if (!connected) {
      return
    }

    socket.current?.send(JSON.stringify({
      type: 'hello',
      gameId,
      profile: me,
    }))
  }, [connected, me, socket])

  const start = useCallback(({
    hands,
    stack,
  }: {
    hands: { [profileId: string]: string[] },
    stack: string[]
  }) => {
    socket.current?.send(JSON.stringify({
      type: 'start',
      gameId,
      profile: me,
      hands,
      stack,
    }))
  }, [socket])

  const play = useCallback(({
    discards,
    draw,
  }: {
    discards: string[],
    draw: string,
  }) => {
    socket.current?.send(JSON.stringify({
      type: 'play',
      gameId,
      profile: me,
      discards,
      draw,
    }))
  }, [socket])

  const yaniv = useCallback(() => {
    socket.current?.send(JSON.stringify({
      type: 'yaniv',
      gameId,
      profile: me,
    }))
  }, [socket])

  return {
    connected,
    playing,
    gameId,
    profiles,
    currentProfileId,
    currentDealerId,
    scores,
    start,
    play,
    yaniv,
  }
}
