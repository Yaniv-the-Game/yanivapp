import { NextApiRequest, NextApiResponse } from 'next'
import { decodeWebSocketEvents, encodeWebSocketEvents, WebSocketEvent, WebSocketContext, PubControlItem } from 'grip'
import { Item } from 'pubcontrol';
import { GripPubControl, WebSocketMessageFormat } from 'grip';

// Pushpin control publisher, through which we publish messages to websocket clients
const pub = new GripPubControl({
  control_uri: process.env.PUSHPIN_CONTROL_URI || 'http://localhost:6561',
  control_iss: process.env.PUSHPIN_CONTROL_ISS,
  // @ts-ignore API expects Buffer, but type wants string?
  key: process.env.PUSHPIN_CONTROL_KEY && Buffer.from(process.env.PUSHPIN_CONTROL_KEY, 'base64'),
})

const eventHandlers = {
  async hello({ gameId, profile }: { gameId: string, profile: { id: string, name: string, avatar: string } }, context: WebSocketContext) {
    context.subscribe(gameId)

    pub.publish(gameId, new Item(new WebSocketMessageFormat(JSON.stringify({
      type: 'hello',
      profile,
    }))))
  },
  async updateProfiles({ gameId, profiles }: { gameId: string, profiles: { id: string, name: string, avatar: string }[] }, context: WebSocketContext) {
    pub.publish(gameId, new Item(new WebSocketMessageFormat(JSON.stringify({
      type: 'updateProfiles',
      profiles,
    }))))
  },
  async start({ gameId, profile, hands, stack }: { gameId: string, profile: { id: string, name: string, avatar: string }, hands: { [profileId: string]: string[] }, stack: string[] }, context: WebSocketContext) {
    pub.publish(gameId, new Item(new WebSocketMessageFormat(JSON.stringify({
      type: 'start',
      profile,
      hands,
      stack,
    }))))
  },
  async play({ gameId, profile, discards, draw }: { gameId: string, profile: { id: string, name: string, avatar: string }, discards: string[], draw: string }, context: WebSocketContext) {
    pub.publish(gameId, new Item(new WebSocketMessageFormat(JSON.stringify({
      type: 'play',
      profile,
      discards,
      draw,
    }))))
  },
  async yaniv({ gameId, profile }: { gameId: string, profile: { id: string, name: string, avatar: string } }, context: WebSocketContext) {
    pub.publish(gameId, new Item(new WebSocketMessageFormat(JSON.stringify({
      type: 'yaniv',
      profile,
    }))))
  },
};

/**
 * Handle all events coming from the websocket connection.
 *
 * @param req
 * @param res
 */
export default async function eventsHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate the Grip-Sig header:
  // if (!validateSig(req.headers['grip-sig'], '<key>')) {
  //   res.writeHead(401);
  //   res.end('invalid grip-sig token');
  //   return
  // }

  if (req.headers['content-type'] !== 'application/websocket-events') {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('This endpoint only accepts websocket events');
    res.end();
    return
  }

  const events = decodeWebSocketEvents(req.body);
  const connectionId = req.headers['connection-id'];
  const meta = {};
  const context = new WebSocketContext(connectionId, meta, events);

  for (const event of events) {
    console.log(event)
    switch (event.getType()) {
      case 'CLOSE':
        context.close(parseInt(event.getContent()?.toString() || '0', 10))
        break;
      case 'DISCONNECT':
        context.disconnect()
        break;
      case 'OPEN':
        context.outEvents.push(new WebSocketEvent('OPEN'))
        break;
      case 'TEXT':
        const content = event.getContent()?.toString() || null;
        let message = null

        try {
          message = JSON.parse(content);
        } catch (e) {
          console.error(`Cannot decode message '${content}'. Skipping...`)
          continue
        }

        const handler = eventHandlers[message?.type]
        if (handler) {
          await handler(message, context)
        } else {
          console.error(`Unknown message type '${message?.type}' sent. Skipping...`)
          continue
        }

        break;
      default:
        throw new Error(`Unexpected event type ${event.getType()}`);
    }
  }

  res.writeHead(200, {
    'content-type': 'application/websocket-events',
    'sec-websocket-extensions': 'grip; message-prefix=""',
  });
  res.write(encodeWebSocketEvents([...context.outEvents]));
  res.end();
}
