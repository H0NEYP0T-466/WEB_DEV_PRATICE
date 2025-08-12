import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
    };

 recognition.onend = () => {
  isRecognizingRef.current = false;
  setTimeout(() => {
    if (!isRecognizingRef.current) {
      recognition.start();
    }
  }, 500); // wait 0.5s before restarting
};
    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();

      // User message
      setMessages((prev) => [...prev, { sender: 'Honeypot', text: transcript }]);

      if (
        transcript.toLowerCase().includes('bella') ||
        transcript.toLowerCase().includes('isabella') ||
        transcript.toLowerCase().includes('bala')
      ) {
        try {
          await saveMessageToDB('Honeypot', transcript);
          const response = await generateGeminiResponse(transcript);
          await saveMessageToDB('Isabella', response);
          setMessages((prev) => [...prev, { sender: 'Isabella', text: response }]);
        } catch (error) {
          console.error('Error calling Gemini API:', error);
          setMessages((prev) => [
            ...prev,
            { sender: 'Isabella', text: 'Error generating response.' },
          ]);
        }
      }
    };

    recognition.onerror = (e) => {
      console.error('Speech Recognition Error:', e.error);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);

  const generateGeminiResponse = async (prompt) => {
    const res = await axios.post('http://localhost:8000/api/gemini', { prompt });
    return res.data.text;
  };
   const saveMessageToDB = async (sender, text) => {
    try {
      await axios.post('http://localhost:8000/api/save-message', {
        name: 'Honeypot',
        assistantname: 'Isabella',
        sender,
        text
      });
    } catch (err) {
      console.error('Error saving message to DB:', err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        color: '#fff',
        fontFamily: 'monospace',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {messages.map((msg, index) => (
        <div key={index}>
          <span style={{ color: '#0f0' ,fontSize: '1rem' }}>{msg.sender}:</span> <span style={{fontSize: '1rem'}}>{msg.text}</span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default App;
