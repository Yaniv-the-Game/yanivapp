/* eslint-env jest */

import { renderHook, act } from '@testing-library/react-hooks'
import { useYaniv } from './yaniv'

describe('yaniv hook', () => {
  beforeEach(() => {
  })

  it('should discard and draw card from stack', () => {
    const { result } = renderHook(() => useYaniv())

    act(() => result.current.setUp({ a: ['PK'] }, ['J1']))
    act(() => result.current.discardAndDraw('a', ['PK'], 'J1'))

    expect(result.current.hands).toStrictEqual({ a: ['J1'] })
    expect(result.current.stack).toStrictEqual([])
  })

  it('should discard and draw card from pile', () => {
    const { result } = renderHook(() => useYaniv())

    act(() => result.current.setUp({ a: ['PK'] }, ['J1']))
    // act(() => result.current.turnUp())
    act(() => result.current.discardAndDraw('a', ['PK'], 'J1'))

    expect(result.current.hands).toStrictEqual({ a: ['J1'] })
    expect(result.current.stack).toStrictEqual([])
    expect(result.current.pile).toStrictEqual([['PK']])
  })
})
