'use client';

import { useState } from 'react';
import axios from 'axios';

export default function EditorPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{[key: string]: string | number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/grok', { prompt: input });
      setResult(response.data);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      setResult({ error: 'An error occurred while processing your request.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">OpenAI API Tester</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt"
          className="w-full p-2 border rounded text-black"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-black">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
