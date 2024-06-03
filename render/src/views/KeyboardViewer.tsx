import { Component, createSignal, Index, onCleanup, onMount } from "solid-js";
import styles from './Keyboard.module.css'
import { GamepadButtonEvent } from "../utils/gamepad";

const deg = 20
const minRadius = 60
const step = 4

interface KeyItem {
  key: string
  label?: string
}

export const KeyboardViewer: Component = () => {
  const [selectedIndex, setSelectedIndex] = createSignal(30);
  const [list] = createSignal([
    { key: 'A' }, { key: 'B' }, { key: 'C' }, { key: 'D' }, { key: 'E' }, { key: 'F' },
    { key: 'G' }, { key: 'H' }, { key: 'I' }, { key: 'J' }, { key: 'K' }, { key: 'L' },
    { key: 'M' }, { key: 'N' }, { key: 'O' }, { key: 'P' }, { key: 'Q' }, { key: 'R' },
    { key: 'S' }, { key: 'T' }, { key: 'U' }, { key: 'V' }, { key: 'W' }, { key: 'X' },
    { key: 'Y' }, { key: 'Z' },
    { label: '0', key: 'NUMPAD_0' }, { label: 1, key: 'NUMPAD_1' }, { label: 2, key: 'NUMPAD_2' }, { label: 3, key: 'NUMPAD_3' },
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
    if (Math.abs(lx) > 0.5 || Math.abs(ly) > 0.5) {
      const target = Math.floor((Math.round(Math.atan2(ly, lx) / Math.PI * 180) + 360  + deg / 2) % 360 / deg);
      const candidates = new Array(5).fill(0)
        .map((_, index) => (360 / deg) * index + target)
        .filter(candidate => candidate < list().length)
      let minDistance = Number.MAX_SAFE_INTEGER;
      let minIndex = -1;
      for(let i = 0; i < candidates.length; i += 1) {
        const distance = Math.abs(candidates[i] - selectedIndex())
        if (distance < minDistance) {
          minDistance = distance
          minIndex = i;
        }
      }
      setSelectedIndex(candidates[minIndex])
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

  const onGamepadButtonDown = (event: GamepadButtonEvent) => {
    console.log(event.detail)
    if (event.detail.button === 'A') {
      onItemTap(selectedIndex())
    } else if (event.detail.button === 'B') {
      window.GamepadControllerJSBridge?.keydown('BACKSPACE')
    }
  }

  const onItemTap = (index: number) => {
    setSelectedIndex(index)
    const item = list()[selectedIndex()]
    window.GamepadControllerJSBridge?.keydown(item.key)
  }

  onMount(() => {
    window.addEventListener('gamepadconnected', onGamepadConnected)
    window.addEventListener('gamepadbuttondown', onGamepadButtonDown as (event: Event) => void)
  })

  onCleanup(() => {
    window.removeEventListener('gamepadconnected', onGamepadConnected)
    window.removeEventListener('gamepadbuttondown', onGamepadButtonDown as (event: Event) => void)
    animationFrameId && cancelAnimationFrame(animationFrameId)
  })

  return (
    <div class={styles.keyboardViewer}>
      <input
        type="range"
        value={selectedIndex()}
        min={0}
        max={list().length - 1}
        onInput={(e) => setSelectedIndex(Number(e.target.value))}
      />
      {selectedIndex()}
      <div class={styles.keyboardWrapper}
        style={{
          transform: `scale(${0.6 - (selectedIndex() - 40) / list().length / 0.3})`,
        }}
      >
        <Index each={list()}>
          {(item, index) => (
            <div
              onClick={() => onItemTap(index)}
              class={styles.item}
              classList={{ [styles.selected]: index === selectedIndex() }}
              style={{
                '--item-size': 2 * Math.PI * (minRadius + step * index) / deg * 0.9 + "px",
                'transform': `translateZ(${deg * index * 0.1}px)`,
                left:
                  Math.cos((deg * index - 0.5 * deg) * Math.PI / 180) *
                    (minRadius + step * index) + 
                  "px",
                top:
                  Math.sin((deg * index - 0.5 * deg) * Math.PI / 180) *
                    (minRadius + step * index) +
                  "px",
                opacity: 1 - Math.abs(selectedIndex() - index) / Math.min(20, list().length),
              }}
            >
              <div class={styles.itemBackground}
                style={{
                  transform: `rotate(${20 * index}deg)`
                }}
              >
                <div class={styles.itemContent} style={{ transform: `rotate(${-deg * index}deg)` }}>
                  { item().label || item().key }
                </div>
              </div>
            </div>
          )}
        </Index>
      </div>
      </div>
  );
}
