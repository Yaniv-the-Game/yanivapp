import React from 'react'
import classnames from 'classnames'
import Card from '../components/card'

export default function Table({
  pile,
  drawCard,
  onToggleDrawCard,
  myTurn,
}: {
  pile: string[][],
  drawCard: string | null,
  onToggleDrawCard: (card: string) => void,
  myTurn: boolean,
}) {
  return (
    <div className='table'>
      {pile.slice(1, 4).map(level => level[0]).map((card) => (
        <span className='card history'>
          <Card type={card} />
        </span>
      ))}
      {pile[0] && pile[0].map((card) => (
        <span onClick={() => {onToggleDrawCard(card)}}>
          <span className={classnames('card', { selected: drawCard === card })}>
            <Card type={card} />
          </span>
        </span>
      ))}
      <style jsx>{`
        .card.history {
          position: absolute;
          margin: 0 auto;
          top:20px;
          left: 0;
          right: 0;
          z-index: -1;
        }

        .card.history:nth-child(1) {
          transform: rotate(2deg);
        }

        .card.history:nth-child(2) {
          transform: rotate(-8deg);
        }

        .card.history:nth-child(1) {
          transform: rotate(5deg);
        }

        .table {
          position: relative;
          padding: 20px;
          text-align: center;
        }

        .card {
          width:20vw;
          height:30vw;
          max-width:140px;
          max-height:210px;
          display: inline-block;
          box-shadow: 1px 2px 3px 0px rgba(0,0,0,0.55);
          transition: all 0.1s ease-in-out;
          transform-origin:center center;
        }

        .stack{
          position:relative;
          left:20%;
        }


        .selected{
          transform: rotate(45deg);
          width:26vw;
          height:39vw;
          box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.48);

        }

        @media only screen and (min-width: 600px) {
          .card {
            max-width:120px;
            max-height:180px;
          }
        }
      `}</style>
    </div>
  )
}
