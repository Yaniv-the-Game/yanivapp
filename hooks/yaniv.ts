import { useCallback, useEffect, useState } from 'react'

export function useYaniv({ eventsUri }) {
  const [counter, setCounter] = useState(0)

  const increment = useCallback(() => {
    setCounter(counter + 1)
  }, [counter, setCounter])



  useEffect(() => {
    const webSocket = new WebSocket(eventsUri)

    webSocket.onopen = () => {
      // initially send counter
      webSocket.send(JSON.stringify({
        type: 'join'
      }))
    }

    return () => {
      webSocket.close()
    }
  }, [eventsUri])

  return {
    counter,
    increment,
  }
}
