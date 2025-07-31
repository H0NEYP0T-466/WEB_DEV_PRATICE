import React, { useRef } from 'react'

const UseRef = () => {
    let x = useRef(0);

    function handelclick()
    {
        x.current = x.current + 1;
        console.log(x.current);
    }
  return (
    <div>
      <button onClick={handelclick}>Click to incerase value without showing it on the screen</button>
      <h1>{x.current}</h1>
    </div>
  )
}

export default UseRef
