'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { StreamRuleResponse, StreamRule, StreamRuleError, StreamTweet } from '../../../lib/types/xapi';
import TweetCard from '../../components/tweet-card';
import RulesList from '../../components/rules-list';

export default function EditorPage() {
  const [grokInput, setGrokInput] = useState('');
  const [grokResult, setGrokResult] = useState<{[key: string]: string | number} | null>(null);
  const [grokIsLoading, setGrokIsLoading] = useState(false);

  const [streamRules, setStreamRules] = useState<StreamRule[]>([]);

  const [tweets, setTweets] = useState<StreamTweet[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const [tweetStats, setTweetStats] = useState<{ total: number, byRule: { [key: string]: number } }>({ total: 0, byRule: {} });

  const [grokRulesInput, setGrokRulesInput] = useState('');
  const [grokRulesResult, setGrokRulesResult] = useState<StreamRule[]>([]);
  const [grokRulesIsLoading, setGrokRulesIsLoading] = useState(false);

  useEffect(() => {
    fetchStreamRules();
  }, []);

  const handleGrokSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGrokIsLoading(true);

    try {
      const response = await axios.post('/api/grok', { prompt: grokInput });
      setGrokResult(response.data);
    } catch (error) {
      console.error('Error calling Grok API:', error);
      setGrokResult({ error: 'An error occurred while processing your request.' });
    } finally {
      setGrokIsLoading(false);
    }
  };

  const fetchStreamRules = async () => {
    try {
      const response = await axios.get('/api/x2/tweets/search/stream/rules');
      const streamRules: StreamRuleResponse = response.data;
      setStreamRules(streamRules.data || []);
    } catch (error) {
      console.error('Error fetching stream rules:', error);
    }
  };

  const addStreamRule = async (rule: string, tag?: string) => {
    try {
      const newRule: { value: string; tag?: string } = { value: rule };
      if (tag) {
        newRule.tag = tag;
      }
      const response = await axios.post('/api/x2/tweets/search/stream/rules', {
        add: [newRule]
      });
      const newStreamRules: StreamRuleResponse = response.data;

      if (newStreamRules.errors) {
        const errors: StreamRuleError[] = newStreamRules.errors;
        const message = errors.map(error => `${error.title}: ${error.value}`).join('\n');
        alert(`Error adding stream rule:\n${message}`);
        return;
      }

      const mergedStreamRules = streamRules.map(existingRule => {
        const matchingNewRule = newStreamRules.data?.find(newRule => newRule.id === existingRule.id);
        return matchingNewRule || existingRule;
      });
      const updatedStreamRules = [
        ...mergedStreamRules,
        ...(newStreamRules.data?.filter(newRule => !streamRules.some(existingRule => existingRule.id === newRule.id)) || [])
      ];
      setStreamRules(updatedStreamRules);
    } catch (error) {
      console.error('Error adding stream rule:', error);
    }
  };

  // Updated exampleRules
  const exampleRules: Pick<StreamRule, "value" | "tag">[] = [
    { value: "hurricane has:images -is:retweet", tag: "Hurricane with images" },
    { value: "dog has:images -is:retweet", tag: "Dog images" },
    { value: "cat has:images -grumpy", tag: "Happy cat images" }
  ];

  const startStream = async () => {
    setIsStreaming(true);
    setTweets([]); // Clear existing tweets when starting a new stream

    try {
      const response = await fetch('/api/x2/tweets/search/stream2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'start' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              console.log('line', line);
              const jsonString = line.slice(6); // Remove 'data: ' prefix
              console.log('jsonString', jsonString);
              const tweet: StreamTweet = JSON.parse(jsonString);
              setTweets((prevTweets) => [tweet, ...prevTweets]);
              updateTweetStats(tweet);
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to start stream:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  const updateTweetStats = (tweet: StreamTweet) => {
    setTweetStats((prevStats) => {
      const newStats = { ...prevStats };
      newStats.total += 1;

      tweet.matching_rules.forEach((rule) => {
        if (newStats.byRule[rule.tag ?? rule.id ?? 'unknown']) {
          newStats.byRule[rule.tag ?? rule.id ?? 'unknown'] += 1;
        } else {
          newStats.byRule[rule.tag ?? rule.id ?? 'unknown'] = 1;
        }
      });

      return newStats;
    });
  };

  const stopStream = async () => {
    try {
      await fetch('/api/x2/tweets/search/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'stop' }),
      });
    } catch (error) {
      console.error('Failed to stop stream:', error);
    }

    setIsStreaming(false);
  };

  const removeStreamRule = async (value: string) => {
    console.log('removeStreamRule', value);
    const id = streamRules.find((rule) => rule.value === value)?.id;
    if (id) {
        const data = {
            "delete": {
                "ids": [id],
            }
        }
        const response = await axios.post('/api/x2/tweets/search/stream/rules', data);

        console.log('response', response);
        if (response.data.errors) {
            const errors: StreamRuleError[] = response.data.errors;
            const message = errors.map(error => `${error.title}: ${error.value}`).join('\n');
            alert(`Error deleting stream rule:\n${message}`);
        }

        setStreamRules(streamRules.filter((rule) => rule.value !== value));
    }
  };

  const handleStreamRulesGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGrokRulesIsLoading(true);

    try {
      const response = await axios.post('/api/grok/generate-stream-rules', { prompt: grokRulesInput });
      console.log('response', response.data);
      const rules: StreamRule[] = response.data;
      console.log('rules', rules);
      setGrokRulesResult(rules);
    //   setGrokResult(response.data);
    } catch (error) {
      console.error('Error calling Grok API:', error);
    } finally {
      setGrokRulesIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen text-black bg-white overflow-hidden">
      {/* Grok API Tester */}
      <div className="w-1/3 p-4 border-r overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Grok API Tester</h1>
        <form onSubmit={handleGrokSubmit} className="mb-4">
          <input
            type="text"
            value={grokInput}
            onChange={(e) => setGrokInput(e.target.value)}
            placeholder="Enter your Grok prompt"
            className="w-full p-2 border rounded text-black"
          />
          <button
            type="submit"
            disabled={grokIsLoading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {grokIsLoading ? 'Loading...' : 'Submit to Grok'}
          </button>
        </form>
        {grokResult && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Grok Result:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-black max-h-[50vh]">
              {JSON.stringify(grokResult, null, 2)}
            </pre>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">Grok API for Twitter Stream Rules</h1>
        <p>Refer to the link for documentation on how to generate rules: <a className="underline" href="https://developer.x.com/en/docs/x-api/tweets/filtered-stream/integrate/build-a-rule" target="_blank" rel="noreferrer">build-a-rule</a></p>
        <form onSubmit={handleStreamRulesGenerate} className="mb-4">
          <input
            type="text"
            value={grokRulesInput}
            onChange={(e) => setGrokRulesInput(e.target.value)}
            placeholder="Enter your Grok prompt for rule generation"
            className="w-full p-2 border rounded text-black"
          />
          <button
            type="submit"
            disabled={grokRulesIsLoading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {grokRulesIsLoading ? 'Generating...' : 'Generate Rules'}
          </button>
        </form>
        {grokRulesResult && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Generated Rules:</h2>
            <RulesList rules={grokRulesResult} onAdd={addStreamRule} />
          </div>
        )}
      </div>

      {/* X's Tweets API Tester */}
      <div className="w-1/3 p-4 border-r overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">X&apos;s Tweets API Tester</h1>
        <div className="mb-4">
          <button
            onClick={fetchStreamRules}
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Get Stream Rules
          </button>
          <button
            onClick={() => {
              const rule = prompt('Enter a new rule:');
              if (rule) {
                const tag = prompt('Enter a tag for this rule (optional):');
                addStreamRule(rule, tag || undefined);
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Rule
          </button>
        </div>

        {/* Display current stream rules */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Current Stream Rules:</h2>
          <RulesList rules={streamRules} onRemove={removeStreamRule} />
        </div>

        {/* Example stream rules */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Example Stream Rules:</h2>
          <RulesList rules={exampleRules} onAdd={addStreamRule}/>
          {/* {exampleRules.map((rule, index) => (
            <button
              key={index}
              onClick={() => addStreamRule(rule.value)}
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Add {rule.tag || rule.value}
            </button>
          ))} */}
        </div>

       
      </div>

      {/* Tweet Stream */}
      <div className="w-1/3 p-4 flex flex-col h-full">
        <h1 className="text-2xl font-bold mb-4">Tweet Stream</h1>
        {/* Stream Status */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Stream Status:</h2>
          <p>Total tweets: {tweetStats.total}</p>
          {/* <h3 className="text-lg font-semibold mt-2 mb-1">Tweets per rule:</h3>
          <ul>
            {Object.entries(tweetStats.byRule).map(([rule, count]) => (
              <li key={rule}>{rule}: {count}</li>
            ))}
          </ul> */}
        </div>

        {!isStreaming ? (
          <button className="mb-4 bg-green-500 text-white rounded hover:bg-green-600 px-4 py-2" onClick={startStream}>Start Stream</button>
        ) : (
          <button className="mb-4 bg-red-500 text-white rounded hover:bg-red-600 px-4 py-2" onClick={stopStream}>Stop Stream</button>
        )}

        <div className="flex-grow overflow-y-auto">
          <ul className="space-y-4">
            {tweets.map((tweet, index) => (
              <TweetCard key={index} tweet={tweet} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
