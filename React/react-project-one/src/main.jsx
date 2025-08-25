import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import App from './App'

createRoot(document.getElementById('root')).render(

<App></App>
  
)

/*

<Provider store={store}>
    <App></App>
    </Provider>

*/