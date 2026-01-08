import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
{{#if styling}}
import './index.css'
{{/if}}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)