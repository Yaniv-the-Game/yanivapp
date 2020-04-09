import React from 'react'
import Card from '../components/card'

export default function Table({
  pile,
  onToggleDrawCard,
}: {
  pile: string[][],
  onToggleDrawCard: (card: string) => void,
}) {
  return (
    <div className='table'>
      <div className='pile'>
      <span className='card pe-0'><Card type="J1" /></span>
      <span className='card pe-1'><Card type="B1" /></span>
      <span className='card pe-2'><Card type="CX" /></span>
      {pile[0] && pile[0].map((card) => (
        <span className='card drawcard selected' onClick={() => onToggleDrawCard(card)}>
          <Card type={card} />
        </span>
      ))}

      </div>


      <style jsx>{`
        .pe-0{transform: rotate(2deg);}
        .pe-1{transform: rotate(-3deg);}
        .pe-2{transform: rotate(5deg);}

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
        }
        .drawcard{
          transition: all 0.1s ease-in-out;
          transform-origin:center center;
        }
        .drawcard:hover{
          width:26vw;
          height:39vw;
          box-shadow: 1px 2px 5px 0px rgba(0,0,0,0.85);
        }

        .stack{
          position:relative;
          left:20%;
        }


        .selected{
          transform: rotate(10deg);
          width:26vw;
          height:39vw;
          box-shadow: 1px 2px 5px 0px rgba(0,0,0,0.85);

        }
      `}</style>
    </div>
  )
}
