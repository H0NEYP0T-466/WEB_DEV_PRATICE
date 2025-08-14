import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [voices, setVoices] = useState([]);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const bottomRef = useRef(null);

  // Load past messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/get-messages', {
          params: { userName: 'Honeypot', assistantName: 'Isabella', limit: 50 }
        });
        if (res.data.success) {
          const sortedMessages = res.data.messages.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
          setMessages(sortedMessages);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();
  }, []);

  // Preload voices
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        setVoices(allVoices);
      }
    };

    loadVoices(); // try immediately
    window.speechSynthesis.onvoiceschanged = loadVoices; // load when ready
  }, []);

  // Start speech recognition
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
        if (!isRecognizingRef.current) recognition.start();
      }, 500);
    };

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();

      console.log("🎤 Heard:", transcript);
      setMessages((prev) => [...prev, { sender: 'Honeypot', text: transcript }]);

      if (
        transcript.toLowerCase().includes('bella') ||
        transcript.toLowerCase().includes('isabella') ||
        transcript.toLowerCase().includes('bala')
      ) {
        await processUserMessage(transcript);
      }
    };

    recognition.onerror = (e) => {
      console.error('Speech Recognition Error:', e.error);
    };

    recognition.start();

    return () => recognition.stop();
  }, []);

  // Speak function
  const speak = (text) => {
    if (!("speechSynthesis" in window) || voices.length === 0) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    const preferredVoice = voices.find(v =>
      v.lang.includes("en") &&
      (v.name.toLowerCase().includes("female") ||
       v.name.toLowerCase().includes("woman") ||
       v.name.toLowerCase().includes("girl") ||
       v.name.toLowerCase().includes("google"))
    );

    utterance.voice = preferredVoice || voices.find(v => v.lang.includes("en")) || voices[0];
    console.log(`🎤 Using voice: ${utterance.voice?.name || "Default"}`);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Process a user message
  const processUserMessage = async (userText) => {
    try {
      const englishResponse = await generateGeminiResponse(userText);

      setMessages((prev) => [
        ...prev,
        { sender: 'Isabella', text: englishResponse }
      ]);

      console.log("🗣 Speaking (English):", englishResponse);
      speak(englishResponse);

      await saveMessageToDB('Honeypot', userText);
      await saveMessageToDB('Isabella', englishResponse);
    } catch (error) {
      console.error('Error processing user message:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'Isabella', text: 'Error generating response.' },
      ]);
    }
  };

  // API call to Gemini
  const generateGeminiResponse = async (prompt) => {
    const res = await axios.post('http://localhost:8000/api/gemini', { prompt });
    return res.data.text;
  };

  // Save messages
  const saveMessageToDB = async (sender, text) => {
    try {
      await axios.post('http://localhost:8000/api/save-message', {
        userName: 'Honeypot',
        assistantName: 'Isabella',
        sender,
        text
      });
    } catch (err) {
      console.error('Error saving message to DB:', err);
    }
  };

  // Text submit
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const userMessage = textInput.trim();
    setTextInput("");
    setMessages((prev) => [...prev, { sender: 'Honeypot', text: userMessage }]);
    await processUserMessage(userMessage);
  };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      position: 'relative',
      zIndex: 1,
      color: '#fff',
      fontFamily: 'monospace',
      height: '100vh',
      backgroundColor: '#111',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '17px',
      paddingBottom: '20px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <span style={{ color: '#0f0' }}>
              {msg.sender}:
            </span>{' '}
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleTextSubmit} style={{ display: 'flex', marginTop: '10px' }}>
        <input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '8px',
            background: '#111',
            color: '#fff',
            border: '1px solid #333'
          }}
        />
        <button type="submit" style={{
          padding: '8px 12px',
          background: '#0f0',
          border: 'none',
          cursor: 'pointer'
        }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default App;
