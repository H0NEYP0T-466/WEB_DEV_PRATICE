import React from 'react'
import './Nav_bar.css'
import { useRef } from 'react';
import gsap from 'gsap';

const Nav_bar = () => {
    const navBottomRef = useRef(null);

  const handleHover = () => {
  gsap.to(navBottomRef.current, {
    height: "11vw",
    stagger: 0.1,
    duration: 0.2,
    ease: "expo.out", 
  });
};

const handleLeave = () => {
  gsap.to(navBottomRef.current, {
    height: "0vw",
    duration: 0.3,
    ease: "expo.inOut", 
  });
};

  return (
    <div id='nav'>
      <h1>DEV LENS.</h1>
       <div className="navpart2" 
       onMouseEnter={handleHover}
        onMouseLeave={handleLeave}>
            <div className="nav-elem">
                <h4>Case Studies</h4>
                <h5><span>Code Optimization</span></h5>
                <h5><span>Security Wins</span></h5>
                <h5><span>Scalable Builds</span></h5>
                <h5><span>UI/UX Revamp</span></h5>

            </div>
            <div className="nav-elem">
                <h4>Experties</h4>
                <h5><span>AI & ML</span></h5>
                <h5><span>Fintech Apps</span></h5>
                <h5><span>SaaS Platforms</span></h5>
                <h5><span>Web 3.0</span></h5>
                <h5><span>E-Commerce</span></h5>
            </div>
            <div className="nav-elem">
                <h4>Tech Stack</h4>
                <h5><span>Core Languages</span></h5>
                <h5><span>Frameworks</span></h5>
                <h5><span>Databases</span></h5>
                <h5><span>Testing Suites</span></h5>
            </div>
            <div className="nav-elem">
                <h4>AI Engine</h4>
                <h5><span>Bug Detection</span></h5>
                <h5><span>Speed Boost</span></h5>
                <h5><span>Code Generation</span></h5>
                <h5><span>Think Deeply</span></h5>
            </div>
            <div className="nav-elem">
                <h4>Process </h4>

                <h5><span>Code Intake</span></h5>
                <h5><span>AI Review</span></h5>
                <h5><span>Human Check</span></h5>
                <h5><span>Deployment</span></h5>
            </div>
            <div className="nav-elem">
                <h4>About DevLens</h4>
                <h5><span>Innovating Code</span></h5>
                <h5><span>Driven by AI</span></h5>
                <h5><span>Human + Machine</span></h5>
                <h5><span>Future Focused</span></h5>
            </div>
        </div>

     
      <div ref={navBottomRef } id="nav_bottom">
      
        
      </div>
    </div>
  )
}

export default Nav_bar
