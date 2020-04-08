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
      {pile[0] && pile[0].map((card) => (
        <span className='card' onClick={() => onToggleDrawCard(card)}>
          <Card type={card} />
        </span>
      ))}
      {pile[0] && (
        <span className='card' onClick={() => onToggleDrawCard(null)}>
          <Card type='B1' />
        </span>
      )}
      <style jsx>{`
        .table {
          padding: 20px;
          text-align: center;
        }

        .card {
          width: 68px;
          display: inline-block;
        }
      `}</style>
    </div>
  )
}
