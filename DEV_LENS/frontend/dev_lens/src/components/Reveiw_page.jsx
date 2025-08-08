import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Reveiw_Page.css';
import axios from 'axios';


const CodeReviewComponent = () => {
  const [code, setCode] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);


const handleReviewCode = () => {
  setIsLoading(true);
  axios.post('http://localhost:8000/reveiw', {  
    prompt: code
  })
  .then((res) => {
    setAiResponse(res.data);
    setIsLoading(false);
  })
  .catch((error) => {
    console.error(error);
    setIsLoading(false);
  });
};


  return (
    <div className="code-review-container">
      <div className="panel code-panel">
        <div className="panel-header">
          <h2>Your Code</h2>
        </div>
        <textarea
          className="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code here..."
        />
        <button 
          className="review-button" 
          onClick={handleReviewCode}
          disabled={isLoading || !code.trim()}
        >
          {isLoading ? 'Reviewing...' : 'Review Code'}
        </button>
      </div>
      
      <div className="panel response-panel">
        <div className="panel-header">
          <h2>AI Response</h2>
        </div>
        <div className="response-content">
          {aiResponse ? (
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          ) : (
            <p className="placeholder-text">AI response will appear here after code review...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReviewComponent;