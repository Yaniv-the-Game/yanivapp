import { NextApiRequest, NextApiResponse } from 'next'
import { text } from 'co-body'
import { decodeWebSocketEvents, encodeWebSocketEvents, WebSocketEvent, WebSocketContext } from 'grip'

declare module 'http' {
  interface IncomingHttpHeaders {
    'connection-id'?: string
  }
}

export default async function eventsHandler(req: NextApiRequest, res: NextApiResponse) {
  // TODO check grip signature (req.headers['grip-sig'])
  if (req.headers['content-type'] !== 'application/websocket-events') {
    // handle correctly
    return
  }

  const body = await text(req)

  const events = decodeWebSocketEvents(body);
  const connectionId = req.headers['connection-id'];
  const meta = {};

  const gripWebSocketContext = new WebSocketContext(
    connectionId,
    meta,
    events
  );

  const eventsOut: WebSocketEvent[] = [];
  for (const event of events) {
    switch (event.getType()) {
      // 'Close message with 16-bit close code.'
      case 'CLOSE':
        const closeCode = (event.getContent() || '').toString();
        eventsOut.push(new WebSocketEvent('CLOSE', closeCode));
        break;

      // 'Indicates connection closed uncleanly or does not exist.'
      case 'DISCONNECT':
        eventsOut.push(new WebSocketEvent('DISCONNECT'));
        break;

      case 'OPEN':
        eventsOut.push(new WebSocketEvent('OPEN'));
        break;

      case 'TEXT':
        const content = event.getContent();
        if (!content) {
          break;
        }

        // parse message here an do magic things
        console.log(content)

        break;

      default:
        throw new Error(`Unexpected event type ${event.getType()}`);
    }
  }

  res.writeHead(200, {
    'content-type': 'application/websocket-events',
    'sec-websocket-extensions': 'grip; message-prefix=""',
  });
  res.write(encodeWebSocketEvents([...gripWebSocketContext.outEvents]));
  res.write(encodeWebSocketEvents([...eventsOut]));
  res.end();
}
