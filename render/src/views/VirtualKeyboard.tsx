import { Component, onCleanup, onMount } from "solid-js"
import styles from './VirtualKeyboard.module.css'
import { UnionKeydownEvent } from "../utils/keyEvent"

const getCandidate = (candidates: HTMLCollection | HTMLElement[], curPoint: {x: number, y:number}) => {
  let minDistance = Number.MAX_SAFE_INTEGER
  let minIndex = -1
  Array.from(candidates).forEach((dom, index) => {
    const rect = dom.getBoundingClientRect()
    const point = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    const d = (point.x - curPoint.x) ** 2 + (point.y - curPoint.y) ** 2
    if (d < minDistance) {
      minIndex = index
      minDistance = d
    }
  })
  return minIndex
}

export const VirtualKeyboard: Component = () => {
  let el: HTMLDivElement

  const onKeyDown = (event: UnionKeydownEvent) => {
    const { key } = event.detail
    const cur = el.getElementsByClassName(styles.selected)[0] as HTMLElement
    if (!cur) return;
    const curRect = cur.getBoundingClientRect()
    const curPoint = { x: curRect.left + curRect.width / 2, y: curRect.top + curRect.height / 2 }
    const curRow = cur.parentElement!
    if (key === 'ArrowUp') {
      const prevRow = curRow?.previousElementSibling
      if (!prevRow) return;

      const index = getCandidate(prevRow.children, curPoint)
      if (index >= 0) {
        cur.classList.remove(styles.selected)
        prevRow.children[index].classList.add(styles.selected)
      }
    } else if (key === 'ArrowDown') {
      const nextRow = curRow?.nextElementSibling
      if (!nextRow) return;

      const index = getCandidate(nextRow.children, curPoint)
      if (index >= 0) {
        cur.classList.remove(styles.selected)
        nextRow.children[index].classList.add(styles.selected)
      }
    } else if (key === 'ArrowLeft') {
      const children = Array.from(curRow.children)
      const curIndex = children.indexOf(cur)
      if (curIndex <= 0) return;
      cur.classList.remove(styles.selected)
      children[curIndex - 1].classList.add(styles.selected)
    } else if (key === 'ArrowRight') {
      const children = Array.from(curRow.children)
      const curIndex = children.indexOf(cur)
      if (curIndex >= children.length - 1) return;
      cur.classList.remove(styles.selected)
      children[curIndex + 1].classList.add(styles.selected)
    } else if (key === 'Enter') {
      cur.click()
      cur.classList.add(styles.active)
      setTimeout(() => {
        cur.classList.remove(styles.active)
      }, 200)
    }
  }

  onMount(() => {
    document.addEventListener('unionkeydown', onKeyDown as (event: Event) => void, true)
  })

  onCleanup(() => {
    document.removeEventListener('unionkeydown', onKeyDown as (event: Event) => void, true)
  })

  return (
    <div class={styles.box1} ref={el!}>
      <div class={styles.keyboard}>
        <ul class={styles.keys + ' ' + styles.two}>
          <li class={styles.keyboardItem + ' ' + styles.esc}>Esc</li>
          <li class={styles.keyboardItem}>F1</li>
          <li class={styles.keyboardItem}>F2</li>
          <li class={styles.keyboardItem}>F3</li>
          <li class={styles.keyboardItem}>F4</li>
          <li class={styles.keyboardItem}>F5</li>
          <li class={styles.keyboardItem}>F6</li>
          <li class={styles.keyboardItem}>F7</li>
          <li class={styles.keyboardItem}>F8</li>
          <li class={styles.keyboardItem}>F9</li>
          <li class={styles.keyboardItem}>F10</li>
          <li class={styles.keyboardItem}>F11</li>
          <li class={styles.keyboardItem}>F12</li>
          <li class={styles.keyboardItem + ' ' + styles.prc}>Prc</li>
        </ul>
        <ul class={styles.keys + ' ' + styles.two}>
          <li class={styles.keyboardItem}>`</li>
          <li class={styles.keyboardItem}>1</li>
          <li class={styles.keyboardItem}>2</li>
          <li class={styles.keyboardItem}>3</li>
          <li class={styles.keyboardItem}>4</li>
          <li class={styles.keyboardItem}>5</li>
          <li class={styles.keyboardItem}>6</li>
          <li class={styles.keyboardItem}>7</li>
          <li class={styles.keyboardItem}>8</li>
          <li class={styles.keyboardItem}>9</li>
          <li class={styles.keyboardItem}>10</li>
          <li class={styles.keyboardItem}>-</li>
          <li class={styles.keyboardItem}>=</li>
          <li class={styles.keyboardItem + ' ' + styles.back}>←</li>
        </ul>
        <ul class={styles.keys + ' ' + styles.three}>
          <li class={styles.keyboardItem + ' ' + styles.tab}>Tab⇥</li>
          <li class={styles.keyboardItem}>Q</li>
          <li class={styles.keyboardItem}>W</li>
          <li class={styles.keyboardItem}>E</li>
          <li class={styles.keyboardItem}>R</li>
          <li class={styles.keyboardItem}>T</li>
          <li class={styles.keyboardItem}>Y</li>
          <li class={styles.keyboardItem}>U</li>
          <li class={styles.keyboardItem}>I</li>
          <li class={styles.keyboardItem}>O</li>
          <li class={styles.keyboardItem}>P</li>
          <li class={styles.keyboardItem}>[</li>
          <li class={styles.keyboardItem}>]</li>
          <li class={styles.keyboardItem}>\</li>
        </ul>
        <ul class={styles.keys + ' ' + styles.four}>
          <li class={styles.keyboardItem + ' ' + styles.caps}>Caps⇧</li>
          <li class={styles.keyboardItem + ' ' + styles.selected}>A</li>
          <li class={styles.keyboardItem}>S</li>
          <li class={styles.keyboardItem}>D</li>
          <li class={styles.keyboardItem}>F</li>
          <li class={styles.keyboardItem}>G</li>
          <li class={styles.keyboardItem}>H</li>
          <li class={styles.keyboardItem}>J</li>
          <li class={styles.keyboardItem}>K</li>
          <li class={styles.keyboardItem}>L</li>
          <li class={styles.keyboardItem}>;</li>
          <li class={styles.keyboardItem}>'</li>
          <li class={styles.keyboardItem + ' ' + styles.enter}>Enter ⏎</li>
        </ul>
        <ul class={styles.keys + ' ' + styles.five}>
          <li class={styles.keyboardItem + ' ' + styles.shift}>Shift↑</li>
          <li class={styles.keyboardItem}>Z</li>
          <li class={styles.keyboardItem}>X</li>
          <li class={styles.keyboardItem}>C</li>
          <li class={styles.keyboardItem}>V</li>
          <li class={styles.keyboardItem}>B</li>
          <li class={styles.keyboardItem}>N</li>
          <li class={styles.keyboardItem}>M</li>
          <li class={styles.keyboardItem}>,</li>
          <li class={styles.keyboardItem}>.</li>
          <li class={styles.keyboardItem}>/</li>
          <li class={styles.keyboardItem + ' ' + styles.shift}>Shift↑</li>
        </ul>
        <ul class={styles.keys + ' ' + styles.fix}>
          <li class={styles.keyboardItem + ' ' + styles.ctrl}>Ctrl⌃</li>
          <li class={styles.keyboardItem + ' ' + styles.alt}>Alt⌥</li>
          {/* <li class={styles.fn}>Fn</li> */}
          <li class={styles.keyboardItem + ' ' + styles.win}>Win⌘</li>
          <li class={styles.keyboardItem + ' ' + styles.space}>Space</li>
          <li class={styles.keyboardItem + ' ' + styles.alt}>Alt⌥</li>
          <li class={styles.keyboardItem + ' ' + styles.menu}>Menu</li>
          <li class={styles.keyboardItem + ' ' + styles.ctrl}>Ctrl⌃</li>
        </ul>
      </div>
    </div>
  );
}