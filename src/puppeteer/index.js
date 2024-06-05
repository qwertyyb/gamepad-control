const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const puppeteer = require('puppeteer-core')

const script = fs.readFileSync(path.join(__dirname, './preload.js'), { encoding: 'utf-8' })

const eventBus = new EventEmitter()

const EventName = {
  showKeyboard: 'showKeyboard',
  hideKeyboard: 'hideKeyboard'
}

/**
 * 
 * @param {puppeteer.Page} page 
 */
const insertScriptToPage = (page) => {
  console.log('insertScriptToPage')
  page.evaluateOnNewDocument(script)
  page.exposeFunction('showKeyboard', () => {
    eventBus.emit(EventName.showKeyboard)
  })
  page.exposeFunction('hideKeyboard', () => {
    eventBus.emit(EventName.hideKeyboard)
  })
  page.on('popup', insertScriptToPage)
}

const start = async () => {
  const browser = await puppeteer.connect({
    defaultViewport: null,
    browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/7c91a377-e80c-4687-98f4-5c11344b3172'
  })
  const page = await browser.newPage();

  insertScriptToPage(page)

  await page.goto('https://www.bing.com/', {
    waitUntil: 'load'
  });
};

module.exports = {
  start, eventBus, EventName
}