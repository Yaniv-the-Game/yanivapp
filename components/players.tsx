import React from 'react'

export default function Players({
  hands,
  currentHand,
  myHand,
}: {
  hands: string[][],
  currentHand: number,
  myHand: number,
}) {
  return (
    <div>
      {hands.map((hand, i) => (
        <div className='profile'>
          <p>Hand {i + 1} {currentHand === i && '*'}</p>
          <p>
            {hand.map(card => (
              <span>X</span>
            ))}
          </p>
        </div>
      ))}
      {currentHand === myHand && (
        <p>it's your turn</p>
      )}
      <style jsx>{`
        .profile {
          display: inline-block;
        }
      `}</style>
    </div>
  )
}
