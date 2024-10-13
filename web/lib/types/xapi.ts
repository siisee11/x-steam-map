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
}

interface StreamTweet {
  data: Tweet;
  matching_rules: Pick<StreamRule, "id" | "tag">[];
}

export type {
  StreamRuleResponse,
  StreamRule,
  StreamRuleMeta,
  StreamRuleError,
  StreamTweet,
  Tweet,
};
