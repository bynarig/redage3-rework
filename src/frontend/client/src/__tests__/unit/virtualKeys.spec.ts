import { describe, it, expect, beforeEach } from 'vitest'
import { mpStub } from '../setup/mp-globals'
import { VirtualKeys } from '@/src/utils/virtualKeys/VirtualKeys'
import type { VirtualKeyCode } from '@/src/utils/virtualKeys/VirtualKeys'

describe('VirtualKeys.toCode', () => {
  it('maps KEY_W to 0x57', () => {
    expect(VirtualKeys.toCode('KEY_W')).toBe(0x57)
  })

  it('maps VK_SPACE to 0x20', () => {
    expect(VirtualKeys.toCode('VK_SPACE')).toBe(0x20)
  })

  it('maps VK_LBUTTON to 0x01', () => {
    expect(VirtualKeys.toCode('VK_LBUTTON')).toBe(0x01)
  })

  it('maps VK_CONTROL to 0x11', () => {
    expect(VirtualKeys.toCode('VK_CONTROL')).toBe(0x11)
  })

  it('maps VK_OEM_PLUS to 0xbb', () => {
    expect(VirtualKeys.toCode('VK_OEM_PLUS')).toBe(0xbb)
  })

  it('maps VK_OEM_MINUS to 0xbd', () => {
    expect(VirtualKeys.toCode('VK_OEM_MINUS')).toBe(0xbd)
  })

  it('maps VK_NUMPAD8 to 0x68', () => {
    expect(VirtualKeys.toCode('VK_NUMPAD8')).toBe(0x68)
  })
})

describe('VirtualKeys.toKey', () => {
  it('maps 0x57 to KEY_W', () => {
    expect(VirtualKeys.toKey(0x57 as VirtualKeyCode)).toBe('KEY_W')
  })

  it('maps 0x20 to VK_SPACE', () => {
    expect(VirtualKeys.toKey(0x20 as VirtualKeyCode)).toBe('VK_SPACE')
  })

  it('maps 0x11 to VK_CONTROL', () => {
    expect(VirtualKeys.toKey(0x11 as VirtualKeyCode)).toBe('VK_CONTROL')
  })
})

describe('VirtualKeys roundtrip', () => {
  it('toKey(toCode(KEY_A)) === KEY_A', () => {
    expect(VirtualKeys.toKey(VirtualKeys.toCode('KEY_A'))).toBe('KEY_A')
  })

  it('toKey(toCode(VK_CONTROL)) === VK_CONTROL', () => {
    expect(VirtualKeys.toKey(VirtualKeys.toCode('VK_CONTROL'))).toBe('VK_CONTROL')
  })

  it('toKey(toCode(VK_NUMPAD8)) === VK_NUMPAD8', () => {
    expect(VirtualKeys.toKey(VirtualKeys.toCode('VK_NUMPAD8'))).toBe('VK_NUMPAD8')
  })
})

describe('VirtualKeys.isDown', () => {
  beforeEach(() => {
    mpStub.keys.isDown.mockReset()
  })

  it('returns true when mp.keys.isDown returns true', () => {
    mpStub.keys.isDown.mockReturnValue(true)
    expect(VirtualKeys.isDown('VK_SPACE')).toBe(true)
  })

  it('returns false when key is not pressed', () => {
    mpStub.keys.isDown.mockReturnValue(false)
    expect(VirtualKeys.isDown('KEY_W')).toBe(false)
  })

  it('calls mp.keys.isDown with the correct VK code for KEY_W', () => {
    mpStub.keys.isDown.mockReturnValue(false)
    VirtualKeys.isDown('KEY_W')
    expect(mpStub.keys.isDown).toHaveBeenCalledWith(0x57)
  })

  it('calls mp.keys.isDown with the correct VK code for VK_SPACE', () => {
    mpStub.keys.isDown.mockReturnValue(false)
    VirtualKeys.isDown('VK_SPACE')
    expect(mpStub.keys.isDown).toHaveBeenCalledWith(0x20)
  })
})
