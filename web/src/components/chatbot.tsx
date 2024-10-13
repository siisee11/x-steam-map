import React, { useState } from 'react';
import axios from 'axios';
import { useMapContext } from '../contexts/MapContext';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean, image?: string }>>([]);
  const [grokInput, setGrokInput] = useState('');
  const [grokIsLoading, setGrokIsLoading] = useState(false);
  const { captureScreenshot } = useMapContext();

  const handleGrokSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGrokIsLoading(true);

    try {
      const modelName = "grok-vision-preview";
      const screenshot = await captureScreenshot();
      console.log("screenshot", screenshot);
      if (screenshot) {
        // const image = `data:image/png;base64,${screenshot}`;
        const image = screenshot;
        setMessages([...messages, { text: grokInput, image, isUser: true }, { text: "Analyzing...", isUser: false }]);
        const response = await axios.post('/api/grok', { prompt: grokInput, modelName, image });
        setMessages([...messages, {text: grokInput, image, isUser: true}, { text: response.data.content, isUser: false }]);
      } else {
        setMessages([...messages, { text: grokInput, isUser: true }, { text: "Analyzing...", isUser: false }]);
        const response = await axios.post('/api/grok', { prompt: grokInput, modelName });
        setMessages([...messages, { text: grokInput, isUser: true }, { text: response.data.content, isUser: false }]);
      }
    } catch (error) {
      console.error('Error calling Grok API:', error);
      setMessages([...messages, { text: grokInput, isUser: true }, { text: 'An error occurred while processing your request.', isUser: false }]);
    } finally {
      setGrokIsLoading(false);
      setGrokInput('');
    }
  };

  return (
    <div className="h-full flex flex-col absolute inset-0" style={{ zIndex: 1000, position: 'relative' }}>
      {/* Updated title with higher z-index */}
      <h1 className="text-2xl font-bold text-center p-4 bg-blue-500 text-white fixed top-0 left-0 right-0" style={{ zIndex: 1001 }}>AI Reporter<br/><span className="text-md">powered by Grok</span></h1>
      <div className="flex-grow overflow-y-auto p-4 mt-24 bg-white bg-opacity-90">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {message.text}
              {message.image && <div className="flex flex-row">
            <img src="/us_map.jpg" alt="screenshot" className="w-1/2" />
              <img src={message.image} alt="screenshot" className="w-1/2" />
                </div>}
                
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleGrokSubmit} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={grokInput}
              onChange={(e) => setGrokInput(e.target.value)}
              className="flex-grow p-2 border rounded-l text-black"
              placeholder="Ask Grok..."
            />
            <button 
              type="submit" 
              className="bg-green-500 text-white p-2 rounded-r"
              disabled={grokIsLoading}
            >
              {grokIsLoading ? 'Loading...' : 'Ask Grok'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
