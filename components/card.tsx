import React from 'react'
import B1 from './cards/b1.svg'
import C2 from './cards/c2.svg'
import C3 from './cards/c3.svg'
import C4 from './cards/c4.svg'
import C5 from './cards/c5.svg'
import C6 from './cards/c6.svg'
import C7 from './cards/c7.svg'
import C8 from './cards/c8.svg'
import C9 from './cards/c9.svg'
import CA from './cards/ca.svg'
import CJ from './cards/cj.svg'
import CK from './cards/ck.svg'
import CQ from './cards/cq.svg'
import CX from './cards/cx.svg'
import H2 from './cards/h2.svg'
import H3 from './cards/h3.svg'
import H4 from './cards/h4.svg'
import H5 from './cards/h5.svg'
import H6 from './cards/h6.svg'
import H7 from './cards/h7.svg'
import H8 from './cards/h8.svg'
import H9 from './cards/h9.svg'
import HA from './cards/ha.svg'
import HJ from './cards/hj.svg'
import HK from './cards/hk.svg'
import HQ from './cards/hq.svg'
import HX from './cards/hx.svg'
import J1 from './cards/j1.svg'
import J2 from './cards/j2.svg'
import P2 from './cards/p2.svg'
import P3 from './cards/p3.svg'
import P4 from './cards/p4.svg'
import P5 from './cards/p5.svg'
import P6 from './cards/p6.svg'
import P7 from './cards/p7.svg'
import P8 from './cards/p8.svg'
import P9 from './cards/p9.svg'
import PA from './cards/pa.svg'
import PJ from './cards/pj.svg'
import PK from './cards/pk.svg'
import PQ from './cards/pq.svg'
import PX from './cards/px.svg'
import T2 from './cards/t2.svg'
import T3 from './cards/t3.svg'
import T4 from './cards/t4.svg'
import T5 from './cards/t5.svg'
import T6 from './cards/t6.svg'
import T7 from './cards/t7.svg'
import T8 from './cards/t8.svg'
import T9 from './cards/t9.svg'
import TA from './cards/ta.svg'
import TJ from './cards/tj.svg'
import TK from './cards/tk.svg'
import TQ from './cards/tq.svg'
import TX from './cards/tx.svg'

const cards = {
  B1,
  C2,
  C3,
  C4,
  C5,
  C6,
  C7,
  C8,
  C9,
  CA,
  CJ,
  CK,
  CQ,
  CX,
  H2,
  H3,
  H4,
  H5,
  H6,
  H7,
  H8,
  H9,
  HA,
  HJ,
  HK,
  HQ,
  HX,
  J1,
  J2,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  PA,
  PJ,
  PK,
  PQ,
  PX,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  TA,
  TJ,
  TK,
  TQ,
  TX,
}

export default function Card({ type }) {
  const Image = cards[type] || 'div';

  return (
      <Image />
  )
}
