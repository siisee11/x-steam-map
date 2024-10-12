import React from 'react';
import { StreamTweet } from '../../lib/types/xapi';

interface TweetCardProps {
  tweet: StreamTweet;
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <p className="text-gray-800 mb-2">{tweet.data.text}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>
          <a
            href={`https://twitter.com/i/web/status/${tweet.data.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View on Twitter
          </a>
        </span>
        <span>
          Matching Rules: {tweet.matching_rules.map(rule => rule.tag || rule.id).join(', ')}
        </span>
      </div>
    </div>
  );
};

export default TweetCard;
