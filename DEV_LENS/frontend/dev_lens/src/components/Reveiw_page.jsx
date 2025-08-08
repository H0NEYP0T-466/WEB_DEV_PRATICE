import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Reveiw_Page.css';

const CodeReviewComponent = () => {
  const [code, setCode] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReviewCode = () => {
    setIsLoading(true);
    // This is where you would normally make an API call to your backend
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      setAiResponse("## Code Review Results\n\nYour code has been analyzed. Here are some observations:\n\n### Strengths\n- Clean and readable structure\n- Good variable naming\n\n### Suggestions\n- Consider adding more comments\n- Some functions could be simplified\n\n### Code Quality Score: 8/10");
      setIsLoading(false);
    }, 1500);
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