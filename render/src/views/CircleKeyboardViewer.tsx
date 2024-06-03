import { Component, createMemo, createSignal, Index, onCleanup, onMount } from "solid-js";
import styles from './Keyboard.module.css'

const deg = 20
const minRadius = 60
const step = -1
const count = 360 / deg

const calcNextRadius = (base: number = minRadius) => {
  const size = 2 * Math.sin(deg / 2 * Math.PI / 180) * base;
  return base + size + step
}

const calcRadiusByCount = (index: number = 0, base: number = minRadius) => {
  let result = minRadius;
  for(let i = 0; i < index; i += 1) {
    result = calcNextRadius(result)
  }
  return result
}

export const CircleKeyboardViewer: Component = () => {
  const [selectedIndex, setSelectedIndex] = createSignal(30);
  const curCircle = createMemo(() => Math.floor(selectedIndex() / count))
  const [list, setList] = createSignal([
    { key: 'A' }, { key: 'B' }, { key: 'C' }, { key: 'D' }, { key: 'E' }, { key: 'F' },
    { key: 'G' }, { key: 'H' }, { key: 'I' }, { key: 'J' }, { key: 'K' }, { key: 'L' },
    { key: 'M' }, { key: 'N' }, { key: 'O' }, { key: 'P' }, { key: 'Q' }, { key: 'R' },
    { key: 'S' }, { key: 'T' }, { key: 'U' }, { key: 'V' }, { key: 'W' }, { key: 'X' },
    { key: 'Y' }, { key: 'Z' },
    { label: 0, key: 'NUMPAD_0' }, { label: 1, key: 'NUMPAD_1' }, { label: 2, key: 'NUMPAD_2' }, { label: 3, key: 'NUMPAD_3' },
    { label: 4, key: 'NUMPAD_4' }, { label: 5, key: 'NUMPAD_5' }, { label: 6, key: 'NUMPAD_6' }, { label: 7, key: 'NUMPAD_7' },
    { label: 8, key: 'NUMPAD_8' }, { label: 9, key: 'NUMPAD_9' },
    { label: '🔙', key: 'BACKSPACE' }, { label: '✔️', key: 'ENTER' }, { label: '␛', key: 'ESCAPE' }, { label: '␠', key: 'SPACE' },
    { label: '⏯️', key: 'PAUSE_BREAK' }, 
  ]);
  let animationFrameId = 0;

  const checkState = (index: number) => {
    const gamepad = navigator.getGamepads()[index]
    if (!gamepad) throw new Error(`Gamepad ${index} doesn\'t exist`)
    
    const [lx, ly, rx, ry] = gamepad.axes;
    if (Math.abs(rx) > 0.5 || Math.abs(ry) > 0.5) {
      const target = Math.floor((Math.round(Math.atan2(ry, rx) / Math.PI * 180) + 360  + deg / 2) % 360 / deg) + curCircle() * count
      setSelectedIndex(target)
    }

    animationFrameId = requestAnimationFrame(() => checkState(index))
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

  const onGamepadButtonDown = () => {
    toggleCircle()
  }

  onMount(() => {
    window.addEventListener('gamepadconnected', onGamepadConnected)
    window.addEventListener('gamepadbuttondown', onGamepadButtonDown)
  })

  onCleanup(() => {
    window.removeEventListener('gamepadconnected', onGamepadConnected)
    window.removeEventListener('gamepadbuttondown', onGamepadButtonDown)
    animationFrameId && cancelAnimationFrame(animationFrameId)
  })

  const toggleCircle = () => {
    let index = selectedIndex()
    if (index === list().length - 1) {
      index = 0
    } else {
      index = Math.min(list().length - 1, index + count)
    }
    setSelectedIndex(index)
  }

  return (
    <div class={styles.keyboardViewer}>
      <input
        type="range"
        value={selectedIndex()}
        min={0}
        max={list().length - 1}
        onInput={(e) => setSelectedIndex(Number(e.target.value))}
      />
      <button onClick={toggleCircle}>切换</button>
      {selectedIndex()}
      <div class={styles.keyboardWrapper}
        style={{
          transform: `scale(${5 - curCircle() * 1.6})`,
        }}
      >
        <Index each={list()}>
          {(item, index) => {
            const circleIndex = Math.floor((index) / count)
            const radius = calcRadiusByCount(circleIndex)
            const size = 2 * Math.sin(deg / 2 * Math.PI / 180) * radius * 0.9;
            return (
              <div
                class={styles.item}
                classList={{
                  [styles.deactivated]: index < curCircle() * count || index >= (curCircle() + 1) * count,
                  [styles.selected]: index === selectedIndex()
                }}
                style={{
                  '--item-size': `${size}px`,
                  'transform': `translateZ(${circleIndex * 40}px)`,
                  left:
                    Math.cos((deg * index - deg / 2) * Math.PI / 180) *
                      radius + "px",
                  top:
                    Math.sin((deg * index - deg / 2) * Math.PI / 180) *
                      radius + "px",
                }}
              >
                <div class={styles.itemBackground}
                  style={{
                    transform: `rotate(${deg * index}deg)`
                  }}
                >
                  <div class={styles.itemContent} style={{ transform: `rotate(${-deg * index}deg)` }}>
                    { item().label || item().key }
                  </div>
                </div>
              </div>
            )
          }}
        </Index>
      </div>
      </div>
  );
}
