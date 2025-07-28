import './App.css'
import User_card from './Components/user_card'
import m4 from './assets/m4.jpeg'
import m4f from './assets/m4fool.jpg'
import akm from './assets/akm.webp'

function App() {
  return (
    <div className='container'>
      <User_card name="HONEYPOT" desc="1st" image={m4} style={{"border-radius":"10px"}}/>
      <User_card name="honeypot" desc="2st" image={m4f} style={{"border-radius":"10px"}}/>
      <User_card name="honeyPOT" desc="3st" image={akm} style={{"border-radius":"10px"}}/>
    </div>
   
  )
}

export default App
