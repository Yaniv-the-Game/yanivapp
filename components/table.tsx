import React from 'react'
import Card from '../components/card'

export default function Table({
  pile,
}: {
  pile: string[][],
}) {
  return (
    <div className='table'>
      {pile[0] && pile[0].map((card) => (
        <span className='card'>
          <Card type={card} />
        </span>
      ))}
      {pile[0] && (
        <span className='card'>
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
