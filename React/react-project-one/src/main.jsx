import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import UseRef from './Components/UseRef'
import UserefHOOKDOM from './Components/UserefHOOKDOM'


createRoot(document.getElementById('root')).render(
<StrictMode>
    <UserefHOOKDOM></UserefHOOKDOM>
</StrictMode>
  
)

/*

<Provider store={store}>
    <App></App>
    </Provider>

*/