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
          position:absolute;
          bottom:200px;
          right:50px;
          border-radius:50%;
          height: 65px;
          width:65px;
          display: inline-block;
          border: none;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          background: #A9C3A6;
        }
      `}</style>
    </div>
  )
}
