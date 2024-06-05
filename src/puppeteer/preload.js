const log = (...args) => console.log('puppeteer', ...args)

const focusHandler = (event) => {
  const selectors = `input[type="text"],input[type="password"],input[type="search"],textarea`
  const needKeyboard = event.target?.matches(selectors)
  log('needKeyboard', needKeyboard)
  if (needKeyboard) {
    log('requestShowKeyboardView')
    window.showKeyboard?.()
  } else {
    window.hideKeyboard?.()
  }
}
window.addEventListener('focus', focusHandler, true)

log('puppeteer script loaded')