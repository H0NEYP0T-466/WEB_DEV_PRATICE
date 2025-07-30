import React, { use, useContext, useState } from 'react';
import Child_1 from './Components/Child_1';

const UserContent = useContext

function App() {



  return (
    <div>
      <UserContent.provider>
      <Child_1/>
      </UserContent.provider>
    </div>
  )
}


export default App
 /* <div className='container'>
      <User_card name="HONEYPOT" desc="1st" image={m4} style={{"border-radius":"10px"}}/>
      <User_card name="honeypot" desc="2st" image={m4f} style={{"border-radius":"10px"}}/>
      <User_card name="honeyPOT" desc="3st" image={akm} style={{"border-radius":"10px"}}/>
      */


/*const [num,set] = useState(0)

  function newfun()
  { 
    set(num+1);
    
  }
    
  
  <Counter x={newfun} text="click me">
        <h1>{num}</h1>
        </Counter>
        
        
        
        
        
        
        
        
         const [val , fun] = useState("");
        <State_lifting text="Child#1" val={val} fun={fun}/>
       <State_lifting text="Child#2" val={val} fun={fun}/>
       <p>Parent component: {val}</p>
        
        
        
         const [islogedin, setlogin] = useState(false);

  if (islogedin) {
    return <Fucking_Logout/>;
  } else {
    return <Login/>;
  }
        
        
        
        
        
        
        
        
        */