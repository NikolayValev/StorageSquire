import React from 'react';
import { Provider } from "react-redux"
import configStore from "./store/configureStore"
import AppRouter from "./routers/AppRouter"
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
