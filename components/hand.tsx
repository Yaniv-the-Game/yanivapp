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

  function toggleActiveClass(e) {
    console.log(e);
  }

  return (
    <div className="HandArea">
      <div className='selectedcards'>
        {hand.filter(card => cardsToDiscard[card]).map((card) => (
          <div className='card selected' onClick={() => onToggleCardToDiscard(card)}>
            <Card type={card} />
          </div>
        ))}
      </div>
      <div className='cards'>
        {hand.map((card) => (
          <div className='card' onClick={() => onToggleCardToDiscard(card)}>
            <div className='cardSVG' onClick={() => toggleActiveClass(this)}>
              <Card type={card} />
              </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .HandArea{
          position:absolute;
          bottom:10px;
          width:100%;
          text-align:center;
        }

        .cards{
          position:relative;
          margin:auto;
          width:auto;
          text-align:center;
          max-width:800px;
        }

        .selectedcards{
          position:relative;
          text-align:center;
        }

        .card{
          position:relative;
          display:inline-block;
          margin:5px;
          width:16vw;
          height:24vw;
          max-width:100px;
          max-height:150px;
          box-shadow: 1px 2px 3px 0px rgba(0,0,0,0.55);
          transition: box-shadow 0.1s ease-in-out;
          }

          .card:hover {
            box-shadow: 1px 2px 5px 0px rgba(0,0,0,0.85);
          }



        .selected{
          width:20vw;
          height:30vw;
          max-width:140px;
          max-height:210px;
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
