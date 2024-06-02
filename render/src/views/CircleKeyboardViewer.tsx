import { Component, createSignal, Index, onCleanup, onMount } from "solid-js";
import styles from './Keyboard.module.css'

const deg = 20
const minRadius = 60
const step = 24

export const CircleKeyboardViewer: Component = () => {
  const [count, setCount] = createSignal(10);
  const [list, setList] = createSignal([
    { key: 'A' }, { key: 'B' }, { key: 'C' }, { key: 'D' }, { key: 'E' }, { key: 'F' },
    { key: 'G' }, { key: 'H' }, { key: 'I' }, { key: 'J' }, { key: 'K' }, { key: 'L' },
    { key: 'M' }, { key: 'N' }, { key: 'O' }, { key: 'P' }, { key: 'Q' }, { key: 'R' },
    { key: 'S' }, { key: 'T' }, { key: 'U' }, { key: 'V' }, { key: 'W' }, { key: 'X' },
    { key: 'Y' }, { key: 'Z' },
    { key: '0' }, { key: '1' }, { key: '2' }, { key: '3' }, { key: '4' }, { key: '5' },
    { key: '6' }, { key: '7' }, { key: '8' }, { key: '9' },
  ]);
  let animationFrameId = 0;
  let previousDeg = 0

  const checkState = (index: number) => {
    const gamepad = navigator.getGamepads()[index]
    if (!gamepad) throw new Error(`Gamepad ${index} doesn\'t exist`)
    
    const [lx, ly, rx, ry] = gamepad.axes;
    if (Math.abs(rx) > 0.5 || Math.abs(ry) > 0.5) {
      const target = Math.floor((Math.round(Math.atan2(ry, rx) / Math.PI * 180) + 360  + deg / 2) % 360 / deg);
      const candidates = new Array(5).fill(0)
        .map((_, index) => (360 / deg) * index + target)
        .filter(candidate => candidate < list().length)
      let minDistance = Number.MAX_SAFE_INTEGER;
      let minIndex = -1;
      for(let i = 0; i < candidates.length; i += 1) {
        const distance = Math.abs(candidates[i] - count())
        if (distance < minDistance) {
          minDistance = distance
          minIndex = i;
        }
      }
      setCount(candidates[minIndex])
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

  onMount(() => {
    window.addEventListener('gamepadconnected', onGamepadConnected)
  })

  onCleanup(() => {
    window.removeEventListener('gamepadconnected', onGamepadConnected)
    animationFrameId && cancelAnimationFrame(animationFrameId)
  })

  return (
    <div class={styles.keyboardViewer}>
      <input
        type="range"
        value={count()}
        min={1}
        max={list().length}
        onInput={(e) => setCount(Number(e.target.value))}
      />
      {count()}
      <div class={styles.keyboardWrapper}
        style={{
          transform: `scale(${1.6 - (count() - 40) / list().length / 0.3})`,
        }}
      >
        <Index each={list()}>
          {(item, index) => {
            const radius = minRadius + step * Math.floor((index) / (360/deg))
            const size = (2 * Math.PI * radius / 360 * deg * 0.8).toFixed(2)
            console.log(radius)
            return (
              <div
                class={styles.item}
                classList={{ [styles.selected]: index === count() }}
                style={{
                  '--item-size': `${size}px`,
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
                    transform: `rotate(${deg * index - deg / 2}deg)`
                  }}></div>
                <div class={styles.itemContent}>
                  { item().key }
                </div>
              </div>
            )
          }}
        </Index>
      </div>
      </div>
  );
}
