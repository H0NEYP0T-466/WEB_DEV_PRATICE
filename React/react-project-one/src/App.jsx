import React, { createContext, use, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Child_Component from './Components/Child_Component';

function App() {
  const [data, setData] = useState(0);

  return(
    <div id='div'>
      <button onClick={()=>{
        setData(data + 1);
      }}>Click Me</button>

      <h1>{data}</h1>

      <div>
        <Child_Component name="honeypot"/>
       
      </div>
    </div>
   
  )
}

export default App;

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
        
        const UserContent = createContext();
        
         const [islogedin, setlogin] = useState(false);

  if (islogedin) {
    return <Fucking_Logout/>;
  } else {
    return <Login/>;
  }
        
        
         <div id='div'style={{backgroundColor: user.name === "Light" ? "beige" : "black"}}>
      <UserContent.Provider value={{user,setUser}}>
      <Child_1/>
    
      </UserContent.Provider>
    </div>
        const [user, setUser] = useState({name: "Light"});
        export { UserContent };


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Components/Home';
import About from './Components/About';
import Dashboard from './Components/Dashboard';
import NavBar from './Components/NavBar';
import Params from './Components/Params';
import Projects from './Components/Projects';
import Tasks from './Components/Tasks';
import NotFound from './Components/NotFound';

<RouterProvider router={router} />

        const router = createBrowserRouter(
  [
    {
      path:'/',
      element: <div>
        <NavBar/>
        <Home/>
      </div>
    },
    {
      path:'/about',
      element:
      <div>
      <NavBar/>
      <About/>
      
      </div>
    },
  {
  path:'/dashboard',
  element:
    <div>
      <NavBar/>
      <Dashboard/>
    </div>,
  children: [ // <-- fix here
    {
      path:'projects',
      element:<Projects/>
    },
    {
      path:'tasks',
      element:<Tasks/>
    },
  ]
},
      {
      path:'/student/:id',
      element:
      <div>
        <NavBar/>
        <Params/>
      
        </div>
    },
    {
      path:'*',
      element:<NotFound></NotFound>
    }
  ]
);
        


<button onClick={inc}>+</button>
      <p>Count:{count}</p>
       <button onClick={dec}>-</button>
       <button onClick={res}>Reset</button>
         const count=useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  function inc()
  {
    dispatch(increment());
  }
  function dec()
  {
    dispatch(decrement());
  }
    function res()
  {
    dispatch(reset());
  }

        */