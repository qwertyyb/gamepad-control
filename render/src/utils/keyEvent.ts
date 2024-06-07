import { GamepadButtonEvent } from "./gamepad"

export type UnionKeydownEvent = CustomEvent<{ key: string}>

const keyEventMap = {
  ArrowUp: [
    { type: 'keyboard', key: 'ArrowUp' },
    { type: 'gamepad', button: 'Up' },
    { type: 'gamepad', button: 'LeftAxesUp' }
  ],
  ArrowDown: [
    { type: 'keyboard', key: 'ArrowDown' },
    { type: 'gamepad', button: 'Down' },
    { type: 'gamepad', button: 'LeftAxesDown' }
  ],
  ArrowLeft: [
    { type: 'keyboard', key: 'ArrowLeft' },
    { type: 'gamepad', button: 'Left' },
    { type: 'gamepad', button: 'LeftAxesLeft' }
  ],
  ArrowRight: [
    { type: 'keyboard', key: 'ArrowRight' },
    { type: 'gamepad', button: 'Right' },
    { type: 'gamepad', button: 'LeftAxesRight' }
  ],
  Enter: [
    { type: 'keyboard', key: 'Enter' },
    { type: 'gamepad', button: 'A' },
  ]
}

document.addEventListener('keydown', event => {
  const keyEventName = Object.keys(keyEventMap).find((eventName) => {
    return keyEventMap[eventName as keyof (typeof keyEventMap)].filter(item => item.type === 'keyboard' && item.key === event.key).length > 0
  })
  document.dispatchEvent(new CustomEvent('unionkeydown', { detail: { key: keyEventName } }))
})

document.addEventListener('gamepadbuttondown', event => {
  const { button } = (event as GamepadButtonEvent).detail
  const keyEventName = Object.keys(keyEventMap).find((eventName) => {
    return keyEventMap[eventName as keyof (typeof keyEventMap)].filter(item => item.type === 'gamepad' && item.button === button).length > 0
  })
  document.dispatchEvent(new CustomEvent('unionkeydown', { detail: { key: keyEventName } }))
})