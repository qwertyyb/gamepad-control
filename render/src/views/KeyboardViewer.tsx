import { Component, createSignal, Index, onCleanup, onMount } from "solid-js";
import styles from './Keyboard.module.css'

const deg = 20
const minRadius = 60
const step = 4

export const KeyboardViewer: Component = () => {
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
          {(item, index) => (
            <div
              class={styles.item}
              classList={{ [styles.selected]: index === count() }}
              style={{
                '--item-size': 2 * Math.PI * (minRadius + step * index) / deg * 0.9 + "px",
                left:
                  Math.cos((deg * index - 0.5 * deg) * Math.PI / 180) *
                    (minRadius + step * index) + 
                  "px",
                top:
                  Math.sin((deg * index - 0.5 * deg) * Math.PI / 180) *
                    (minRadius + step * index) +
                  "px",
                opacity: 1 - Math.abs(count() - index) / Math.min(20, list().length),
              }}
            >
              <div class={styles.itemBackground}
                style={{
                  transform: `rotate(${20 * index}deg)`
                }}></div>
              <div class={styles.itemContent}>
                { item().key }
              </div>
            </div>
          )}
        </Index>
      </div>
      </div>
  );
}
