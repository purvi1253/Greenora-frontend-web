import { useState, useRef, useEffect } from 'react';
import './VrikshaVedAI.css';

const VrikshaVedAI = () => {
  const [messages, setMessages] = useState([
    { 
      text: "Namaste! I'm VrikshaVed AI 🌿\nI can help you with:\n• Plant care & growing tips\n• Medicinal benefits\n• Export business guidance\n• Market insights\n\nWhat would you like to know?", 
      sender: 'ai' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Plant Knowledge Database
  const plantDatabase = {
    'tulsi': {
      name: 'Holy Basil (Tulsi)',
      benefits: ['Immunity booster', 'Stress relief', 'Respiratory health', 'Blood sugar control'],
      growing: 'Well-drained soil, 6-8 hours sunlight, regular watering',
      harvesting: '90-100 days after planting',
      export: ['USA', 'Europe', 'Middle East', 'Japan'],
      price: '₹150-200 per plant'
    },
    'aloe vera': {
      name: 'Aloe Vera',
      benefits: ['Skin care', 'Digestion aid', 'Anti-inflammatory', 'Wound healing'],
      growing: 'Sandy soil, minimal watering, bright indirect light',
      harvesting: '8-10 months after planting',
      export: ['Cosmetics industry', 'Pharmaceuticals', 'USA', 'Germany'],
      price: '₹200-250 per plant'
    },
    'turmeric': {
      name: 'Turmeric Plant',
      benefits: ['Anti-inflammatory', 'Antioxidant', 'Arthritis relief', 'Brain health'],
      growing: 'Warm climate, well-drained soil, 8-10 months growth',
      harvesting: 'When leaves turn yellow',
      export: ['USA', 'UK', 'Canada', 'Australia'],
      price: '₹180-220 per kg'
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // AI Processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // 🆕 CONTEXT-AWARE RESPONSES
    if (conversationContext.includes('export') && lowerQuery.includes('document')) {
      return "📋 **Export Documents Required:**\n• Phytosanitary Certificate\n• Certificate of Origin\n• Quality Inspection Report\n• Commercial Invoice\n• Packing List\n\nNeed help with specific documentation?";
    }
    
    if (conversationContext.includes('export') && lowerQuery.includes('price')) {
      return "💰 **Export Pricing Factors:**\n• Quantity ordered\n• Destination country\n• Shipping method\n• Quality grade\n• Packaging requirements\n\nTell me your specific needs for accurate pricing!";
    }
    
    if (conversationContext.includes('grow') && lowerQuery.includes('soil')) {
      return "🌱 **Soil Preparation Guide:**\n\nFor medicinal plants:\n• Well-drained soil mix\n• Organic compost\n• pH balance 6.0-7.0\n• Proper drainage essential\n• Regular soil testing recommended";
    }

    // 🆕 CONTEXT UPDATE
    if (lowerQuery.includes('export') || lowerQuery.includes('business') || lowerQuery.includes('market')) {
      setConversationContext('export');
    } else if (lowerQuery.includes('grow') || lowerQuery.includes('plant') || lowerQuery.includes('cultivat')) {
      setConversationContext('growing');
    } else if (lowerQuery.includes('benefit') || lowerQuery.includes('medicinal') || lowerQuery.includes('health')) {
      setConversationContext('health');
    }

    // Plant-specific queries
    for (const [key, plant] of Object.entries(plantDatabase)) {
      if (lowerQuery.includes(key)) {
        return `🌿 **${plant.name}**\n\n💊 **Medicinal Benefits:**\n${plant.benefits.map(b => `• ${b}`).join('\n')}\n\n🌱 **Growing Guide:**\n${plant.growing}\n\n💰 **Market Price:** ${plant.price}\n\n🌍 **Export Markets:** ${plant.export.join(', ')}\n\n🕒 **Harvesting Time:** ${plant.harvesting}`;
      }
    }

    // Category-based responses
    if (lowerQuery.includes('grow') || lowerQuery.includes('plant') || lowerQuery.includes('cultivat')) {
      return "I specialize in medicinal plant cultivation! 🏡\n\nPopular plants for growing:\n• Tulsi (Easy, high demand)\n• Aloe Vera (Low maintenance)\n• Turmeric (Good profitability)\n\nTell me which plant you're interested in!";
    }

    if (lowerQuery.includes('export') || lowerQuery.includes('business') || lowerQuery.includes('market')) {
      return "🌍 **Export Business Guidance:**\n\nHigh-demand export plants:\n• Tulsi - US/Europe markets\n• Aloe Vera - Cosmetics industry\n• Turmeric - Global spice trade\n\nRequirements:\n• Organic certification\n• Quality packaging\n• Export documentation\n\nNeed specific market info?";
    }

    if (lowerQuery.includes('benefit') || lowerQuery.includes('medicinal') || lowerQuery.includes('health')) {
      return "💊 **Medicinal Plants Database:**\n\nI have detailed info on:\n• Tulsi - Immunity & stress\n• Aloe Vera - Skin & digestion\n• Turmeric - Inflammation\n• Many more...\n\nWhich plant's health benefits interest you?";
    }

    if (lowerQuery.includes('hi') || lowerQuery.includes('hello') || lowerQuery.includes('namaste')) {
      return "Namaste! 🙏 I'm VrikshaVed AI, your plant expert.\n\nI can help with:\n• Plant cultivation guidance\n• Medicinal properties\n• Export business tips\n• Market analysis\n\nWhat would you like to explore today?";
    }

    return "I'm constantly learning about plants! 🌱\n\nI can best help with:\n• Specific plant information (Tulsi, Aloe Vera, etc.)\n• Growing techniques\n• Export business guidance\n• Medicinal benefits\n\nTry asking about a particular plant or topic!";
  };

  const quickQuestions = [
    "Tell me about Tulsi",
    "How to grow Aloe Vera?",
    "Export requirements",
    "Medicinal plant benefits"
  ];

  return (
    <div className="ai-chatbot">
      <div className="ai-header">
        <div className="ai-title">
          <span className="ai-icon">🤖</span>
          <h3>VrikshaVed AI Plant Expert</h3>
        </div>
        <span className="ai-status">● Online</span>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
        {isLoading && (
          <div className="message ai loading">
            <div className="typing-indicator">
              <span>VrikshaVed is typing</span>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-questions">
        <p>Quick questions:</p>
        {quickQuestions.map((question, index) => (
          <button 
            key={index}
            onClick={() => setInput(question)}
            className="quick-btn"
          >
            {question}
          </button>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about plants, export, growing tips..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
          className="send-btn"
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </div>
    </div>
  );
};

export default VrikshaVedAI;