import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askGemini } from '../utils/geminiClient'; // adjust path if needed

type Message = {
  from: 'user' | 'bot';
  text: string;
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          from: 'bot',
          text:
            "👋 Hello! I'm Digi-World Assistant. Ask me anything about our services, locations, packages, or how to start your campaign.",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Add user message
    const userMessage: Message = { from: 'user', text: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsBotTyping(true);

    // Ask Gemini directly (no backend)
    const replyText = await askGemini(trimmed);
    const botMessage: Message = { from: 'bot', text: replyText };

    setMessages(prev => [...prev, botMessage]);
    setIsBotTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Disable body scroll when maximized
  // Disable body scroll when maximized and open
  useEffect(() => {
    if (isMaximized && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMaximized, isOpen]);

  return (

    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end ${isMaximized ? 'z-[9999]' : ''}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              borderRadius: isMaximized ? 0 : "1rem"
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`bg-white overflow-hidden flex flex-col transition-all duration-300 ${
              isMaximized 
                ? 'fixed inset-x-0 bottom-0 top-20 z-[9999] rounded-t-2xl shadow-2xl' 
                : 'mb-4 w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 h-[500px]'
            }`}
          >
            {/* Header */}
            <div className="brand-gradient-bg text-white p-4 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-bold">Digi-World Support</h3>
                <p className="text-xs text-white/80">Chat with us</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => { setIsOpen(false); setIsMaximized(false); }}
                  className="text-white/80 hover:text-white transition"
                  title="Minimize"
                >
                  <i className="fas fa-minus"></i>
                </button>
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="text-white/80 hover:text-white transition"
                  title={isMaximized ? "Restore" : "Maximize"}
                >
                  <i className={`fas ${isMaximized ? 'fa-compress' : 'fa-expand'}`}></i>
                </button>

              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.from === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`
                        rounded-2xl py-2 px-3 text-sm max-w-[85%] shadow-sm
                        ${
                          msg.from === 'user'
                            ? 'bg-brand-dark text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }
                      `}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isBotTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-700 rounded-2xl rounded-bl-none py-2 px-3 text-sm max-w-[70%] shadow-sm flex items-center space-x-1">
                      <span className="animate-pulse">●</span>
                      <span className="animate-pulse delay-150">●</span>
                      <span className="animate-pulse delay-300">●</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white shrink-0">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your question..."
                  aria-label="Chat message input"
                  className="flex-1 text-sm rounded-xl text-black border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isBotTyping || !inputValue.trim()}
                  aria-label="Send message"
                  className="brand-gradient-bg text-white px-3 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <i className="fas fa-paper-plane text-xs mr-1"></i>
                  Send
                </button>
              </div>
              <a
                href="https://wa.me/916265180430"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block w-full text-center bg-gray-100 text-brand-dark py-2 rounded-xl text-xs font-bold hover:bg-brand-dark hover:text-white transition-colors border border-gray-200"
              >
                <i className="fab fa-whatsapp mr-1"></i> Contact an Expert
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      {(!isOpen || !isMaximized) && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          className="brand-gradient-bg text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
        >
          {isOpen ? (
            <i className="fas fa-times"></i>
          ) : (
            <span className="text-2xl">🤖</span>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default Chatbot;
