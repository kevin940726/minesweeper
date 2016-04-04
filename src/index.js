import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import App from './components/App';
import { changeMode } from './actions';
import { StyleRoot } from 'radium';

import Minesweeper from './minesweeper';

const mw = Minesweeper();
mw.init();

const store = createStore(
    reducer,
    { mw: mw, mode: "desktop", config: { show: false, rows: 9, cols: 9, mines: 10 } },
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
