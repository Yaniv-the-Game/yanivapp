import React from 'react'
import classnames from 'classnames'


export default function PlayButton({
  onPlay,
  onYaniv,
  score,
  cardsToDiscard,
  myTurn,
}: {
  onPlay: () => void,
  onYaniv: () => void,
  cardsToDiscard: { [card: string]: boolean },
  score: number,
  myTurn: boolean,
}) {

// TODO tell if cards are selected in hand or not... (maybe need hand?)
const cardsSelected = Object.values(cardsToDiscard).some(active => active);

  return (
    <div className='play-button'>

    {score <= 5 && !cardsSelected
          ?  <button className='button yaniv' type='button' onClick={onYaniv}>yaniv!</button>
          : <button className='button normal' type='button' onClick={onPlay}>play</button>
        }


<style jsx>{`
        .play-button {
          text-align: center;
        }

        .button {
          appearance: none;
          position:absolute;
          bottom:200px;
          right:50px;
          border-radius:50%;
          height: 65px;
          width:65px;
          display: inline-block;
          border: none;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;

        }
        .normal{
          background: #A9C3A6;
        }
        .yaniv{
          background: blue;
          color: white;
        }
      `}</style>
    </div>
  )
}
