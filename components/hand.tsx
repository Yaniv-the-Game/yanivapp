import React from 'react'
import Card from '../components/card'

export default function Hand({
  hands,
  currentHand,
  myHand,
  }: {
  hands: string[][],
  currentHand: number,
  myHand: number,
  }) {

if(hands.length == 0){return(null)}
else{

  return (
    <div className="HandArea">
      <div className='cards'>
      {hands[myHand].map(card => (
        <div className='card'>
        <Card type={card} />
        </div>
      ))}
      </div>
    <style jsx>{`
      .HandArea{
        width:100%;
        min-height:270px;
      }
      .cards{
        margin:0;
        text-align:center;
      }
      .card{
        min-width:70px;
        height:auto;
        margin-right:10px;
        display:inline-block;
        border-radius:10px;
        -webkit-box-shadow: 3px 3px 3px 0px rgba(0,0,0,0.75);
        -moz-box-shadow: 3px 3px 3px 0px rgba(0,0,0,0.75);
        box-shadow: 3px 3px 3px 0px rgba(0,0,0,0.75);
      }
      .active {
        width:150px;
      }

      `}</style>
      </div>
    )
  }
  }
