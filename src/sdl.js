const sdl = require('@kmamal/sdl')
const bot = require('../../suchibot');
const EventEmitter = require('events')

const eventBus = new EventEmitter()

const onLeftTrigger = (state) => {
  console.log('onLeftTrigger', state)
  eventBus.emit(state === 'down' ? 'buttonDown' : 'buttonUp', { button: 'leftTrigger' })
}

const onRightTrigger = (state) => {
  console.log('onRightTrigger', state)
  eventBus.emit(state === 'down' ? 'buttonDown' : 'buttonUp', { button: 'rightTrigger' })
}

const deadZone = 0.3
const triggerDeadZone = 0.5
const prevTriggerState = { left: false, right: false }
const detectAndMoveMouse = (controller) => {
  const { leftStickX, leftStickY, rightStickX, rightStickY, leftTrigger, rightTrigger } = controller.axes;
  if (Math.abs(leftStickX) >= deadZone || Math.abs(leftStickY) >= deadZone) {
    const deltaX = leftStickX * (1 - deadZone) * 30
    const deltaY = leftStickY * (1 - deadZone) * 30
    const { x, y } = bot.Mouse.getPosition()
    bot.Mouse.moveTo(x + deltaX, y + deltaY)
  }
  if (Math.abs(rightStickX) >= deadZone || Math.abs(rightStickY) >= deadZone) {
    const deltaX = rightStickX * (1 - deadZone) * 30
    const deltaY = rightStickY * (1 - deadZone) * 30
    bot.Mouse.scroll({ x: deltaX, y: deltaY })
  }

  const leftTriggerDown = leftTrigger > triggerDeadZone
  const rightTriggerDown = rightTrigger > triggerDeadZone
  if (leftTriggerDown && !prevTriggerState.left) {
    onLeftTrigger('down')
  } else if (!leftTriggerDown && prevTriggerState.left) {
    onLeftTrigger('up')
  }
  if (rightTriggerDown && !prevTriggerState.right) {
    onRightTrigger('down')
  } else if (!rightTriggerDown && prevTriggerState.right) {
    onRightTrigger('up')
  }
  prevTriggerState.left = leftTriggerDown
  prevTriggerState.right = rightTriggerDown

  setTimeout(() => detectAndMoveMouse(controller), 16)
}

const start = async () => {
  const controller = sdl.controller.openDevice(sdl.controller.devices[0])

  controller.on('buttonDown', event => {
    console.log('buttonDown', event)
    if (event.button === 'a') {
      bot.Mouse.hold(bot.MouseButton.LEFT)
    } else if (event.button === 'y') {
      bot.Mouse.click(bot.MouseButton.RIGHT)
    } else if (event.button === 'dpadLeft') {
      const { x, y } = bot.Mouse.getPosition()
      bot.Mouse.moveTo(x - 5, y)
    } else if (event.button === 'dpadRight') {
      const { x, y } = bot.Mouse.getPosition()
      bot.Mouse.moveTo(x + 5, y)
    } else if (event.button === 'dpadUp') {
      const { x, y } = bot.Mouse.getPosition()
      bot.Mouse.moveTo(x, y - 5)
    } else if (event.button === 'dpadDown') {
      const { x, y } = bot.Mouse.getPosition()
      bot.Mouse.moveTo(x, y + 5)
    } else if (event.button === 'x') {
      // 关闭
      bot.Keyboard.hold(bot.Key.LEFT_COMMAND)
      bot.Keyboard.tap(bot.Key.W)
      bot.Keyboard.release(bot.Key.LEFT_COMMAND)
    } else if (event.button === 'leftShoulder') {
      bot.Keyboard.tap(bot.Key.ESCAPE)
    } else if (event.button === 'rightShoulder') {
      bot.Keyboard.hold(bot.Key.LEFT_ALT)
      bot.Keyboard.hold(bot.Key.LEFT_COMMAND)
      // bot.Keyboard.hold(bot.Key)
      bot.Keyboard.tap(bot.Key.F)
      bot.Keyboard.release(bot.Key.LEFT_COMMAND)
      bot.Keyboard.release(bot.Key.LEFT_ALT)
    }
  })
  controller.on('buttonUp', event => {
    console.log('buttonUp', event)
    if (event.button === 'a') {
      bot.Mouse.release(bot.MouseButton.LEFT)
    }
  })

  detectAndMoveMouse(controller)
}

module.exports = {
  start,
  eventBus,
}