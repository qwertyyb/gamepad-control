export enum AxesDirection {
  Left = 4,
  LeftTop = -3,
  Top = -2,
  RightTop = -1,
  Right = 0,
  RightBottom = 1,
  Bottom = 2,
  LeftBottom = 3,
  None = -10
}

const nsProProfile = {
  btns: {
    0: 'B',
    1: 'A',
    2: 'Y',
    3: 'X',

    4: 'L',
    5: 'R',
    6: 'ZL',
    7: 'ZR',

    8: 'Mins',
    9: 'Plus',

    10: 'LeftStick',
    11: 'RightStick',

    12: 'Up',
    13: 'Down',
    14: 'Left',
    15: 'Right',

    16: 'Home',
    17: 'Screenshot',
  } as Record<string, string>
}

const getDirectionFromValue = (value: AxesDirection) => {
  return Object.keys(AxesDirection).find(key => (AxesDirection as any)[key] === value)
}

let prevBtns: Record<string, boolean> = Object.keys(nsProProfile.btns).reduce((acc, index) => ({ ...acc, [index]: false }), {})
let prevAxes: { l: AxesDirection, r: AxesDirection } = { l: AxesDirection.None, r: AxesDirection.None }
const deadzone = 0.4
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
      window.dispatchEvent(new CustomEvent(btns[key] ? 'gamepadbuttondown' : 'gamepadbuttonup', { detail: { button: nsProProfile.btns[key] || key } }))
    })
  }

  // 判断方向有没有变化，支持八个方向 8 个方向为，-3 ~ 4
  const [lh, lv, rh, rv] = gamepad.axes
  const step = Math.PI / 180 * 45
  let ldirection = (Math.abs(lh) > deadzone || Math.abs(lv) > deadzone) ? Math.floor((Math.atan2(lv, lh) + step / 2) / step) : AxesDirection.None
  ldirection = ldirection === -4 ? 4 : ldirection
  let rdirection = (Math.abs(rh) > deadzone || Math.abs(rv) > deadzone) ? Math.floor((Math.atan2(lv, lh) + step / 2) / step) : AxesDirection.None
  rdirection = rdirection === -4 ? 4 : rdirection
  const axes = { l: ldirection, r: rdirection }

  if (prevAxes) {
    if (axes.l !== AxesDirection.None && prevAxes.l !== axes.l) {
      window.dispatchEvent(
        new CustomEvent(
          axes.l === AxesDirection.None ? 'gamepadbuttonup' : 'gamepadbuttondown',
          { detail: { button: 'LeftAxes' + getDirectionFromValue(axes.l) } }
        )
      )
    }
    if (prevAxes.r !== axes.r) {
      window.dispatchEvent(
        new CustomEvent(
          axes.r === AxesDirection.None ? 'gamepadbuttonup' : 'gamepadbuttondown',
          { detail: { button: 'LeftAxes' + getDirectionFromValue(axes.r) } }
        )
      )
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
