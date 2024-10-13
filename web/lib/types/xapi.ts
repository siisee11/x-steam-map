interface StreamRuleResponse {
  data?: StreamRule[];
  meta: StreamRuleMeta;
  errors?: StreamRuleError[];
}

interface StreamRule {
  id: string;
  value: string;
  tag?: string;
}

interface StreamRuleMeta {
  result_count: number;
}

interface StreamRuleError {
  id: string;
  title: string;
  type: string;
  value: string;
}

interface Tweet {
  id: string;
  text: string;
  edit_history_tweet_ids: string[];
  article: unknown;
  created_at: string;
  geo: {
    place_id: string;
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
  };
  evaluation?: TweetEvaluation;
}

interface StreamTweet {
  data: Tweet;
  matching_rules: Pick<StreamRule, "id" | "tag">[];
}

interface TweetEvaluation {
  sentiment: number;
  aggression: number;
  urgency: number;
  virality: number;
  engagement: number;
  human_impact: number;
  economic_impact: number;
  environmental_impact: number;
}

export type {
  StreamRuleResponse,
  StreamRule,
  StreamRuleMeta,
  StreamRuleError,
  StreamTweet,
  Tweet,
  TweetEvaluation,
};
