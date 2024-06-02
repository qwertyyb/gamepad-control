import type { Component } from 'solid-js';

import { KeyboardViewer } from './views/KeyboardViewer';
import { CircleKeyboardViewer } from './views/CircleKeyboardViewer';

const App: Component = () => {
  return (
    // <KeyboardViewer />
    <CircleKeyboardViewer />
  );
};

export default App;
