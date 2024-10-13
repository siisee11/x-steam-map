//   * place_country:US
//   * place:"new york city" OR place:"san francisco" OR place:"chicago" OR place:"miami" OR place:"seattle"

const promptToRule = (prompt: string): string => {
  return `
  
  Create a twitter stream rule for a given user prompt. Create rules as comprehensive as possible.

  Please add rules with the highest specificity possible.

  * -is:retweet
  * lang:en

  
  It should outputs in JSON. Please return json output only without \`\`\`json. Ignore any other text.

  For example, 

1. User prompt: tweets about dog pictures

Output: [{
    'value': 'dog has:images -is:retweet',
    'tag': 'dog pictures'
}]



2. User prompt: tweets about cat pictures

Output: [{
    'value': 'cat has:images -grumpy',
    'tag': 'cat pictures'
}]

3. User prompt: Tracking a natural disaster

Output: [{
    "value": "-is:retweet has:geo (from:NWSNHC OR from:NHC_Atlantic OR from:NWSHouston OR from:NWSSanAntonio OR from:USGS_TexasRain OR from:USGS_TexasFlood OR from:JeffLindner1)",
    "tag": "theme:info has:geo original from weather agencies and gauges"
}]

4. User prompt: Reviewing the sentiment of a conversation

Output: [
    {
        "value": "#nowplaying (happy OR exciting OR excited OR favorite OR fav OR amazing OR lovely OR incredible) (place_country:US OR place_country:MX OR place_country:CA) -horrible -worst -sucks -bad -disappointing",
        "tag": "#nowplaying positive"
    },
    {
        "value": "#nowplaying (horrible OR worst OR sucks OR bad OR disappointing) (place_country:US OR place_country:MX OR place_country:CA) -happy -exciting -excited -favorite -fav -amazing -lovely -incredible",
        "tag": "#nowplaying negative"
    }
]

User prompt: ${prompt}

Reference:

<div class="main-content twtr-col-lg-6 dtc-sidenav-v2-flag-on">
        <div class="main-content__wrapper">
          

          
          
          <div class="dtc-docs__header  main-content__header">
            <span id="dtc-docs__header-title" class="dtc-docs__header-title  chirp--bold-700  twtr-color--gray-900">Filtered stream</span>
          </div>

          




    
    
    <div class="dtc09-callout-text">

<div class="dtc09-callout-text">
  <div class="dtc09__item">
    <div class="dtc09__color  theme-bg-color--dark"></div>
    <div class="dtc09__text">
      




    
    
    <div class="c01-rich-text-editor">

<div class="is-table-default">
  
<p><b>Please note:</b></p>
<p>If you are moving an app between any <a href="https://developer.twitter.com/en/docs/projects/overview">Projects</a>, any rules you have created on the filtered stream endpoint will be reset. You will need to recreate these rules once it is associated with its new Project. Prior to moving an app that has rules in place on the filtered stream endpoint, you should save a local copy of all rules using the <a href="https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/api-reference/get-tweets-search-stream-rules">GET /2/tweets/search/stream/rules endpoint</a>.</p>
<p>&nbsp;</p>


</div>
</div>



    </div>
  </div>
</div></div>


    
    
    <div class="c01-rich-text-editor">

<div class="is-table-default">
  
<h2>Building rules for filtered stream</h2>
<p>The filtered stream endpoints deliver filtered Posts to you in real-time that match on a set of rules that are applied to the stream. Rules are made up of operators that are used to match on a variety of Post attributes.</p>
<p>Multiple rules can be applied to a stream using the <a href="/en/docs/twitter-api/tweets/filtered-stream/api-reference/post-tweets-search-stream-rules">POST /tweets/search/stream/rules</a> endpoint. Once you’ve added rules and connect to your stream using the <a href="/en/docs/twitter-api/tweets/filtered-stream/api-reference/get-tweets-search-stream">GET /tweets/search/stream</a> endpoint, only those Posts that match your rules will be delivered in real-time through a persistent streaming connection. You do not need to disconnect from your stream to add or remove rules.&nbsp;</p>
<p>To learn more about how to create high-quality rules, visit the following tutorial:<br>
<a href="/content/developer-twitter/en/docs/tutorials/building-high-quality-filters">Building high-quality filters for getting X data</a><br>
&nbsp;</p>
<h3>Table of contents</h3>
<ul>
<li><a href="#build">Building a rule</a><ul>
<li><a href="#limits">Rule limitations</a></li>
<li><a href="#availability">Operator availability</a></li>
<li><a href="#types">Operator types: standalone and conjunction-required</a></li>
<li><a href="#boolean">Boolean operators and grouping</a></li>
<li><a href="#order-of-operations">Order of operations</a></li>
<li><a href="#punctuation">Punctuation, diacritics, and case sensitivity</a></li>
<li><a href="#specificity">Specificity and efficiency</a></li>
<li><a href="#iterative">Iteratively building a rule</a></li>
<li><a href="#adding-removing">Adding and removing rules</a></li>
<li><a href="#examples">Rule examples</a></li>
</ul>
</li>
<li><a href="#list">List of operators<br>
 </a><br>
&nbsp;</li>
</ul>
<h3>Building a rule<a id="build" class="anchor-scroll-offset"></a><a></a></h3>
<h4>Rule limitations<a id="limits" class="anchor-scroll-offset"></a></h4>
<p>Limits on the number of rules will depend on which <a href="/en/docs/twitter-api/getting-started/about-twitter-api#v2-access-level">access level</a> is applied to your <a href="/en/docs/projects">Project</a>.</p>
<p>You can see how these limits apply via the <a href="/en/docs/twitter-api/tweets/filtered-stream">filtered stream introduction</a> page.<br>
&nbsp;</p>
<h4>Operator availability<a id="availability" class="anchor-scroll-offset"></a></h4>
<p>While most operators are available to any developer, there are several that are reserved for those that have been approved for Basic, Pro, or Enterprise access levels. We list which <a href="/en/docs/twitter-api/getting-started/about-twitter-api#v2-access-level">access level</a> each operator is available to in the <a href="#list">list of operators</a> table using the following labels:</p>
<ul>
<li><b>Essential operators:</b>&nbsp;Available when using any access level.</li>
<li><b>Elevated operators: </b>Available when using a Project with Pro, or Enterprise access.<br>
&nbsp;</li>
</ul>
<h4>Operator types: standalone and conjunction-required<a id="types" class="anchor-scroll-offset"></a></h4>
<p><b>Standalone operators</b> can be used alone or together with any other operators (including those that require conjunction).</p>
<p>For example, the following rule will work because it uses the <span class="code-inline">#hashtag</span> operator, which is standalone:</p>
<p><span class="code-inline">#xapiv2</span></p>
<p><b>Conjunction required</b> operators cannot be used by themselves in a rule; they can only be used when at least one standalone operator is included in the rule. This is because using these operators alone would be far too general, and would match on an extremely high volume of Posts.<br>
</p>
<p>For example, the following rules are not supported since they contain only conjunction required operators:</p>
<p><span class="code-inline">has:media</span><br>
<span class="code-inline">has:links OR is:retweet</span></p>
<p>If we add in a standalone operator, such as the phrase <span class="code-inline">"X data"</span>, the rule would then work properly.&nbsp;</p>
<p><span class="code-inline">"X data" has:mentions (has:media OR has:links)</span></p>
<h4><br>
Boolean operators and grouping<a id="boolean" class="anchor-scroll-offset"></a></h4>
<p>If you would like to string together multiple operators in a single rule, you have the following tools at your disposal:</p>
<table>
<tbody><tr><td><b>AND logic</b></td>
<td><span style="font-weight: normal;">Successive operators <b>with a space between them</b> will result in boolean "AND" logic, meaning that Posts will match only if both conditions are met. For example, <span class="code-inline">snow day #NoSchool</span> will match Posts containing the terms snow and day and the hashtag #NoSchool.</span></td>
</tr><tr><td><b>OR logic</b></td>
<td>Successive operators with OR between them will result in OR logic, meaning that Posts will match if either condition is met. For example, specifying <span class="code-inline">grumpy OR cat OR #meme</span> will match any Posts containing at least the terms grumpy or cat, or the hashtag #meme.</td>
</tr><tr><td><b>NOT logic, negation</b></td>
<td>Prepend a dash (-) to a keyword (or any operator) to negate it (NOT). For example, <span class="code-inline">cat #meme -grumpy</span> will match Posts containing the hashtag #meme and the term cat, but only if they do not contain the term grumpy. One common rule clause is <span class="code-inline">-is:retweet</span>, which will not match on Retweets, thus matching only on original Posts, Quote Tweets, and replies. All operators can be negated, but negated operators cannot be used alone.<br>
</td>
</tr><tr><td><b>Grouping</b></td>
<td>You can use parentheses to group operators together. For example, <span class="code-inline">(grumpy cat) OR (#meme has:images)</span> will return either&nbsp;Posts containing the terms grumpy and cat, or&nbsp;Posts with images containing the hashtag #meme. Note that ANDs are applied first, then ORs are applied.<br>
</td>
</tr></tbody></table>


</div>
</div>


    
    
    <div class="dtc09-callout-text">

<div class="dtc09-callout-text">
  <div class="dtc09__item">
    <div class="dtc09__color  theme-bg-color--dark"></div>
    <div class="dtc09__text">
      




    
    
    <div class="c01-rich-text-editor">

<div class="is-table-default">
  
<p><b>A note on negations</b></p>
<p>All operators can be negated except for <span class="code-inline">sample:</span>, and <span class="code-inline">-is:nullcast</span> must always be negated. Negated operators cannot be used alone.</p>
<p>Do not negate a set of operators grouped together in a set of parentheses. Instead, negate each individual operator.</p>
<p>For example, instead of using <span class="code-inline">skiing -(snow OR day OR noschool)</span>, we suggest that you use <span class="code-inline">skiing -snow -day -noschool</span>.&nbsp;</p>


</div>
</div>



    </div>
  </div>
</div></div>


    
    
    <div class="c01-rich-text-editor">

<div class="is-table-default">
  
<h4><br>
Order of operations<a id="order-of-operations" class="anchor-scroll-offset"></a></h4>
<p>When combining AND and OR functionality, the following order of operations will dictate how your rule is evaluated.</p>
<ol>
<li>Operators connected by AND logic are combined first</li>
<li>Then, operators connected with OR logic are applied<br>
<br>
</li>
</ol>
<p>For example:</p>
<ul>
<li><span class="code-inline">apple OR iphone ipad</span> would be evaluated as <span class="code-inline">apple OR (iphone ipad)</span></li>
<li><span class="code-inline">ipad iphone OR android</span> would be evaluated as <span class="code-inline">(iphone ipad) OR android</span><br>
<br>
</li>
</ul>
<p>To eliminate uncertainty and ensure that your rule is evaluated as intended, group terms together with parentheses where appropriate.&nbsp;</p>
<p>For example:</p>
<ul>
<li><span class="code-inline">(apple OR iphone) ipad</span></li>
<li><span class="code-inline">iphone (ipad OR android)<br>
 </span>&nbsp;</li>
</ul>
<h4>Punctuation, diacritics, and case sensitivity<a id="punctuation" class="anchor-scroll-offset"></a></h4>
<p>If you specify a keyword or hashtag rule with character accents or diacritics, it will match Posts that contain the exact word with proper accents or diacritics, but not those that have the proper letters, but without the accent or diacritic.&nbsp;</p>
<p>For example, rules with the keyword&nbsp;<span class="code-inline">diacrítica</span>&nbsp;or hashtag&nbsp;<span class="code-inline">#cumpleaños</span>&nbsp;will match Posts that contain&nbsp;<i>diacrítica</i>&nbsp;or&nbsp;<i>#cumpleaños</i>&nbsp;because they include the accent or diacritic. However, these rules will not match Posts that contain&nbsp;<i>Diacritica</i>&nbsp;or&nbsp;<i>#cumpleanos</i>&nbsp;without the tilde í or eñe.<br>
<br>
</p>
<p>Characters with accents or diacritics are treated the same as normal characters and are not treated as word boundaries. For example, a rule with the keyword&nbsp;<i>cumpleaños</i>&nbsp;would only match Posts containing the word&nbsp;<i>cumpleaños</i>&nbsp;and would not match Posts containing&nbsp;<i>cumplea</i>,&nbsp;<i>cumplean</i>, or&nbsp;<i>os</i>.</p>
<p>All operators are evaluated in a case-insensitive manner. For example, the rule cat will match all of the following:&nbsp;<i>cat</i>,&nbsp;<i>CAT</i>,&nbsp;<i>Cat</i>.</p>


</div>
</div>


    
    
    <div class="dtc09-callout-text">

<div class="dtc09-callout-text">
  <div class="dtc09__item">
    <div class="dtc09__color  theme-bg-color--dark"></div>
    <div class="dtc09__text">
      




    
    
    <div class="c01-rich-text-editor">

<div class="is-table-default">
  
<p>The&nbsp;<a href="/en/docs/twitter-api/tweets/search">Search Posts </a>matching behavior acts differently from filtered stream. When&nbsp;<a href="/en/docs/twitter-api/tweets/search/integrate/build-a-rule">building a Search Posts query</a>, know that keywords and hashtags that include accents or diacritics will match both the term with the accents and diacritics, as well as with normal characters.&nbsp;</p>
<p>For example, Search Posts queries that include a keyword&nbsp;<span class="code-inline">Diacrítica</span>&nbsp;or hashtag&nbsp;<span class="code-inline">#cumpleaños</span>&nbsp;will match both&nbsp;<i>Diacrítica</i>&nbsp;and&nbsp;<i>#cumpleaños</i>, as well as&nbsp;<i>Diacritica</i>&nbsp;or&nbsp;<i>#cumpleanos</i>&nbsp;without the tilde í or eñe.</p>


</div>
</div>



    </div>
  </div>
</div></div>


    
    
    <div class="c01-rich-text-editor">

<div class="is-table-default">
  
<h4>&nbsp;</h4>
<h4>Specificity and efficiency<a id="specificity" class="anchor-scroll-offset"></a></h4>
<p>When you start to build your rule, it is important to keep a few things in mind.</p>
<ul>
<li>Using broad, standalone operators for your rule such as a single keyword or #hashtag is generally not recommended since it will likely match on a massive volume of Posts. Creating a more robust rule will result in a more specific set of matching Posts, and will hopefully reduce the amount of noise in the payload that you will need to sift through to find valuable insights.&nbsp;<ul>
<li>For example, if your rule was just the keyword <span class="code-inline">happy</span> you will likely get anywhere from 200,000 - 300,000 Posts per day.</li>
<li>Adding more conditional operators narrows your search results, for example <span class="code-inline">(happy OR happiness) place_country:GB -birthday -is:retweet</span></li>
</ul>
</li>
<li>Writing efficient rules is also beneficial for staying within the characters rule length restriction. The character count includes the entire rule string including spaces and operators.<ul>
<li>For example, the following rule is 59 characters long: <span class="code-inline">(happy OR happiness) place_country:GB -birthday -is:retweet<br>
</span></li>
</ul>
</li>
</ul>
<h4><br>
Quote Tweet matching behavior<a id="quote-tweets"></a></h4>
<p>When using the filtered stream endpoints, operators will match on both the content from the original Post that was quoted, as well as the content included in the Quote Tweet.</p>
<p>However, please note that the <a href="/en/docs/twitter-api/tweets/search">Search Posts</a>&nbsp;endpoints&nbsp;will not match on the content from the original Post that was quoted, but will match on the Quote Tweet's content.<br>
<br>
</p>
<h4>Iteratively building a rule<a id="iterative" class="anchor-scroll-offset"></a></h4>
<h5>Test your rule early and often</h5>
<p>Getting a rule to return the "right" results the first time is rare. There is so much on X that may or may not be obvious at first and the rule syntax described above may be hard to match to your desired search. As you build a rule, it is important for you to periodically test it out with the stream endpoint to see what data it returns. You can also test with one of the <a href="/en/docs/twitter-api/tweets/search">Search Post</a>&nbsp;endpoints, assuming the operators that you are using are also available via that endpoint.&nbsp;</p>
<p>For this section, we are going to start with the following rule and adjust it based on the results that we receive during our test:&nbsp;</p>
<p><span class="code-inline">happy OR happiness</span></p>
<h5>Use results to narrow the rule</h5>
<p>As you test the rule, you should scan the returned Posts to see if they include the data that you are expecting and hoping to receive. Starting with a broad rule and a superset of Post matches allows you to review the result and narrow the rule to filter out undesired results.&nbsp;&nbsp;</p>
<p>When we tested the example rule, we noticed that we were getting Posts in a variety of different languages. In this situation, we want to only receive Posts that are in english, so we’re going to add the <span class="code-inline">lang:</span> operator:</p>
<p><span class="code-inline">(happy OR happiness) lang:en</span></p>
<p>The test delivered a number of Posts wishing people a happy birthday, so we are going to add <span class="code-inline">-birthday</span> as a negated keyword operator. We also want to only receive original Posts, so we’ve added the negated <span class="code-inline">-is:retweet</span> operator:</p>
<p><span class="code-inline">(happy OR happiness) lang:en -birthday -is:retweet</span></p>
<h5>Adjust for inclusion where needed</h5>
<p>If you notice that you are not receiving data that you expect and know that there are existing Posts that should return, you may need to broaden your rule by removing operators that may be filtering out the desired data.&nbsp;</p>
<p>For our example, we noticed that there were other Posts in our personal timeline that expressed the emotion that we are looking for and weren’t included in the test results. To ensure we have greater coverage, we are going to add the keywords, <span class="code-inline">excited</span> and <span class="code-inline">elated</span>.</p>
<p><span class="code-inline">(happy OR happiness OR excited OR elated) lang:en -birthday -is:retweet</span></p>
<h5>Adjust for popular trends/bursts over the time period</h5>
<p>Trends come and go on X quickly. Maintaining your rule should be an active process. If you plan to use a single rule for a while, we suggest that you periodically check in on the data that you are receiving to see if you need to make any adjustments.</p>
<p>In our example, we notice that we started to receive some Posts that are wishing people a “happy holidays”. Since we don’t want these Posts included in our results, we are going to add a negated <span class="code-inline">-holidays</span> keyword.</p>
<p><span class="code-inline">(happy OR happiness OR excited OR elated) lang:en -birthday -is:retweet -holidays&nbsp;</span></p>
<p>&nbsp;</p>
<h4><a id="adding-removing" class="anchor-scroll-offset"></a>Adding and removing rules</h4>
<p>You will be using the&nbsp;<a href="/en/docs/twitter-api/tweets/filtered-stream/api-reference/post-tweets-search-stream-rules">POST /2/tweets/search/stream/rules</a>&nbsp;endpoint when both adding and deleting rules from your stream.</p>
<p>To add one or more rule to your stream, submit an&nbsp;<span class="code-inline">add</span>&nbsp;JSON body with an array that contains the value parameter including the rule, and the optional&nbsp;<span class="code-inline">tag</span>&nbsp;parameter including free-form text that you can use to&nbsp;<a href="/en/docs/twitter-api/tweets/filtered-stream/integrate/matching-returned-tweets">identify which returned Posts match this rule</a>.&nbsp;</p>
<p>For example, if you were trying to add a set of rules to your stream, your cURL command might look like this:</p>


</div>
</div>


    
    
    <div class="b19-code-snippet twtr-component-space--md">











<div class="b19-snippet  b19__theme--light">
  <!--Rendering snippet component with tabs-->
  
  <!--Rendering snippet component single code-->
  
  <!--To support legacy mode(initial version) of snippet component-->
  
  <div class="t05-inline-code-snippet  ">
    <!--line-numbers and language are prismjs classes, these classes are used to render line numbers and code properly-->
    <pre class="line-numbers t05__pre--with-button language-bash">      <code tabindex="0" class="t05__copy language-bash"><span class="token function">curl</span> -X POST <span class="token string">'https://api.x.com/2/tweets/search/stream/rules'</span> <span class="token punctuation">\</span>
-H <span class="token string">"Content-type: application/json"</span> <span class="token punctuation">\</span>
-H <span class="token string">"Authorization: Bearer <span class="token variable">$ACCESS_TOKEN</span>"</span> -d <span class="token punctuation">\</span>
<span class="token string">'{
  "add": [
    {"value": "cat has:media", "tag": "cats with media"},
    {"value": "cat has:media -grumpy", "tag": "happy cats with media"},
    {"value": "meme", "tag": "funny things"},
    {"value": "meme has:images"}
  ]
}'</span><span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></code>
    </pre>
    <button aria-label="Copy to clipboard" class="t05__button">
      
      <svg xmlns="http://www.w3.org/2000/svg" width="52" height="72" viewBox="0 0 52 72"><path d="M48.119 29.875L28.124 9.88A3.005 3.005 0 0 0 26 8.999H8.001A5.007 5.007 0 0 0 3 14v43.999A5.007 5.007 0 0 0 8.001 63h36A5.006 5.006 0 0 0 49 57.999V32c0-.861-.147-1.391-.881-2.125zM29 27.999v-8.758L38.759 29H30a1 1 0 0 1-1-1.001zM10 57.001A1 1 0 0 1 9 56V15.999a1 1 0 0 1 1-1.001h13V32a3 3 0 0 0 3 2.998h17V56a1 1 0 0 1-1 1.001H10z"></path></svg>

      <div class="t05__tooltip  Tooltip">
        <div class="Tooltip-inner">
          <span class="t05__tooltip-text  Tooltip-content">Code copied to clipboard</span>
        </div>
      </div>
    </button>
  </div>

</div>
</div>


    
    
    <div class="c01-rich-text-editor">

<div class="is-table-default">
  
<p>Similarly, to remove one or more rules from your stream, submit a&nbsp;<span class="code-inline">delete</span>&nbsp;JSON body with the array of that contains the&nbsp;<span class="code-inline">id</span>&nbsp;parameter including the rule IDs that you would like to delete.</p>
<p>For example, if you were trying to remove a set of rules from your stream, your cURL command might look like this:<br>
</p>


</div>
</div>


    
    
    <div class="b19-code-snippet twtr-component-space--md">











<div class="b19-snippet  b19__theme--light">
  <!--Rendering snippet component with tabs-->
  
  <!--Rendering snippet component single code-->
  
  <!--To support legacy mode(initial version) of snippet component-->
  
  <div class="t05-inline-code-snippet  ">
    <!--line-numbers and language are prismjs classes, these classes are used to render line numbers and code properly-->
    <pre class="line-numbers t05__pre--with-button language-bash">      <code tabindex="0" class="t05__copy language-bash"><span class="token function">curl</span> -X POST <span class="token string">'https://api.x.com/2/tweets/search/stream/rules'</span> <span class="token punctuation">\</span>
  -H <span class="token string">"Content-type: application/json"</span> <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer <span class="token variable">$ACCESS_TOKEN</span>"</span> -d <span class="token punctuation">\</span>
  <span class="token string">'{
    "delete": {
      "ids": [
        "1165037377523306498",
        "1165037377523306499"
      ]
    }
  }'</span><span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></code>
    </pre>
    <button aria-label="Copy to clipboard" class="t05__button">
      
      <svg xmlns="http://www.w3.org/2000/svg" width="52" height="72" viewBox="0 0 52 72"><path d="M48.119 29.875L28.124 9.88A3.005 3.005 0 0 0 26 8.999H8.001A5.007 5.007 0 0 0 3 14v43.999A5.007 5.007 0 0 0 8.001 63h36A5.006 5.006 0 0 0 49 57.999V32c0-.861-.147-1.391-.881-2.125zM29 27.999v-8.758L38.759 29H30a1 1 0 0 1-1-1.001zM10 57.001A1 1 0 0 1 9 56V15.999a1 1 0 0 1 1-1.001h13V32a3 3 0 0 0 3 2.998h17V56a1 1 0 0 1-1 1.001H10z"></path></svg>

      <div class="t05__tooltip  Tooltip">
        <div class="Tooltip-inner">
          <span class="t05__tooltip-text  Tooltip-content">Code copied to clipboard</span>
        </div>
      </div>
    </button>
  </div>

</div>
</div>


    
    
    <div class="c01-rich-text-editor">

<div class="is-table-default">
  
<p>We have sample code in different languages available via our&nbsp;<a href="https://github.com/twitterdev/Twitter-API-v2-sample-code/tree/master/Filtered-Stream">Github</a>.&nbsp;<br>
<br>
</p>
<h4><a id="examples" class="anchor-scroll-offset"></a>Rule examples</h4>
<h5>Tracking a natural disaster</h5>
<p>The following rule matched on Posts coming from weather agencies and gauges that discuss Hurricane Harvey, which hit Houston in 2017. Notice the use of the&nbsp;<a href="/en/docs/twitter-api/tweets/filtered-stream/integrate/matching-returned-tweets">matching rules</a>&nbsp;tag, and the JSON format that you will need to use when submitting the rule to the&nbsp;<a href="/en/docs/twitter-api/tweets/filtered-stream/api-reference/post-tweets-search-stream-rules">POST /2/tweets/search/stream/rules endpoint</a>.</p>


</div>
</div>


    
    
    <div class="b19-code-snippet twtr-component-space--md">











<div class="b19-snippet  b19__theme--light">
  <!--Rendering snippet component with tabs-->
  
  <!--Rendering snippet component single code-->
  
  <!--To support legacy mode(initial version) of snippet component-->
  
  <div class="t05-inline-code-snippet  ">
    <!--line-numbers and language are prismjs classes, these classes are used to render line numbers and code properly-->
    <pre class="line-numbers t05__pre--with-button language-json">      <code tabindex="0" class="t05__copy language-json">        <span class="token punctuation">{</span>
            <span class="token property">"value"</span><span class="token operator">:</span> <span class="token string">"-is:retweet has:geo (from:NWSNHC OR from:NHC_Atlantic OR from:NWSHouston OR from:NWSSanAntonio OR from:USGS_TexasRain OR from:USGS_TexasFlood OR from:JeffLindner1)"</span><span class="token punctuation">,</span>
            <span class="token property">"tag"</span><span class="token operator">:</span> <span class="token string">"theme:info has:geo original from weather agencies and gauges"</span>
        <span class="token punctuation">}</span>
<span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span></span></code>
    </pre>
    <button aria-label="Copy to clipboard" class="t05__button">
      
      <svg xmlns="http://www.w3.org/2000/svg" width="52" height="72" viewBox="0 0 52 72"><path d="M48.119 29.875L28.124 9.88A3.005 3.005 0 0 0 26 8.999H8.001A5.007 5.007 0 0 0 3 14v43.999A5.007 5.007 0 0 0 8.001 63h36A5.006 5.006 0 0 0 49 57.999V32c0-.861-.147-1.391-.881-2.125zM29 27.999v-8.758L38.759 29H30a1 1 0 0 1-1-1.001zM10 57.001A1 1 0 0 1 9 56V15.999a1 1 0 0 1 1-1.001h13V32a3 3 0 0 0 3 2.998h17V56a1 1 0 0 1-1 1.001H10z"></path></svg>

      <div class="t05__tooltip  Tooltip">
        <div class="Tooltip-inner">
          <span class="t05__tooltip-text  Tooltip-content">Code copied to clipboard</span>
        </div>
      </div>
    </button>
  </div>

</div>
</div>


    
    
    <div class="c01-rich-text-editor">

<div class="is-table-default">
  
<h5>Reviewing the sentiment of a conversation</h5>
<p>The next rule could be used to better understand the sentiment of the conversation developing around the hashtag,&nbsp;<i>#nowplaying</i>, but only from Posts published within North America.</p>


</div>
</div>


    
    
    <div class="b19-code-snippet twtr-component-space--md">











<div class="b19-snippet  b19__theme--light">
  <!--Rendering snippet component with tabs-->
  
  <!--Rendering snippet component single code-->
  
  <!--To support legacy mode(initial version) of snippet component-->
  
  <div class="t05-inline-code-snippet  ">
    <!--line-numbers and language are prismjs classes, these classes are used to render line numbers and code properly-->
    <pre class="line-numbers t05__pre--with-button language-json">      <code tabindex="0" class="t05__copy language-json">        <span class="token punctuation">{</span>
            <span class="token property">"value"</span><span class="token operator">:</span> <span class="token string">"#nowplaying (happy OR exciting OR excited OR favorite OR fav OR amazing OR lovely OR incredible) (place_country:US OR place_country:MX OR place_country:CA) -horrible -worst -sucks -bad -disappointing"</span><span class="token punctuation">,</span>
            <span class="token property">"tag"</span><span class="token operator">:</span> <span class="token string">"#nowplaying positive"</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
            <span class="token property">"value"</span><span class="token operator">:</span> <span class="token string">"#nowplaying (horrible OR worst OR sucks OR bad OR disappointing) (place_country:US OR place_country:MX OR place_country:CA) -happy -exciting -excited -favorite -fav -amazing -lovely -incredible"</span><span class="token punctuation">,</span>
            <span class="token property">"tag"</span><span class="token operator">:</span> <span class="token string">"#nowplaying negative"</span>
        <span class="token punctuation">}</span>
<span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></code>
    </pre>
    <button aria-label="Copy to clipboard" class="t05__button">
      
      <svg xmlns="http://www.w3.org/2000/svg" width="52" height="72" viewBox="0 0 52 72"><path d="M48.119 29.875L28.124 9.88A3.005 3.005 0 0 0 26 8.999H8.001A5.007 5.007 0 0 0 3 14v43.999A5.007 5.007 0 0 0 8.001 63h36A5.006 5.006 0 0 0 49 57.999V32c0-.861-.147-1.391-.881-2.125zM29 27.999v-8.758L38.759 29H30a1 1 0 0 1-1-1.001zM10 57.001A1 1 0 0 1 9 56V15.999a1 1 0 0 1 1-1.001h13V32a3 3 0 0 0 3 2.998h17V56a1 1 0 0 1-1 1.001H10z"></path></svg>

      <div class="t05__tooltip  Tooltip">
        <div class="Tooltip-inner">
          <span class="t05__tooltip-text  Tooltip-content">Code copied to clipboard</span>
        </div>
      </div>
    </button>
  </div>

</div>
</div>


    
    
    <div class="c01-rich-text-editor">

<div class="is-table-default">
  
<h5>Find Posts that relate to a specific Post annotation</h5>
<p>This rule was built to search for original Posts that included an image of a pet that is not a cat, where the language identified in the Post is Japanese. To do this, we used the&nbsp;<span class="code-inline">context:</span>&nbsp;operator to take advantage of the&nbsp;<a href="/en/docs/twitter-api/annotations">Post annotation</a>&nbsp;functionality. We first used the&nbsp;<a href="/en/docs/twitter-api/tweets/lookup">Post lookup</a>&nbsp;endpoint and <span class="code-inline">the&nbsp;tweet.fields=context_annotations</span>&nbsp;fields parameter to identify which domain.entity IDs we need to use in our query:</p>
<ul>
<li>Posts that relate to cats return&nbsp;<b data-rte-class="rte-temp"><span class="code-inline">domain</span></b>&nbsp;66 (Interests and Hobbies category) with&nbsp;<span class="code-inline">entity</span>&nbsp;852262932607926273 (Cats).&nbsp;</li>
<li>Posts that relate to pets return&nbsp;<b data-rte-class="rte-temp"><span class="code-inline">domain</span></b>&nbsp;65 (Interests and Hobbies Vertical) with&nbsp;<span class="code-inline">entity</span>&nbsp;852262932607926273 (Pets).&nbsp;<br>
&nbsp;</li>
</ul>
<p>Here is what the rule would look like:</p>


</div>
</div>


    
    
    <div class="b19-code-snippet twtr-component-space--md">











<div class="b19-snippet  b19__theme--light">
  <!--Rendering snippet component with tabs-->
  
  <!--Rendering snippet component single code-->
  
  <!--To support legacy mode(initial version) of snippet component-->
  
  <div class="t05-inline-code-snippet  ">
    <!--line-numbers and language are prismjs classes, these classes are used to render line numbers and code properly-->
    <pre class="line-numbers t05__pre--with-button language-json">      <code tabindex="0" class="t05__copy language-json">        <span class="token punctuation">{</span>
            <span class="token property">"value"</span><span class="token operator">:</span> <span class="token string">"context:65.852262932607926273 -context:66.852262932607926273 -is:retweet has:images lang:ja"</span><span class="token punctuation">,</span>
            <span class="token property">"tag"</span><span class="token operator">:</span> <span class="token string">"Japanese pets with images - no cats"</span>
        <span class="token punctuation">}</span><span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span></span></code>
    </pre>
    <button aria-label="Copy to clipboard" class="t05__button">
      
      <svg xmlns="http://www.w3.org/2000/svg" width="52" height="72" viewBox="0 0 52 72"><path d="M48.119 29.875L28.124 9.88A3.005 3.005 0 0 0 26 8.999H8.001A5.007 5.007 0 0 0 3 14v43.999A5.007 5.007 0 0 0 8.001 63h36A5.006 5.006 0 0 0 49 57.999V32c0-.861-.147-1.391-.881-2.125zM29 27.999v-8.758L38.759 29H30a1 1 0 0 1-1-1.001zM10 57.001A1 1 0 0 1 9 56V15.999a1 1 0 0 1 1-1.001h13V32a3 3 0 0 0 3 2.998h17V56a1 1 0 0 1-1 1.001H10z"></path></svg>

      <div class="t05__tooltip  Tooltip">
        <div class="Tooltip-inner">
          <span class="t05__tooltip-text  Tooltip-content">Code copied to clipboard</span>
        </div>
      </div>
    </button>
  </div>

</div>
</div>


    
    
    <div class="c01-rich-text-editor">

<div>
  
<h3>Operators<a id="list" class="anchor-scroll-offset"></a></h3>
<ul>
<li><b>Essential:&nbsp;</b>Available when using any access level.</li>
<li><b style="word-spacing: normal;">Elevated:&nbsp;</b><span style="word-spacing: normal;">Available when using a Project with Pro, or Enterprise access.</span></li>
<li><span style="word-spacing: normal;">For some operators, an alternate name, or alias, is available.&nbsp;</span></li>
</ul>
<table>
<thead><tr><td width="18%"><b>Operator</b></td>
<th><a href="#type">Type</a></th>
<th><a href="#availability">Availability</a></th>
<th>Description</th>
</tr></thead><tbody><tr><td width="18%"><span class="code-inline">keyword</span></td>
<td>Standalone</td>
<td><p>Essential</p>
<p>&nbsp;</p>
</td>
<td>Matches a keyword within the body of a Post. This is a tokenized match, meaning that your keyword string will be matched against the tokenized text of the Post body. Tokenization splits words based on punctuation, symbols, and Unicode basic plane separator characters.<br>
<br>
For example, a Post with the text “I like coca-cola” would be split into the following tokens: I, like, coca, cola. These tokens would then be compared to the keyword string used in your rule. To match strings containing punctuation (for example coca-cola), symbol, or separator characters, you must wrap your keyword in double-quotes.<br>
<br>
Example: <span class="code-inline">pepsi OR cola OR "coca cola"</span></td>
</tr><tr><td width="18%"><span class="code-inline">emoji</span></td>
<td>Standalone</td>
<td>Essential</td>
<td>Matches an emoji within the body of a Post. Similar to a keyword, emojis are a tokenized match, meaning that your emoji will be matched against the tokenized text of the Post body.<br>
<br>
Note that if an emoji has a variant, you must wrap it in double quotes to add to a rule.<br>
<br>
Example: <span class="code-inline">(😃 OR 😡) 😬</span></td>
</tr><tr><td width="18%"><span class="code-inline">"exact phrase match"</span></td>
<td>Standalone</td>
<td>Essential</td>
<td>Matches the exact phrase within the body of a Post.<br>
<br>
Example: <span class="code-inline">("X API" OR #v2) -"filtered stream"</span></td>
</tr><tr><td width="18%"><span class="code-inline">#</span></td>
<td>Standalone</td>
<td>Essential</td>
<td>Matches any Post containing a recognized hashtag, if the hashtag is a recognized entity in a Post.<br>
<br>
This operator performs an exact match, NOT a tokenized match, meaning the rule <span class="code-inline">#thanku</span> will match posts with the exact hashtag #thanku, but not those with the hashtag #thankunext.<br>
<br>
Example: <span class="code-inline">#thankunext #fanart OR @arianagrande</span></td>
</tr><tr><td width="18%"><span class="code-inline">@</span></td>
<td>Standalone</td>
<td>Essential</td>
<td>Matches any Post that mentions the given username, if the username is a recognized entity (including the @ character).<br>
<br>
Example: <span class="code-inline">(@XDeveloeprs OR @api) -@x</span></td>
</tr><tr><td width="18%"><span class="code-inline">$</span></td>
<td>Standalone</td>
<td>Essential</td>
<td>Matches any Post that contains the specified ‘cashtag’ (where the leading character of the token is the ‘$’ character).<br>
<br>
Note that the cashtag operator relies on X's ‘symbols’ entity extraction to match cashtags, rather than trying to extract the cashtag from the body itself.<br>
<br>
Example: <span class="code-inline">$twtr OR @XDevelopers -$fb</span></td>
</tr><tr><td width="18%"><span class="code-inline">from:</span></td>
<td>Standalone</td>
<td>Essential</td>
<td>Matches any Post from a specific user.<br>
The value can be either the username (excluding the @ character) or the user’s numeric user ID.<br>
<br>
You can only pass a single username/ID <span class="code-inline">from:</span> operator.<br>
<br>
Example: <span class="code-inline">from:XDevelopers OR from:api -from:X</span></td>
</tr><tr><td width="18%"><span class="code-inline">to:</span></td>
<td>Standalone</td>
<td>Essential</td>
<td>Matches any Post that is in reply to a particular user.<br>
The value can be either the username (excluding the @ character) or the user’s numeric user ID.<br>
<br>
You can only pass a single username/ID per <span class="code-inline">to:</span> operator.<br>
<br>
Example: <span class="code-inline">to:XDevelopers OR to:api -to:x</span></td>
</tr><tr><td width="18%"><span class="code-inline">url:</span></td>
<td>Standalone</td>
<td>Essential</td>
<td>Performs a tokenized match on any validly-formatted URL of a Post.<br>
<br>
This operator can matches on the contents of both the <span class="code-inline">url</span> or <span class="code-inline">expanded_url</span> fields. For example, a Post containing "You should check out X Developer Labs: https://t.co/c0A36SWil4" (with the short URL redirecting to https://developer.twitter.com) will match both the following rules:<br>
<br>
<span class="code-inline">from:XDevelopers url:"https://developer.twitter.com"<br>
 </span>(because it will match the contents of <span class="code-inline">entities.urls.expanded_url</span>)<br>
<br>
<span class="code-inline">from:XDevelopers url:"https://t.co"<br>
 </span>(because it will match the contents of <span class="code-inline">entities.urls.url</span>)<br>
<br>
Tokens and phrases containing punctuation or special characters should be double-quoted (for example, <span class="code-inline">url:"/developer"</span>). Similarly, to match on a specific protocol, enclose in double-quotes (for example, <span class="code-inline">url:"https://developer.twitter.com"</span>).<br>
<br>
You can only pass a single URL per <span class="code-inline">url:</span> operator.</td>
</tr><tr><td width="18%"><span class="code-inline">retweets_of:</span></td>
<td>Standalone</td>
<td>Essential</td>
<td><p><i>Available alias: </i><span class="code-inline">retweets_of_user:</span></p>
<p>Matches Posts that are Retweets of the specified user. The value can be either the username (excluding the @ character) or the user’s numeric user ID.<br>
<br>
You can only pass a single username/ID per <span class="code-inline">retweets_of:</span> operator.<br>
<br>
Example: <span class="code-inline">retweets_of:XDevelopers OR retweets_of:twitterapi</span></p>
<p>See&nbsp;<a href="https://developer.twitter.com/content/developer-twitter/en/docs/twitter-api/users/lookup">HERE</a>&nbsp;for methods for looking up numeric X Account IDs.</p>
</td>
</tr><tr><td width="18%"><span class="code-inline">context:</span></td>
<td>Standalone</td>
<td>Essential</td>
<td>Matches Posts with a specific domain id and/or domain id, enitity id pair where * represents a wildcard. To learn more about this operator, please visit our page on <a href="/en/docs/twitter-api/annotations">Post annotations</a>.<br>
<br>
You can only pass a single domain/entitie per <span class="code-inline">context:</span> operator.<br>
<br>
<span class="code-inline">context:domain_id.entity_id<br>
 context:domain_id.*<br>
 context:*.entity_id<br>
 </span><br>
Examples:<br>
<span class="code-inline">context:10.799022225751871488<br>
 </span>(<span class="code-inline">domain_id.entity_id</span> returns Posts matching that specific domain-entity pair)<br>
<br>
<span class="code-inline">context:47.*<br>
 </span>(<span class="code-inline">domain_id.*</span> returns Posts matching that domain ID, with any domain-entity pair)<br>
<br>
<span class="code-inline">context:*.799022225751871488<br>
 </span>(<span class="code-inline">*.entity_id</span> returns Posts matching that entity ID, with any domain-entity pair)</td>
</tr><tr><td width="18%"><span class="code-inline">entity:</span></td>
<td>Standalone</td>
<td>Essential</td>
<td>Matches Posts with a specific entity string value. To learn more about this operator, please visit our page on <a href="/content/developer-twitter/en/docs/twitter-api/annotations">annotations</a>.<br>
<br>
You can only pass a single entity per<span class="code-inline"> entity:</span> operator.<br>
<br>
<span class="code-inline">entity:"string declaration of entity/place"<br>
 </span><br>
Examples: <span class="code-inline">entity:"Michael Jordan" OR entity:"Barcelona"</span></td>
</tr><tr><td width="18%"><span class="code-inline">conversation_id:</span></td>
<td>Standalone</td>
<td>Essential</td>
<td>Matches Posts that share a common conversation ID. A conversation ID is set to the Post ID of a Post that started a conversation. As Replies to a Post are posted, even Replies to Replies, the <span class="code-inline">conversation_id</span> is added to its JSON payload.<br>
<br>
You can only pass a single conversation ID per <span class="code-inline">conversation_id:</span> operator.<br>
<br>
Example: <span class="code-inline">conversation_id:1334987486343299072 (from:XDevelopers OR from:api)</span></td>
</tr><tr><td width="18%"><p><span class="code-inline">bio:</span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</td>
<td>Standalone</td>
<td>Essential</td>
<td><p><i>Available alias:&nbsp;</i><span class="code-inline">user_bio:</span></p>
<p>Matches a keyword or phrase within the Post publisher's bio. This is a tokenized match within the contents of the <span class="code-inline">description</span> field within the <a href="/content/developer-twitter/en/docs/twitter-api/data-dictionary/object-model/user">User object</a>.<br>
<br>
Example: <span class="code-inline">bio:developer OR bio:"data engineer" OR bio:academic</span></p>
</td>
</tr><tr><td width="18%"><span class="code-inline">bio_name:</span></td>
<td>Standalone</td>
<td>Essential</td>
<td>Matches a keyword within the Post publisher's user bio name. This is a tokenized match within the contents of a user’s “name” field within the <a href="/content/developer-twitter/en/docs/twitter-api/data-dictionary/object-model/user">User object</a>.<br>
<br>
Example: <span class="code-inline">bio_name:phd OR bio_name:md</span></td>
</tr><tr><td width="18%"><p><span class="code-inline">bio_location:</span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</td>
<td>Standalone</td>
<td>Essential</td>
<td><p><i>Available alias:&nbsp;</i><span class="code-inline">user_bio_location:</span></p>
<p>Matches Posts that are published by users whose location contains the specified keyword or phrase. This operator performs a tokenized match, similar to the normal keyword rules on the message body.<br>
<br>
This location is part of the <a href="/content/developer-twitter/en/docs/twitter-api/enterprise/powertrack-api/guides/operators">User object</a>, matches on the 'location' field, and is a non-normalized, user-generated, free-form string. It is also different from a Post's location (see <span class="code-inline">place:</span>).<br>
<br>
Example: <span class="code-inline">bio_location:"big apple" OR bio_location:nyc OR bio_location:manhattan</span></p>
</td>
</tr><tr><td width="18%"><span class="code-inline">place:</span></td>
<td>Standalone</td>
<td>Elevated</td>
<td>Matches Posts tagged with the specified location or X place ID. Multi-word place names (“New York City”, “Palo Alto”) should be enclosed in quotes.<br>
<br>
You can only pass a single place per <span class="code-inline">place:</span> operator.<br>
<br>
Note: See the <a href="/content/developer-twitter/en/docs/geo/places-near-location/api-reference/get-geo-search">GET geo/search</a> standard v1.1 endpoint for how to obtain X place IDs.<br>
<br>
Note: This operator will not match on Retweets, since Retweet's places are attached to the original Post. It will also not match on places attached to the original Post of a Quote Tweet.<br>
<br>
Example: <span class="code-inline">place:"new york city" OR place:seattle OR place:fd70c22040963ac7</span></td>
</tr><tr><td width="18%"><span class="code-inline">place_country:</span></td>
<td>Standalone</td>
<td>Elevated</td>
<td>Matches Posts where the country code associated with a tagged place/location matches the given ISO alpha-2 character code.<br>
<br>
You can find a list of valid ISO codes on <a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">Wikipedia</a>.<br>
<br>
You can only pass a single ISO code per <span class="code-inline">place_country: </span>operator.<br>
<br>
Note: This operator will not match on Retweets, since Retweet's places are attached to the original Post. It will also not match on places attached to the original Post of a Quote Tweet.<br>
<br>
Example: <span class="code-inline">place_country:US OR place_country:MX OR place_country:CA</span></td>
</tr><tr><td width="18%"><span class="code-inline">point_radius:</span></td>
<td>Standalone</td>
<td>Elevated</td>
<td><p>Matches against the <span class="code-inline">place.geo.coordinates</span> object of the Post when present, and in X, against a place geo polygon, where the Place polygon is fully contained within the defined region.<br>
<br>
<span class="code-inline">point_radius:[longitude latitude radius]<br>
</span></p>
<ul>
<li>Units of radius supported are miles (mi) and kilometers (km)<br>
</li>
<li>Radius must be less than 25mi<br>
</li>
<li>Longitude is in the range of ±180<br>
</li>
<li>Latitude is in the range of ±90<br>
</li>
<li>All coordinates are in decimal degrees<br>
</li>
<li>Rule arguments are contained within brackets, space delimited<br>
</li>
</ul>
<br>
You can only pass a single geo polygon per <span class="code-inline">point_radius:</span> operator.<br>
<br>
Note: This operator will not match on Retweets, since Retweet's places are attached to the original Post. It will also not match on places attached to the original Post of a Quote Tweet.<br>
<br>
Example: <span class="code-inline">point_radius:[2.355128 48.861118 16km] OR point_radius:[-41.287336 174.761070 20mi]</span></td>
</tr><tr><td width="18%"><p><span class="code-inline">bounding_box:</span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</td>
<td>Standalone</td>
<td>Elevated</td>
<td><p><i>Available alias:&nbsp;</i><span style="background-color: transparent;word-spacing: normal;"><span class="code-inline">geo_bounding_box:</span></span></p>
<p><span style="background-color: transparent;word-spacing: normal;">Matches against the place.geo.coordinates object of the Post when present, and in X, against a place geo polygon, where the place polygon is fully contained within the defined region.</span><br>
</p>
<p><br>
<span class="code-inline">bounding_box:[west_long south_lat east_long north_lat]<br>
</span><br>
</p>
<ul>
<li><span class="code-inline">west_long south_lat</span> represent the southwest corner of the bounding box where <span class="code-inline">west_long</span> is the longitude of that point, and <span class="code-inline">south_lat</span> is the latitude.<br>
</li>
<li><span class="code-inline">east_long north_lat</span> represent the northeast corner of the bounding box, where <span class="code-inline">east_long</span> is the longitude of that point, and <span class="code-inline">north_lat</span> is the latitude.<br>
</li>
<li>Width and height of the bounding box must be less than 25mi<br>
</li>
<li>Longitude is in the range of ±180<br>
</li>
<li>Latitude is in the range of ±90<br>
</li>
<li>All coordinates are in decimal degrees.<br>
</li>
<li>Rule arguments are contained within brackets, space delimited.<br>
</li>
</ul>
<br>
You can only pass a single geo polygons per <span class="code-inline">bounding_box:</span> operator.<br>
<br>
Note: This operator will not match on Retweets, since Retweet's places are attached to the original Post. It will also not match on places attached to the original Post of a Quote Tweet.<br>
<br>
Example: <span class="code-inline">bounding_box:[-105.301758 39.964069 -105.178505 40.09455]</span><p>&nbsp;</p>
</td>
</tr><tr><td width="18%"><span class="code-inline">is:retweet</span></td>
<td>Conjunction required</td>
<td>Essential</td>
<td>Matches on Retweets that match the rest of the specified rule. This operator looks only for true Retweets (for example, those generated using the Retweet button). Quote Tweets will not be matched by this operator.<br>
<br>
Example: <span class="code-inline">data @XDevelopers -is:retweet</span></td>
</tr><tr><td width="18%"><span class="code-inline">is:reply</span></td>
<td>Conjunction required</td>
<td>Essential</td>
<td>Deliver only explicit replies that match a rule. Can also be negated to exclude replies that match a rule from delivery.<br>
<br>
When used with the filtered stream, this operator matches on replies to an original Post, replies in quoted Posts and replies in Retweets.<br>
<br>
Example: <span class="code-inline">from:XDevelopers is:reply</span></td>
</tr><tr><td width="18%"><span class="code-inline">is:quote</span></td>
<td>Conjunction required</td>
<td>Essential</td>
<td>Returns all Quote Tweets, also known as Posts with comments.<br>
<br>
Example: <span class="code-inline">"sentiment analysis" is:quote</span></td>
</tr><tr><td width="18%"><span class="code-inline">is:verified</span></td>
<td>Conjunction required</td>
<td>Essential</td>
<td>Deliver only Posts whose authors are verified by X.<br>
<br>
Example: <span class="code-inline">#nowplaying is:verified</span></td>
</tr><tr><td width="18%"><span class="code-inline">-is:nullcast</span></td>
<td>Conjunction required</td>
<td>Elevated</td>
<td>Removes Posts created for promotion only on ads.twitter.com that have a <span class="code-inline">"source":"Twitter for Advertisers (legacy)"</span> or <span class="code-inline">"source":"Twitter for Advertisers".</span><br>
This operator must be negated.<br>
<br>
For more info on Nullcasted Posts, see our page on <a href="/content/developer-twitter/en/docs/twitter-api/v1/tweets/post-and-engage/guides/tweet-availability">Post availability</a>.<br>
<br>
Example: <span class="code-inline">"mobile games" -is:nullcast</span></td>
</tr><tr><td width="18%"><span class="code-inline">has:hashtags</span></td>
<td>Conjunction required</td>
<td>Essential</td>
<td>Matches Posts that contain at least one hashtag.<br>
<br>
Example: <span class="code-inline">from:XDevelopers -has:hashtags</span></td>
</tr><tr><td width="18%"><span class="code-inline">has:cashtags</span></td>
<td>Conjunction required</td>
<td>Essential</td>
<td>Matches Posts that contain a cashtag symbol (with a leading ‘$’ character. For example, <span class="code-inline">$tag</span>).<br>
<br>
Example: <span class="code-inline">#stonks has:cashtags</span></td>
</tr><tr><td width="18%"><span class="code-inline">has:links</span></td>
<td>Conjunction required</td>
<td>Essential</td>
<td>This operator matches Posts which contain links and media in the Post body.<br>
<br>
Example: <span class="code-inline">from:XDevelopers announcement has:links</span></td>
</tr><tr><td width="18%"><span class="code-inline">has:mentions</span></td>
<td>Conjunction required</td>
<td>Essential</td>
<td>Matches Posts that mention another X user.<br>
<br>
Example: <span class="code-inline">#nowplaying has:mentions</span></td>
</tr><tr><td width="18%"><p><span class="code-inline">has:media</span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</td>
<td>Conjunction required</td>
<td>Essential</td>
<td><p><i>Available alias:&nbsp;</i><span style="background-color: transparent;word-spacing: normal;"><span class="code-inline">has:media_link</span></span></p>
<p>Matches Posts that contain a media object, such as a photo, GIF, or video, as determined by X. This will not match on media created with Periscope, or Posts with links to other media hosting sites.<br>
<br>
Example: <span class="code-inline">(kittens OR puppies) has:media</span></p>
</td>
</tr><tr><td width="18%"><span class="code-inline">has:images</span></td>
<td>Conjunction required</td>
<td>Essential</td>
<td>Matches Posts that contain a recognized URL to an image.<br>
<br>
Example: <span class="code-inline">#meme has:images</span></td>
</tr><tr><td width="18%"><p><span class="code-inline">has:video_link</span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</td>
<td>Conjunction required</td>
<td>Essential</td>
<td><p><i>Available alias:&nbsp;</i><span style="background-color: transparent;word-spacing: normal;"><span class="code-inline">has:videos</span></span></p>
<p>Matches Posts that contain native X videos, uploaded directly to X. This will not match on videos created with Periscope, or Posts with links to other video hosting sites.<br>
<br>
Example: <span class="code-inline">#icebucketchallenge has:video_link</span></p>
</td>
</tr><tr><td width="18%"><span class="code-inline">has:geo</span></td>
<td>Conjunction required</td>
<td>Essential</td>
<td>Matches Posts that have Post-specific geolocation data provided by the X user. This can be either a location in the form of a X place, with the corresponding display name, geo polygon, and other fields, or in rare cases, a geo lat-long coordinate.<br>
<br>
Note: Operators matching on place (Post geo) will only include matches from original posts. Retweets do not contain any place data.<br>
<br>
Example: <span class="code-inline">recommend #paris has:geo -bakery</span></td>
</tr><tr><td width="18%"><span class="code-inline">sample:</span></td>
<td>Conjunction required</td>
<td>Essential</td>
<td>Returns a random percent sample of Posts that match a rule rather than the entire set of Posts. The percent value must be represented by an integer between 1 and 100 (for example, <span class="code-inline">sample:10</span> will return a random 10% sample).<br>
<br>
This operator first reduces the scope of the stream to the percentage you specified, then the rule/filter is applied to that sampled subset. In other words, if you are using, for example, <span class="code-inline">sample:10</span>, each Post will have a 10% chance of being in the sample.<br>
<br>
This operator applies to the entire rule and requires all OR'd terms to be grouped.<br>
<br>
Example: <span class="code-inline">#nowplaying @spotify sample:15</span></td>
</tr><tr><td width="18%"><span class="code-inline">lang:</span></td>
<td>Conjunction required</td>
<td>Essential</td>
<td>Matches Posts that have been classified by X as being of a particular language (if, and only if, the post has been classified). It is important to note that each Post is currently only classified as being of one language, so AND’ing together multiple languages will yield no results.<br>
<br>
You can only pass a single BCP 47 language identifier per <span class="code-inline">lang:</span> operator.<br>
<br>
Note: if no language classification can be made the provided result is ‘und’ (for undefined).<br>
<br>
Example: <span class="code-inline">recommend #paris lang:en</span><br>
<br>
The list below represents the currently supported languages and their corresponding BCP 47 language identifier:<br>
<br>
<table>
<tbody><tr><td>Amharic: <span class="code-inline">am</span></td>
<td>German: <span class="code-inline">de</span></td>
<td>Malayalam: <span class="code-inline">ml</span></td>
<td>Slovak: <span class="code-inline">sk</span></td>
</tr><tr><td>Arabic: <span class="code-inline">ar</span></td>
<td>Greek: <span class="code-inline">el</span></td>
<td>Maldivian: <span class="code-inline">dv</span></td>
<td>Slovenian: <span class="code-inline">sl</span></td>
</tr><tr><td>Armenian: <span class="code-inline">hy</span></td>
<td>Gujarati: <span class="code-inline">gu</span></td>
<td>Marathi: <span class="code-inline">mr</span></td>
<td>Sorani Kurdish: <span class="code-inline">ckb</span><br>
</td>
</tr><tr><td>Basque: <span class="code-inline">eu</span></td>
<td>Haitian Creole: <span class="code-inline">ht</span></td>
<td>Nepali: <span class="code-inline">ne</span></td>
<td>Spanish: <span class="code-inline">es</span></td>
</tr><tr><td>Bengali: <span class="code-inline">bn</span></td>
<td>Hebrew: <span class="code-inline">iw</span></td>
<td>Norwegian: <span class="code-inline">no</span></td>
<td>Swedish: <span class="code-inline">sv</span></td>
</tr><tr><td>Bosnian: <span class="code-inline">bs</span></td>
<td>Hindi: <span class="code-inline">hi</span></td>
<td>Oriya: <span class="code-inline">or</span></td>
<td>Tagalog: <span class="code-inline">tl</span></td>
</tr><tr><td>Bulgarian: <span class="code-inline">bg</span></td>
<td>Latinized Hindi: <span class="code-inline">hi-Latn</span></td>
<td>Panjabi: <span class="code-inline">pa</span></td>
<td>Tamil: <span class="code-inline">ta</span></td>
</tr><tr><td>Burmese: <span class="code-inline">my</span></td>
<td>Hungarian: <span class="code-inline">hu</span></td>
<td>Pashto: <span class="code-inline">ps</span></td>
<td>Telugu: <span class="code-inline">te</span></td>
</tr><tr><td>Croatian: <span class="code-inline">hr</span></td>
<td>Icelandic: <span class="code-inline">is</span></td>
<td>Persian: <span class="code-inline">fa</span></td>
<td>Thai: <span class="code-inline">th</span></td>
</tr><tr><td>Catalan: <span class="code-inline">ca</span></td>
<td>Indonesian: <span class="code-inline">in</span></td>
<td>Polish: <span class="code-inline">pl</span></td>
<td>Tibetan: <span class="code-inline">bo</span></td>
</tr><tr><td>Czech: <span class="code-inline">cs</span></td>
<td>Italian: <span class="code-inline">it</span></td>
<td>Portuguese: <span class="code-inline">pt</span></td>
<td>Traditional Chinese: <span class="code-inline">zh-TW</span></td>
</tr><tr><td>Danish: <span class="code-inline">da</span></td>
<td>Japanese: <span class="code-inline">ja</span></td>
<td>Romanian: <span class="code-inline">ro</span></td>
<td>Turkish: <span class="code-inline">tr</span></td>
</tr><tr><td>Dutch: <span class="code-inline">nl</span></td>
<td>Kannada: <span class="code-inline">kn</span></td>
<td>Russian: <span class="code-inline">ru</span></td>
<td>Ukrainian: <span class="code-inline">uk</span></td>
</tr><tr><td>English: <span class="code-inline">en</span></td>
<td>Khmer: <span class="code-inline">km</span></td>
<td>Serbian: <span class="code-inline">sr</span></td>
<td>Urdu: <span class="code-inline">ur</span></td>
</tr><tr><td>Estonian: <span class="code-inline">et</span></td>
<td>Korean: <span class="code-inline">ko</span></td>
<td>Simplified Chinese: <span class="code-inline">zh-CN</span></td>
<td>Uyghur: <span class="code-inline">ug</span></td>
</tr><tr><td>Finnish: <span class="code-inline">fi</span></td>
<td>Lao: <span class="code-inline">lo</span></td>
<td>Sindhi: <span class="code-inline">sd</span></td>
<td>Vietnamese: <span class="code-inline">vi</span></td>
</tr><tr><td>French: <span class="code-inline">fr</span></td>
<td>Latvian: <span class="code-inline">lv</span></td>
<td>Sinhala: <span class="code-inline">si</span></td>
<td>Welsh: <span class="code-inline">cy</span></td>
</tr><tr><td>Georgian: <span class="code-inline">ka</span></td>
<td>Lithuanian: <span class="code-inline">lt</span></td>
<td>&nbsp;</td>
</tr></tbody></table>
</td>
</tr><tr><td><span class="code-inline">followers_count:</span></td>
<td>&nbsp;</td>
<td>Essential</td>
<td><p>Matches Posts when the author has a followers count within the given range.</p>
<p>If a single number is specified, any number equal to or higher will match.</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">followers_count:500</span></p>
<p>&nbsp;</p>
<p>Additionally, a range can be specified to match any number in the given range.</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">followers_count:1000..10000</span></p>
</td>
</tr><tr><td><p><span class="code-inline">tweets_count:</span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</td>
<td>&nbsp;</td>
<td>Essential</td>
<td><p><span class="code-inline"><i>Available alias:&nbsp;</i><span style="word-spacing: normal;">statuses_count:</span></span></p>
<p>Matches Posts when the author has posted a number of Posts that falls within the given range.</p>
<p>If a single number is specified, any number equal to or higher will match.</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">tweets_count:1000</span></p>
<p>&nbsp;</p>
<p>Additionally, a range can be specified to match any number in the given range.</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">tweets_count:1000..10000</span></p>
</td>
</tr><tr><td><p><span class="code-inline">following_count:</span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</td>
<td>&nbsp;</td>
<td>Essential</td>
<td><p><span class="code-inline"><i>Available alias:&nbsp;</i><span style="background-color: transparent;word-spacing: normal;">friends_count:</span></span></p>
<p>Matches Posts when the author has a friends count (the number of users they follow) that falls within the given range.</p>
<p>If a single number is specified, any number equal to or higher will match.</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">following_count:500</span></p>
<p>&nbsp;</p>
<p>Additionally, a range can be specified to match any number in the given range.</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">following_count:1000..10000</span></p>
</td>
</tr><tr><td><p><span class="code-inline">listed_count:</span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</td>
<td>&nbsp;</td>
<td>Essential</td>
<td><p><span class="code-inline"><i>Available alias:&nbsp;</i><span style="word-spacing: normal;">user_in_lists_count:</span></span></p>
<p>Matches Posts when the author is included in the specified number of Lists.&nbsp;</p>
<p>If a single number is specified, any number equal to or higher will match.</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">listed_count:10</span></p>
<p>&nbsp;</p>
<p>Additionally, a range can be specified to match any number in the given range.</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">listed_count:10..100</span></p>
</td>
</tr><tr><td><p><span class="code-inline">url_title:</span></p>
<p>&nbsp;</p>
</td>
<td>&nbsp;</td>
<td>Essential</td>
<td><p><span class="code-inline"><i>Available alias:&nbsp;</i><span style="background-color: transparent;word-spacing: normal;">within_url_title:</span></span></p>
<p>Performs a keyword/phrase match on the expanded URL HTML title metadata.</p>
<p>&nbsp;</p>
<p><span style="background-color: transparent;word-spacing: normal;">Example: </span><span class="code-inline" style="word-spacing: normal;">url_title:snow</span><br>
</p>
</td>
</tr><tr><td><p><span class="code-inline">url_description:</span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</td>
<td>&nbsp;</td>
<td>Essential</td>
<td><p><span class="code-inline"><i>Available alias:&nbsp;</i><span style="word-spacing: normal;">within_url_description:</span></span></p>
<p>Performs a keyword/phrase match on the expanded page description metadata.</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">url_description:weather</span></p>
</td>
</tr><tr><td><span class="code-inline">url_contains:</span></td>
<td>&nbsp;</td>
<td>Essential</td>
<td><p>Matches Posts with URLs that literally contain the given phrase or keyword. To search for patterns with punctuation in them (i.e. google.com) enclose the search term in quotes.</p>
<p>NOTE: This will match against the expanded URL as well.</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">url_contains:photos</span></p>
</td>
</tr><tr><td><span class="code-inline">source:</span></td>
<td>&nbsp;</td>
<td>Essential</td>
<td><p>Matches any Post generated by the given source application. The value must be either the name of the application or the application’s URL.&nbsp;Cannot be used alone.</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">source:"X for iPhone"</span></p>
<p>&nbsp;</p>
<p>Note: As a X app developer, Posts created programmatically by your application will have the source of your application Name and Website URL set in your&nbsp;<a href="https://developer.twitter.com/en/docs/apps/app-management.html">app settings</a>.&nbsp;</p>
<p>&nbsp;</p>
</td>
</tr><tr><td><p><span class="code-inline">in_reply_to_tweet_id:</span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</td>
<td>&nbsp;</td>
<td>Essential</td>
<td><p><span class="code-inline"><i>Available alias:&nbsp;</i><span style="background-color: transparent;word-spacing: normal;">in_reply_to_status_id:</span></span></p>
<p>Deliver only explicit Replies to the specified Post.</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">in_reply_to_tweet_id:1539382664746020864</span></p>
</td>
</tr><tr><td><p><span class="code-inline">retweets_of_tweet_id:</span></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
</td>
<td>&nbsp;</td>
<td>Essential</td>
<td><p><span class="code-inline"><i>Available alias:&nbsp;</i><span style="word-spacing: normal;">retweets_of_status_id:</span></span></p>
<p>Deliver only explicit (or native) Retweets of the specified Post.&nbsp;Note that the status ID used should be the ID of an original Post and not a Retweet.&nbsp;</p>
<p>&nbsp;</p>
<p>Example: <span class="code-inline">retweets_of_tweet_id:1539382664746020864&nbsp;</span></p>
</td>
</tr></tbody></table>


</div>
</div>




          

<div id="twtr-article-embedded-survey" class="b32"></div>

        </div>
      </div>`;
};

export { promptToRule };
