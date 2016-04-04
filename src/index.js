import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import App from './components/App';
import { changeMode } from './actions';

import Minesweeper from './minesweeper';

const mw = Minesweeper();
mw.init();

const store = createStore(
  reducer,
  { mw: mw, mode: "desktop" },
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
