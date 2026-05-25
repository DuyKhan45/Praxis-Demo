import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Trash2, Sparkles, Building, Home, Hotel } from 'lucide-react';
import { useAi } from '../hooks/useAi';

// Mini listing card for bot responses
function MiniListingCard({ item, onClick }) {
  return (
    <div className="chat-listing-mini" onClick={() => onClick(item)}>
      <div className={`chat-listing-mini-icon ${item.theme || 'blue'}`}>
        {item.type === 'Studio' && <Hotel size={18} />}
        {item.type === 'Apartment' && <Building size={18} />}
        {item.type === 'House' && <Home size={18} />}
      </div>
      <div className="chat-listing-mini-info">
        <div className="chat-listing-mini-title">{item.title}</div>
        <div className="chat-listing-mini-price">
          <span>${item.price}</span>/night &bull; ★{item.rating.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

export default function ChatBot({ 
  isOpen, 
  onToggle, 
  onApplyFilters, 
  listings, 
  setSelectedListing 
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi! I am NestFind AI. Tell me what kind of stay you're looking for! For example:\n- *'Show me studio rooms in Hanoi under $50'* \n- *'Nomad apartment in Saigon with high speed wifi'*",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const messageCounterRef = useRef(1);
  const { askAi, loading } = useAi();

  const nextMessageId = (prefix) => {
    const id = `${prefix}-${messageCounterRef.current}`;
    messageCounterRef.current += 1;
    return id;
  };

  const suggestionChips = [
    "Cheap Hanoi Studio",
    "Thao Dien nomad apartment",
    "Beachfront stay Da Nang",
    "Luxury villa with pool"
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: nextMessageId('user'),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Query AI
    const result = await askAi(textToSend);

    if (result) {
      // Filter local listings to find exact matches
      const { filters, response } = result;
      
      // Apply filters back to main application
      onApplyFilters(filters);

      // Find matched listings in current set
      let matched = listings;
      if (filters.city) {
        matched = matched.filter(item => item.location.city.toLowerCase() === filters.city.toLowerCase());
      }
      if (filters.type) {
        matched = matched.filter(item => item.type.toLowerCase() === filters.type.toLowerCase());
      }
      if (filters.maxPrice) {
        matched = matched.filter(item => item.price <= filters.maxPrice);
      }
      if (filters.minRating) {
        matched = matched.filter(item => item.rating >= filters.minRating);
      }
      if (filters.minBeds) {
        matched = matched.filter(item => item.beds >= filters.minBeds);
      }
      if (filters.amenities && filters.amenities.length > 0) {
        matched = matched.filter(item => 
          filters.amenities.every(amenity => item.amenities.includes(amenity))
        );
      }

      // Cap listings in response
      const matchedSample = matched.slice(0, 3);

      const botMessage = {
        id: nextMessageId('bot'),
        sender: 'bot',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedListings: matchedSample
      };

      setMessages((prev) => [...prev, botMessage]);
    } else {
      const errorMessage = {
        id: nextMessageId('bot-err'),
        sender: 'bot',
        text: "I'm having trouble processing that right now. Please verify your internet connection or verify the VITE_GEMINI_API_KEY is correctly set in your .env file.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: "History cleared. How can I help you find your perfect stay in Vietnam?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="ai-chat-trigger" onClick={onToggle}>
        <div className="ai-chat-trigger-pulse"></div>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </div>

      {/* Slide-out Chat Drawer */}
      <div className={`ai-chat-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-header-title">
            <Sparkles size={20} />
            <h3>NestFind AI</h3>
            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>
              Online
            </span>
          </div>
          <div className="ai-chat-header-actions">
            <button className="ai-chat-btn-icon" onClick={handleClearHistory} title="Clear Chat History">
              <Trash2 size={16} />
            </button>
            <button className="ai-chat-btn-icon" onClick={onToggle} title="Close Panel">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="ai-chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`ai-message ${msg.sender}`}>
              <div className="ai-message-avatar">
                {msg.sender === 'bot' ? <Sparkles size={16} /> : msg.id.startsWith('user') ? 'U' : 'AI'}
              </div>
              <div className="ai-message-bubble">
                <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                
                {/* Inline mini list results */}
                {msg.matchedListings && msg.matchedListings.length > 0 && (
                  <div className="chat-listings">
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                      Recommended Properties
                    </div>
                    {msg.matchedListings.map((item) => (
                      <MiniListingCard 
                        key={item.id} 
                        item={item} 
                        onClick={setSelectedListing} 
                      />
                    ))}
                  </div>
                )}
                
                <span className="ai-message-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="ai-message bot">
              <div className="ai-message-avatar">
                <Sparkles size={16} />
              </div>
              <div className="ai-message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="chat-suggestions">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className="chat-suggestion-chip"
              onClick={() => handleSendMessage(chip)}
              disabled={loading}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="ai-chat-input-area">
          <form onSubmit={handleFormSubmit} className="ai-chat-form">
            <div className="ai-chat-input-wrapper">
              <input
                type="text"
                placeholder="Find a place..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
              />
            </div>
            <button type="submit" className="ai-chat-btn-send" disabled={loading || !inputValue.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
