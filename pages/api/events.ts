import { NextApiRequest, NextApiResponse } from 'next'
import { decodeWebSocketEvents, encodeWebSocketEvents, WebSocketEvent, WebSocketContext, PubControlItem } from 'grip'
import { Item } from 'pubcontrol';
import { GripPubControl, WebSocketMessageFormat } from 'grip';

// Pushpin control publisher, through which we publish messages to websocket clients
const pub = new GripPubControl({ control_uri: 'http://localhost:6561' })

// game id => seed
//

const eventHandlers = {
  // create a new game () => (game id, {seed}, subscription)
  // join a game (game id, player name, avatar) => ({seed}, subscription)
  //   --> joined (player id,  player name, avatar)
  //   <-- sync (game id, counter)
  // rename (game id, player id, player name, avatar) => ()
  //   --> renamed (player id, player name, avatar)
  // increment (game id, player id, amount) => ()
  //   --> incremented (game id, player id, amount)

  /**
   * React to a newly joined user
   */
  async join({ gameId }: { gameId: string }, context: WebSocketContext) {
    context.subscribe(gameId)

    pub.publish(gameId, new Item(new WebSocketMessageFormat(JSON.stringify({
      type: 'joined',
    }))))

    // pub.publish('all', new Item(new WebSocketMessageFormat(JSON.stringify({
    //   jo: 'all',
    //   jo2: 'all2',
    // }))))
    // context.send(JSON.stringify({
    //   hello: 'world',
    //   hello2: 'world',
    // }))
  },
  /**
   * React to a newly joined user
   */
  async rename({ name, gameId }: { name: string, gameId: string }, context: WebSocketContext) {
    pub.publish(gameId, new Item(new WebSocketMessageFormat(JSON.stringify({
      type: 'renamed',
      name
    }))))

    // pub.publish('all', new Item(new WebSocketMessageFormat(JSON.stringify({
    //   jo: 'all',
    //   jo2: 'all2',
    // }))))
    // context.send(JSON.stringify({
    //   hello: 'world',
    //   hello2: 'world',
    // }))
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