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

  const [active, setActive] = React.useState(false);

  const hideCardFromHand = (event) => {
    if(active){
      setActive(false);
    }
    else{
      setActive(true);  
    }

};

const showCardInHand = (card) => {
setActive(false);
};

  if (!hand) {
    return null
  }



  return (
    <div className="HandArea">
      <div className='selectedcards'>
        {hand.filter(card => cardsToDiscard[card]).map((card) => (
          <div className='card cardSVG selected' key={card} onClick={() => onToggleCardToDiscard(card)}>
            <div className="" onClick={() => showCardInHand(card)}>
            <Card type={card} />
            </div>
          </div>
        ))}
      </div>
      <div className='cards'>
        {hand.map((card) => (
          <div className='card' key={card} onClick={() => onToggleCardToDiscard(card)}>
            <div className={`cardSVG ${active ? "testClass":""}`} onClick={hideCardFromHand}>
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
          padding:0;
          width:16vw;
          height:24vw;
          max-width:100px;
          max-height:150px;
          }

        .cardSVG{
          height:100%;
          width:100%;
          margin:0;
          box-shadow: 1px 2px 3px 0px rgba(0,0,0,0.55);
          transition: box-shadow 0.1s ease-in-out;

        }

          .cardSVG:hover {
            box-shadow: 1px 2px 5px 0px rgba(0,0,0,0.85);
          }

        .selected{
          width:20vw;
          height:30vw;
          max-width:140px;
          max-height:210px;
          position:relative;
        }

        .active {
          display:none;
        }

        .selected.active {
          display:inline-block;
        }
        .testClass{
          border:3px solid yellow;
        }
      `}</style>
    </div>
  )
}
