import { useCallback, useEffect, useState, useRef } from 'react'

export function useMultiplayer({
  eventsUri,
  gameId,
  name,
}: {
  eventsUri: string,
  gameId: string | null,
  name: string,
}) {
  const [connected, setConnected] = useState(false)
  const [counter, setCounter] = useState(null)
  const socket = useRef<WebSocket>()

  const increment = useCallback(() => {
    setCounter(counter + 1)
  }, [counter, setCounter])

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
    webSocket.onmessage = () => {
    }
    return () => {
      webSocket.close()
      socket.current = null
      setConnected(false)
    }
  }, [eventsUri, socket, setConnected])

  useEffect(() => {
    if (!connected) {
      return
    }

    socket.current?.send(JSON.stringify({
      type: 'join',
      gameId
    }))
  }, [connected, gameId])

  useEffect(() => {
    if (!connected) {
      return
    }

    socket.current?.send(JSON.stringify({
      type: 'rename',
      gameId,
      name,
    }))
  }, [connected, name])

  return {
    connected,
    gameId,
    counter,
    increment,
  }
}
