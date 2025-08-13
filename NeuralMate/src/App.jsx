import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
const App = () => {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const bottomRef = useRef(null);
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

  // 🎤 Setup Speech Recognition
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

  // 💬 Process user message (voice or text)
  const processUserMessage = async (userText) => {
    try {
      // Gemini response in Hindi (for speaking)
      const hindiResponse = await generateGeminiResponse(userText);

      // Translate Hindi -> English (for display)
      const englishDisplay = await translateToEnglish(hindiResponse);

      setMessages((prev) => [
        ...prev,
        { sender: 'Isabella', text: englishDisplay }
      ]);

      console.log("🗣 Speaking (Hindi):", hindiResponse);
      speak(hindiResponse);

      await saveMessageToDB('Honeypot', userText);
      await saveMessageToDB('Isabella', englishDisplay);
    } catch (error) {
      console.error('Error processing user message:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'Isabella', text: 'Error generating response.' },
      ]);
    }
  };

  const generateGeminiResponse = async (prompt) => {
    // Ask Gemini to respond in Hindi for voice
    const res = await axios.post('http://localhost:8000/api/gemini', { prompt: prompt + " (उत्तर हिंदी में दें)" });
    return res.data.text;
  };

  const translateToEnglish = async (hindiText) => {
    try {
      const res = await axios.post('http://localhost:8000/api/translate', {
        text: hindiText,
        targetLang: 'en'
      });
      return res.data.text;
    } catch (err) {
      console.error('Error translating to English:', err);
      return hindiText; // fallback
    }
  };

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

  const speak = (text) => {
  if (!('speechSynthesis' in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN"; // Hindi
  utterance.rate = 1;
  utterance.pitch = 1;

  const speakNow = () => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    const preferredVoice = voices.find(v =>
      v.lang.includes("hi") &&
      (v.name.toLowerCase().includes("female") ||
       v.name.toLowerCase().includes("woman") ||
       v.name.toLowerCase().includes("girl") ||
       v.name.toLowerCase().includes("google"))
    );

    utterance.voice = preferredVoice || voices.find(v => v.lang.includes("hi")) || voices[0];
    console.log(`🎤 Using voice: ${utterance.voice?.name || "Default"}`);
    window.speechSynthesis.speak(utterance);
  };

  // Voices may not be ready immediately, wait for onvoiceschanged
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = speakNow;
  } else {
    speakNow();
  }
};

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const userMessage = textInput.trim();
    setTextInput("");
    setMessages((prev) => [...prev, { sender: 'Honeypot', text: userMessage }]);
    await processUserMessage(userMessage);
  };

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
  fontSize:'17px',
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
        <span >{msg.text}</span>
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
