import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import App from './components/App';
import { changeMode } from './actions';
import { StyleRoot } from 'radium';
import Cookie from 'cookies-js';

import Minesweeper from './minesweeper';

const config = {
    show: false,
    mode: false,
    flagMode: Cookie.get("flagMode") === "true" || false,
    rows: parseInt(Cookie.get("rows")) || 9,
    cols: parseInt(Cookie.get("cols")) || 9,
    mines: parseInt(Cookie.get("mines")) || 10
};

const mw = Minesweeper();
mw.init(config.rows, config.cols, config.mines, config.flagMode);

const store = createStore(
    reducer, { mw, config },
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

render(
    <StyleRoot>
        <Provider store={store}>
            <App />
        </Provider>
    </StyleRoot>,
    document.getElementById('root')
);
