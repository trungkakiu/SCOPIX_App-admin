import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import App from './App'
import store from './store'
import { AdminProvider } from './Context/AdminContext'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <AdminProvider>
        <App />
      </AdminProvider>
    </BrowserRouter>
  </Provider>,
)
