import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';
import App from './components/App';
import { changeMode } from './actions';
import { StyleRoot } from 'radium';
import Cookie from 'cookies-js';

import Minesweeper from './minesweeper';

const config = {
    isLoading: false,
    show: false,
    mode: false,
    flagMode: Cookie.get("flagMode") === "true" || false,
    checkIsSolvable: Cookie.get("checkIsSolvable") === "true" || false,
    rows: parseInt(Cookie.get("rows")) || 9,
    cols: parseInt(Cookie.get("cols")) || 9,
    mines: parseInt(Cookie.get("mines")) || 10
};

const mw = Minesweeper();
mw.blocks = mw.reset(config.rows, config.cols, config.mines, config.flagMode, config.checkIsSolvable);

const store = createStore(
    reducer, { mw, config, timePass: 0 },
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

render(
    <StyleRoot>
        <Provider store={store}>
            <App />
        </Provider>
    </StyleRoot>,
    document.getElementById('root')
);
