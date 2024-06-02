import {
  createSignal,
  onCleanup,
} from "https://cdn.skypack.dev/solid-js";
import { render } from "https://cdn.skypack.dev/solid-js/web";
import html from "https://cdn.skypack.dev/solid-js/html";

function Counter() {
  const [count, setCount] = createSignal(30);
  const increment = () => setCount((count) => count + 1);
  const [list, setList] = createSignal([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  ]);

  return html`
    <>
      <input
        type="range"
        value={count()}
        min={1}
        max={list().length}
        onInput={(e) => setCount(Number(e.target.value))}
      />
      {count()}
      <div
        style={{
          position: "relative",
          left: "300px",
          top: "300px",
          width: "300px",
          height: "300px",
          "transform-origin": "center center",
          transition: "transform .2s",
          transform: \`scale(${1 - (count() - 30) / list().length})\`,
        }}
      >
        <Index each={list()}>
          {(item, index) => (
            <div
              class="item"
              classList={{ item: true, selected: index + 1 === count() }}
              style={{
                width: 20 + (20 * index) / 12 + "px",
                height: 20 + (20 * index) / 12 + "px",
                position: "absolute",
                left:
                  Math.cos((22.5 * index * Math.PI) / 180) *
                  (60 + (60 * index) / 8) +
                  "px",
                top:
                  Math.sin((22.5 * index * Math.PI) / 180) *
                  (60 + (60 * index) / 8) +
                  "px",
                opacity: 1 - Math.abs(count() - index) / list().length,
              }}
            >
              <div
                class="background"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  transform: \`rotate(\$\{22.5 * index\}deg)\`,
                  border: "1px solid #000",
                }}
              />
              <button type="button" onClick={increment}>
                {index}
              </button>
            </div>
          )}
        </Index>
      </div>
    </>
  `;
}

render(Counter, document.getElementById("app"));