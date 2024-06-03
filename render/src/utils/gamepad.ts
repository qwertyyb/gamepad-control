export enum AxesDirection {
  Left = 4,
  LeftTop = -3,
  Top = -2,
  RightTop = -1,
  Right = 0,
  RightBottom = 1,
  Bottom = 2,
  LeftBottom = 3,
}

let prevBtns: Record<string, boolean> | null = null
let prevAxes: { l: AxesDirection, r: AxesDirection } | null = null
const checkState = (index: number) => {
  const gamepad = navigator.getGamepads()[index]
  if (!gamepad) throw new Error(`Gamepad ${index} doesn\'t exist`)
  
  // 判断哪个键按下或释放了，并抛出事件
  const btns = gamepad.buttons.reduce((acc, btn, index) => {
    return {
      ...acc,
      [index]: btn.pressed
    }
  }, {} as Record<string, boolean>)
  if (prevBtns) {
    const diff = Object.keys(btns).reduce((acc, key) => {
      if (btns[key] !== prevBtns![key]) {
        return [...acc, key]
      }
      return acc
    }, [] as string[])
    diff.forEach(key => {
      window.dispatchEvent(new CustomEvent(btns[key] ? 'gamepadbuttondown' : 'gamepadbuttonup', { detail: { button: key } }))
    })
  }

  // 判断方向有没有变化，支持八个方向 8 个方向为，-3 ~ 4
  const [lh, lv, rh, rv] = gamepad.axes
  const step = Math.PI / 180 * 45
  let ldirection = Math.floor((Math.atan2(lv, lh) + step / 2) / step)
  ldirection = ldirection === -4 ? 4 : ldirection
  let rdirection = Math.floor((Math.atan2(lv, lh) + step / 2) / step)
  rdirection = rdirection === -4 ? 4 : rdirection
  const axes = { l: ldirection, r: rdirection }

  if (prevAxes) {
    if (prevAxes.l !== axes.l) {
      window.dispatchEvent(new CustomEvent('gamepadaxeschange', { detail: { type: 'left', value: axes.l } }))
    }
    if (prevAxes.r !== axes.r) {
      window.dispatchEvent(new CustomEvent('gamepadaxeschange', { detail: { type: 'right', value: axes.r } }))
    }
  }

  prevBtns = btns
  prevAxes = axes

  requestAnimationFrame(() => checkState(index))
}

const onGamepadConnected = (event: GamepadEvent) => {
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    event.gamepad.index,
    event.gamepad.id,
    event.gamepad.buttons.length,
    event.gamepad.axes.length,
  );
  checkState(event.gamepad.index)
}

window.addEventListener('gamepadconnected', onGamepadConnected)

export type GamepadButtonEvent = CustomEvent<{ button: string }>
export type GamepadAxesChangeEvent = CustomEvent<{ type: 'left' | 'right', value: AxesDirection }>