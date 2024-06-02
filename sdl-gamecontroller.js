const gamecontroller = require("sdl2-gamecontroller");
const robotjs = require('robotjs')

gamecontroller.on("error", (data) => console.log("error", data));
gamecontroller.on("warning", (data) => console.log("warning", data));
gamecontroller.on("sdl-init", () => console.log("SDL2 Initialized"));
// gamecontroller.on("a:down", (data) => {
//   robotjs.mouseClick('left', false)
// });
gamecontroller.on("controller-button-down", (data) => {
  console.log(data)
});