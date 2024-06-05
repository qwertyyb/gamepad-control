import { Component } from "solid-js"
import styles from './VirtualKeyboard.module.css'

export const VirtualKeyboard: Component = () => {

  return (
    <div class={styles.box1}>
      <div class={styles.keyboard}>
        <ul class={styles.keys + ' ' + styles.two}>
          <li class={styles.esc}>Esc</li>
          <li>F1</li>
          <li>F2</li>
          <li>F3</li>
          <li>F4</li>
          <li>F5</li>
          <li>F6</li>
          <li>F7</li>
          <li>F8</li>
          <li>F9</li>
          <li>F10</li>
          <li>F11</li>
          <li>F12</li>
          <li>Prc</li>
        </ul>
        <ul class={styles.keys + ' ' + styles.two}>
          <li>`</li>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
          <li>7</li>
          <li>8</li>
          <li>9</li>
          <li>10</li>
          <li>-</li>
          <li>=</li>
          <li class={styles.back}>←</li>
        </ul>
        <ul class={styles.keys + ' ' + styles.three}>
          <li class={styles.tab}>Tab⇥</li>
          <li>Q</li>
          <li>W</li>
          <li>E</li>
          <li>R</li>
          <li>T</li>
          <li>Y</li>
          <li>U</li>
          <li>I</li>
          <li>O</li>
          <li>P</li>
          <li>[</li>
          <li>]</li>
          <li>\</li>
        </ul>
        <ul class={styles.keys + ' ' + styles.four}>
          <li class={styles.caps}>Caps⇧</li>
          <li>A</li>
          <li>S</li>
          <li>D</li>
          <li>F</li>
          <li>G</li>
          <li>H</li>
          <li>J</li>
          <li>K</li>
          <li>L</li>
          <li>;</li>
          <li>'</li>
          <li class={styles.enter}>Enter ⏎</li>
        </ul>
        <ul class={styles.keys + ' ' + styles.five}>
          <li class={styles.shift}>Shift↑</li>
          <li>Z</li>
          <li>X</li>
          <li>C</li>
          <li>V</li>
          <li>B</li>
          <li>N</li>
          <li>M</li>
          <li>,</li>
          <li>.</li>
          <li>/</li>
          <li class={styles.shift}>Shift↑</li>
        </ul>
        <ul class={styles.keys + ' ' + styles.fix}>
          <li class={styles.ctrl}>Ctrl⌃</li>
          <li class={styles.alt}>Alt⌥</li>
          {/* <li class={styles.fn}>Fn</li> */}
          <li class={styles.win}>Win⌘</li>
          <li class={styles.space}>Space</li>
          <li class={styles.alt}>Alt⌥</li>
          <li class={styles.menu}>Menu</li>
          <li class={styles.ctrl}>Ctrl⌃</li>
        </ul>
      </div>
    </div>
  );
}