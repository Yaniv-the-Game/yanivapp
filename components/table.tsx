import React from 'react'
import Card from '../components/card'

export default function Table({
  pile,
  onToggleDrawCard,
}: {
  pile: string[][],
  onToggleDrawCard: (card: string) => void,
}) {
  const [active, setActive] = React.useState(false);

  const selectFromPile = (event) => {
    console.log(active);
    if(!active){
      setActive(true);
      event.currentTarget.classList.add("selected");
      }
      else{
      setActive(false);
      event.currentTarget.classList.remove("selected");
      }
};



  return (
    <div className='table'>
      {pile[0] && pile[0].map((card) => (
        <div className='pile'>
          <span className='card pe-0'><Card type="J1" /></span>
          <span className='card pe-1'><Card type="B1" /></span>
          <span className='card pe-2'><Card type="CX" /></span>
            <span  onClick={() => {onToggleDrawCard(card)}}>
              <span className='card pe-3' onClick={selectFromPile}>
              <Card type={card} />
              </span>
            </span>
        </div>

      ))}



      <style jsx>{`
        .pe-0{transform: rotate(2deg);}
        .pe-1{transform: rotate(-8deg);}
        .pe-2{transform: rotate(5deg);}
        .pe-2{transform: rotate(-3deg);}

        .table {
          padding: 20px;
          text-align: center;
        }
        .pile{
          position:relative;
        }
        .card {
          position:absolute;
          margin-left: auto;
          margin-right: auto;
          top:20px;
          left: 0;
          right: 0;
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
      `}</style>
    </div>
  )
}
