import { useCallback, useEffect, useRef } from 'react'

export default function useWebSocket({ eventsUri, onMessage, onConnect }) {
  const socket = useRef<WebSocket>()
  const messageHandler = useRef<Function>()
  const connectHandler = useRef<Function>()

  messageHandler.current = onMessage
  connectHandler.current = onConnect

  /**
   * connect through websocket and manage connection
   */
  useEffect(() => {
    const webSocket = new WebSocket(eventsUri)
    webSocket.onopen = () => {
      socket.current = webSocket
      connectHandler.current?.(webSocket)
    }
    webSocket.onclose = () => {
    }
    webSocket.onerror = () => {
    }
    webSocket.onmessage = ({ data }) => {
      const message = JSON.parse(data)
      messageHandler.current?.(message, (message) => webSocket.send(JSON.stringify(message)))
    }
    return () => {
      webSocket.close()
      socket.current = null
    }
  }, [eventsUri, socket])

  const send = useCallback((message) => {
    socket.current?.send(JSON.stringify(message))
  }, [socket])

  return send
}
