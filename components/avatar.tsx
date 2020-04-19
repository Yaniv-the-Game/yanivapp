import React from 'react'

export default function Avatar({
  name,
  mood,
  size
}: {
  name: string,
  mood: string,
  size: number
}) {

  let n;
  switch(name) {
    case 'avocado':
      n = "0";
      break;
    case 'cookie':
      n = "1";
      break;
    case 'strawberry':
      n = "2";
      break;
    case 'waffle':
      n = "3";
      break;
    case 'muesli':
      n = "4";
      break;
    case 'sandwich':
      n = "5";
      break;
    case 'gipfeli':
      n = "6";
      break;
    default:
      n = "0";
      break;
  }

  let m;
  switch(mood) {
    case 'good':
      m = "G";
      break;
    case 'bad':
      m = "B";
      break;
    case 'winner':
      m = "K";
    default:
      m = "G";
      break;
  }

  return (
    <img src={`/avatars/${n}${m}.png`} alt={name} height={`${size}px`} width={`${size}px`}/>
  )
}
