import React from 'react';
//import ReactDOM from 'react-dom';
//import './index.css';
import { Provider } from "react-redux"
import configStore from "./store/configureStore"
import AppRouter from "./routers/AppRouter"
//import App from './App';
// NEW
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
//END OF NEW
const store = configStore();
const jsxWrapper = (
  <Provider store={store}>

    <AppRouter />
  </Provider>
)
root.render(jsxWrapper);
/*ReactDOM.render(jsxWrapper, document.getElementById("app"))*/
/*
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/
