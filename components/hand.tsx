import React from 'react'
import Card from '../components/card'

export default function Hand({
  hand,
  cardsToDiscard,
  onToggleCardToDiscard,
}: {
  hand: string[],
  cardsToDiscard: { [card: string]: boolean },
  onToggleCardToDiscard: (card: string) => void,
}) {
  if (!hand) {
    return null
  }

  return (
    <div className="HandArea">
      <div className='selectedcards'>
        {hand.filter(card => cardsToDiscard[card]).map((card) => (
          <div className='card cardSVG selected' onClick={() => onToggleCardToDiscard(card)}>
            <Card type={card} />
          </div>
        ))}
      </div>
      <div className='cards'>
        {hand.map((card) => (
          <div className='card cardSVG' onClick={() => onToggleCardToDiscard(card)}>
            <div className="cardSVG">
              <Card type={card} />
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .HandArea{
        }

        .cards{
          position:relative;
          margin:0;
          width:auto;
          text-align:center;
        }

        .selectedcards{
          position:relative;
          text-align:center;
        }

        .card{
          position:relative;
          width:68px;
          display:inline-block;
        }

        .cardSVG{
          width:60px;
          height:85px;
          border-radius:10px;
          -webkit-box-shadow: 3px 3px 3px 0px rgba(0,0,0,0.75);
          -moz-box-shadow: 3px 3px 3px 0px rgba(0,0,0,0.75);
          box-shadow: 3px 3px 3px 0px rgba(0,0,0,0.75);
        }

        .selected{
          min-width:80px;
          height:114px;
          position:relative;
        }

        .active > .cardSVG {
          display:none;
        }

        .selected.active {
          display:inline-block;
        }
      `}</style>
    </div>
  )
}
