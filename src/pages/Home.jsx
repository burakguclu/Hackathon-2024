import React, { useState, useEffect, useRef } from 'react';
import '../css/Home.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from "react-markdown";
import keys from "../config/keys.json";

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [promptResponses, setPromptResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const genAI = new GoogleGenerativeAI(keys.googleapi);

  const handleInputChange = (e) => setInputValue(e.target.value);

  const getResponseForGivenPrompt = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = { question: inputValue, answer: "loading" };
    setPromptResponses(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(userMessage.question);
      const response = result.response.text();
      
      setPromptResponses(prev => prev.map((msg, index) => 
        index === prev.length - 1 ? { ...msg, answer: response } : msg
      ));
    } catch (error) {
      console.log("Something Went Wrong", error);
    } finally {
      setLoading(false);
    }
  };

  // Enter tuşu ile mesaj gönderme
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getResponseForGivenPrompt();
    }
  };

  // Yeni mesaj geldiğinde chatbox'ı aşağı kaydırma
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [promptResponses]);

  return (
    <div className="chat-body">
      <div className="chat-box">
        <div className="chat-messages">
          {promptResponses.map((item, index) => (
            <div key={index} className="message-pair">
              <div className="message user">{item.question}</div>
              <div className="message bot">
                {item.answer === "loading" ? <div className="loading">Cevap yükleniyor...</div> : <ReactMarkdown className="prose prose-lg">{item.answer}</ReactMarkdown>}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="input-area">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Bana bir şeyler sor..."
            className="chat-input"
          />
          <button onClick={getResponseForGivenPrompt} className="send-button">Gönder</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
