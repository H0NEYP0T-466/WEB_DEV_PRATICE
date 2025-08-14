import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
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

 const speak = (text) => {
  if (!("speechSynthesis" in window) || voices.length === 0) return;


  const cleanedText = text.replace(/[*#_~`]/g, '').trim();

  const chunks = cleanedText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanedText];
  
  const selectedVoice = voices.find(v =>
    v.lang.includes("en") &&
    (v.name.toLowerCase().includes("female") ||
     v.name.toLowerCase().includes("woman") ||
     v.name.toLowerCase().includes("girl") ||
     v.name.toLowerCase().includes("google"))
  ) || voices.find(v => v.lang.includes("en")) || voices[0];

  let index = 0;

  const speakNextChunk = () => {
    if (index >= chunks.length) return;

    const utterance = new SpeechSynthesisUtterance(chunks[index].trim());
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.voice = selectedVoice;

    utterance.onend = () => {
      index++;
      speakNextChunk();
    };

    window.speechSynthesis.speak(utterance);
  };

  window.speechSynthesis.cancel();
  speakNextChunk();
};



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
      fontSize: '16px',
      paddingBottom: '20px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
      {messages.map((msg, index) => (
  <div key={index} style={{ marginBottom: '8px' }}>
    <span style={{ color: '#0f0' }}>
      {msg.sender}:
    </span>{' '}
    <ReactMarkdown
      children={msg.text}
      components={{
        h1: ({ node, ...props }) => (
          <h1 style={{ color: '#ff4040', display: 'inline' }} {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 style={{ color: '#ff4040', display: 'inline' }} {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 style={{ color: '#ff4040', display: 'inline' }} {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 style={{ color: '#ff4040', display: 'inline' }} {...props} />
        ),
        h5: ({ node, ...props }) => (
          <h5 style={{ color: '#ff4040', display: 'inline' }} {...props} />
        ),
        h6: ({ node, ...props }) => (
          <h6 style={{ color: '#ff4040', display: 'inline' }} {...props} />
        ),
        p: ({ node, ...props }) => (
          <p style={{ display: 'inline', color: '#fff' }} {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong style={{ color: '#ff4040', fontWeight: 'bold' }} {...props} />
        ),
        em: ({ node, ...props }) => (
          <em style={{ color: '#ccc', fontStyle: 'italic' }} {...props} />
        ),
        code: ({ node, ...props }) => (
          <code
            style={{
              background: '#222',
              color: '#fff',
              padding: '2px 4px',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}
            {...props}
          />
        )
      }}
    />
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
