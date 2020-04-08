import React from 'react'
import Card from '../components/card'

export default function Hand({
  hand,
}: {
  hand: string[],
}) {
  if (!hand) {
    return null
  }

  let selectedToDiscard = ['J1','CK'];

  return (
    <div className="HandArea">
      <div className='selectedcards'>
        {selectedToDiscard.map(card => (
          <div className='card cardSVG selected' onClick={()=>{ alert("TODO if a user clicks a selectedcard, it should be removed from the 'selectedToDiscard' array (assuming this will trigger the array to be redrawn?)"); }}>
            <Card type={card} />
          </div>
        ))}
      </div>
      <div className='cards'>
        {hand.map((card, index) => (
          <div className='card' onClick={()=>{ alert("a) an 'active' class should be added to this card div. b) the card should get added to the 'selectedToDiscard' array"); }}>
            <div className="cardSVG">
              <Card type={card} />
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .HandArea{
          position:absolute;
          bottom:0;
          width:100%;
          min-height:270px;
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
