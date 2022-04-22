import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from "react-redux"
import configStore from "./store/configureStore"
import AppRouter from "./routers/AppRouter"
import App from './App';
const store = configStore();
const jsxWrapper = (
  <Provider store={store}>

    <AppRouter />
  </Provider>
)

ReactDOM.render(jsxWrapper, document.getElementById("app"))
/*
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/
