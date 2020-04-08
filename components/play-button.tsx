import React from 'react'

export default function PlayButton({
  onPlay,
}: {
  onPlay: () => void,
}) {
  return (
    <div className='play-button'>
      <button className='button' type='button' onClick={onPlay}>play</button>
      <style jsx>{`
        .play-button {
          text-align: center;
        }

        .button {
          appearance: none;
          width: 68px;
          height: 68px;
          display: inline-block;
          border: none;
          border-radius: 50%;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          background: red;
        }
      `}</style>
    </div>
  )
}
