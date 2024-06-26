import { Component, Index, createSignal, onCleanup, onMount } from "solid-js";
import styles from './Home.module.css'
import tencent from '../../assets/tencent.png'
import youku from '../../assets/youku.png'
import iqiyi from '../../assets/iqiyi.png'
import bilibili from '../../assets/bilibili.png'
import mgtv from '../../assets/mgtv.png'
import mirror from '../../assets/mirror.png'
import { AxesDirection, GamepadAxesChangeEvent, GamepadButtonEvent } from "../../utils/gamepad";

interface AppItem {
  image: string,
  title: string,
  url?: string
}

export const Home: Component = () => {
  const [selectedIndex, setSelectedIndex] = createSignal(0)
  const [list] = createSignal<AppItem[]>([
    { image: tencent, title: '腾讯视频', url: 'https://v.qq.com' },
    { image: youku, title: '优酷视频', url: 'https://youku.com' },
    { image: iqiyi, title: '爱奇艺', url: 'https://iqiyi.com' },
    { image: bilibili, title: '哔哩哔哩', url: 'https://bilibili.com' },
    { image: mgtv, title: '芒果TV', url: 'https://mgtv.com' },
    { image: mirror, title: '投屏' },
  ])
  let appListEl: HTMLUListElement | null = null;

  const axesHandler = (event: GamepadAxesChangeEvent) => {
    const { type, value } = event.detail
    console.log(type, value)
    if (type === 'right') return
    if (value === AxesDirection.Left) {
      setSelectedIndex((selectedIndex() - 1 + list().length) % list().length)
    } else if (value === AxesDirection.Right) {
      setSelectedIndex((selectedIndex() + 1) % list().length)
    }
  }

  const keyHandler = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      setSelectedIndex((selectedIndex() - 1 + list().length) % list().length)
    } else if (event.key === 'ArrowRight') {
      setSelectedIndex((selectedIndex() + 1) % list().length)
    } else if (event.key === 'Enter') {
      onItemTap(selectedIndex())
    } else if (event.key === 'ArrowUp') {
      const columns = window.getComputedStyle(appListEl!).getPropertyValue('grid-template-columns').split(' ').length
      setSelectedIndex(Math.max(0, selectedIndex() - columns))
    } else if (event.key === 'ArrowDown') {
      const columns = window.getComputedStyle(appListEl!).getPropertyValue('grid-template-columns').split(' ').length
      setSelectedIndex(Math.min(list().length - 1, selectedIndex() + columns))
    }
  }

  const onGamepadButtonDown = (event: GamepadButtonEvent) => {
    if (event.detail.button === 'A') {
      onItemTap(selectedIndex())
    } else if (event.detail.button === 'Left') {
      setSelectedIndex((selectedIndex() - 1 + list().length) % list().length)
    } else if (event.detail.button === 'Right') {
      setSelectedIndex((selectedIndex() + 1) % list().length)
    }
  }

  const onItemTap = (index: number) => {
    setSelectedIndex(index)
    const item = list()[index]
    if (item.url) {
      window.open(item.url, item.title)
    }
  }

  onMount(() => {
    window.addEventListener('gamepadaxeschange', axesHandler as (event: Event) => void)
    window.addEventListener('gamepadbuttondown', onGamepadButtonDown as (event: Event) => void)
    window.addEventListener('keydown', keyHandler);
  })
  onCleanup(() => {
    window.removeEventListener('gamepadaxeschange', axesHandler as (event: Event) => void)
    window.removeEventListener('gamepadbuttondown', onGamepadButtonDown as (event: Event) => void)
    window.removeEventListener('keydown', keyHandler);
  })

  return (
    <div class={styles.home}>
      <ul class={styles.appList} ref={appListEl!}>
        <Index each={list()}>
          {(item, index) => (
              <li
                onClick={() => onItemTap(index)}
                class={styles.appItem}
                classList={{ [styles.selected]: index === selectedIndex() }}>
                  <a href="javascript:void(0)">
                    <img class={styles.cover} src={item().image} />
                    <h3 class={styles.title}>{item().title}</h3>
                  </a>
              </li>
          )}
        </Index>
      </ul>
    </div>
  )
}
