/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';

import './index.css';
import { KeyboardViewer } from './views/KeyboardViewer';
import { CircleKeyboardViewer } from './views/CircleKeyboardViewer';
import { Home } from './views/Home/Home';
import './utils/gamepad';
import './utils/keyEvent';
import { VirtualKeyboard } from './views/VirtualKeyboard';

declare global {
  interface Window {
    GamepadControllerJSBridge?: Record<string, Function>
  }
}

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
  () => (
    <Router>
      <Route path="/keyboard/circle" component={CircleKeyboardViewer} />
      <Route path="/keyboard/advance" component={KeyboardViewer} />
      <Route path="/keyboard/virtual" component={VirtualKeyboard} />
      <Route path="/" component={Home} />
    </Router>
  ),
  root!
);
