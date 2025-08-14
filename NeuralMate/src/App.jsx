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

  const loadVoices = (onLoaded) => {
    let allVoices = window.speechSynthesis.getVoices();
    if (allVoices.length > 0) {
      setVoices(allVoices);
      onLoaded?.(allVoices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        allVoices = window.speechSynthesis.getVoices();
        setVoices(allVoices);
        onLoaded?.(allVoices);
      };
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8000/api/get-messages', {
      params: { userName: 'Honeypot', assistantName: 'Isabella', limit: 50 }
    }).then(res => {
      if (res.data.success) {
        const sorted = res.data.messages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(sorted);
      }
    }).catch(err => console.error('Error fetching messages:', err));

    loadVoices(); 
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition API not supported.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => isRecognizingRef.current = true;
    recognition.onend = () => {
      isRecognizingRef.current = false;
      setTimeout(() => {
        if (!isRecognizingRef.current) recognition.start();
      }, 500);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      setMessages(prev => [...prev, { sender: 'Honeypot', text: transcript }]);

      if (/bella|isabella|bala/i.test(transcript)) {
        loadVoices(() => processUserMessage(transcript));
      }
    };

    recognition.onerror = e => console.error('Speech Recognition Error:', e.error);

    recognition.start();
    return () => recognition.stop();
  }, []);

  const speak = (text) => {
    let availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        availableVoices = window.speechSynthesis.getVoices();
        speak(text);
      };
      return;
    }

    const cleanedText = text.replace(/[*#_~`]/g, '').trim();
    const chunks = cleanedText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanedText];
    const selectedVoice = availableVoices.find(v =>
      v.lang.includes("en") &&
      (v.name.toLowerCase().includes("female") ||
       v.name.toLowerCase().includes("woman") ||
       v.name.toLowerCase().includes("girl") ||
       v.name.toLowerCase().includes("google"))
    ) || availableVoices.find(v => v.lang.includes("en")) || availableVoices[0];

    let index = 0;
    const speakNextChunk = () => {
      if (index >= chunks.length) return;
      const utterance = new SpeechSynthesisUtterance(chunks[index].trim());
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.voice = selectedVoice;
      utterance.onend = () => { index++; speakNextChunk(); };
      window.speechSynthesis.speak(utterance);
    };

    window.speechSynthesis.cancel();
    speakNextChunk();
  };

  const processUserMessage = async (userText) => {
    try {
      const englishResponse = await generateGeminiResponse(userText);
      setMessages(prev => [...prev, { sender: 'Isabella', text: englishResponse }]);
      speak(englishResponse);
      await saveMessageToDB('Honeypot', userText);
      await saveMessageToDB('Isabella', englishResponse);
    } catch (error) {
      console.error('Error processing user message:', error);
      setMessages(prev => [...prev, { sender: 'Isabella', text: 'Error generating response.' }]);
    }
  };

  const generateGeminiResponse = async (prompt) => {
    const res = await axios.post('http://localhost:8000/api/gemini', { prompt });
    return res.data.text;
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

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const userMessage = textInput.trim();
    setTextInput("");
    setMessages(prev => [...prev, { sender: 'Honeypot', text: userMessage }]);
    await processUserMessage(userMessage);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      color: '#fff', fontFamily: 'monospace', height: '100vh', backgroundColor: '#111',
      display: 'flex', flexDirection: 'column', fontSize: '16px', paddingBottom: '20px'
    }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            <span style={{ color: '#0f0' }}>{msg.sender}:</span>{' '}
            <ReactMarkdown
              children={msg.text}
              components={{
                h1: ({...props}) => <h1 style={{ color: '#ff4040', display: 'inline' }} {...props} />,
                h2: ({...props}) => <h2 style={{ color: '#ff4040', display: 'inline' }} {...props} />,
                h3: ({...props}) => <h3 style={{ color: '#ff4040', display: 'inline' }} {...props} />,
                h4: ({...props}) => <h4 style={{ color: '#ff4040', display: 'inline' }} {...props} />,
                h5: ({...props}) => <h5 style={{ color: '#ff4040', display: 'inline' }} {...props} />,
                h6: ({...props}) => <h6 style={{ color: '#ff4040', display: 'inline' }} {...props} />,
                p: ({...props}) => <p style={{ display: 'inline', color: '#fff' }} {...props} />,
                strong: ({...props}) => <strong style={{ color: '#ff4040' }} {...props} />,
                em: ({...props}) => <em style={{ color: '#ccc', fontStyle: 'italic' }} {...props} />,
                code: ({...props}) => <code style={{ background: '#222', color: '#fff', padding: '2px 4px', borderRadius: '4px' }} {...props} />
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
          style={{ flex: 1, padding: '8px', background: '#111', color: '#fff', border: '1px solid #333' }}
        />
        <button type="submit" style={{ padding: '8px 12px', background: '#0f0', border: 'none', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default App;
