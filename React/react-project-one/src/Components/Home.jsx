import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  function clickhandel()
  {
    navigate('/about');
  };
  return (
    <div>
      Home page
      <button onClick={clickhandel}>ABout page</button>
    </div>
  )
}

export default Home
