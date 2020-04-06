![Build and Test](https://github.com/Yaniv-the-Game/yanivapp/workflows/Build%20and%20Test/badge.svg)

# yanivapp

> Playable instance of the massively popular Yaniv card game.

## How to Play

### Goal
- The goal is to write as little points as possible.

### Values
- Joker: 0 points
- Ace: 1 point
- Numbers: Value on Card
- Other Cards: 10 points

### Rules
- Every player gets 5 cards
- A user can put down one of the following options
  - single card
  - 2 or more cards of the same value
  - 3 or more cards in a row (same colour)
- A user can call Yaniv once they have less than 5 points on hand
  - If no other user has equal or less points, this player writes 0 points. They win this round.
  - If another user has equal or less points, this player writes 25 points plus whatever amount they had when they called out Yaniv (e.g. 25 + 4)
- If a user reaches more than 100 points, they are out of the game
There is 2 ways to reduce points
 - If a user reaches exactly 50 points, their score will be halfed to 25
  - If a user reaches exaclty 100 points, their score will be halfed to 50 for the first time and reduced to 0 points on the second time

## Develop

Start `pushpin` in background mode,
the proxy that transforms websocket connections to plain
HTTP requests for us to handle in `pages/api/events.ts`.
You'll need [Docker Desktop](https://www.docker.com/products/docker-desktop)
for that.

```
docker-compose up -d
```

Install all project dependencies using `yarn`. See how to install
it [on its website](https://classic.yarnpkg.com/en/docs/install/).

```
yarn install
```

Start the project using the development mode of `now`.
It can [easily be installed](https://zeit.co/download) through `yarn`.

```
now dev
```

## Deploy

As soon as a feature is merged on `master`, it will automatically deploy
to [yanivapp.now.sh](https://yanivapp.now.sh).

You can also deploy manually by typing `now` while you're in the project directory.

## License

MIT
