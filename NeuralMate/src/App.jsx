import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      console.log('Heard:', transcript);

      if (transcript.toLowerCase().includes('bella') || transcript.toLowerCase().includes('isabella') || transcript.toLowerCase().includes('bala')) {
        try {
          console.log('Trigger word detected! Sending request to backend...');
          const response = await generateGeminiResponse(transcript);
          setResponseText(response);
        } catch (error) {
          console.error('Error calling Gemini API:', error);
          setResponseText('Error generating response.');
        }
      }
    };

    recognition.onerror = (e) => {
      console.error('Speech Recognition Error:', e.error);
    };

    recognition.start();


    return () => {

    };
  }, []);


const generateGeminiResponse = async (prompt) => {
  console.log('Sending prompt to Gemini API:', prompt);
  const res = await axios.post('http://localhost:8000/api/gemini', { prompt });
  console.log('Received response from Gemini API:', res.data);
  return res.data.text;
};

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
      <h1>Isabella Speech Assistant</h1>
      <p><strong>Say "Bella" or "Isabella" to trigger a response.</strong></p>
      <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
        <strong>Response:</strong> {responseText}
      </div>
    </div>
  );
};

export default App;
