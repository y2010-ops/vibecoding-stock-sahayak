
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = 'AIzaSyCgLle23-yYqdR9wmbDOyGAEbd40kzJMSI';
const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebData {
  stockPrices?: any;
  news?: any;
  financialData?: any;
  error?: string;
  debug?: any;
}

async function scrapeFinancialData(query: string, stockSymbol?: string): Promise<WebData> {
  console.log('=== SCRAPING DEBUG START ===');
  console.log('Firecrawl API Key available:', !!firecrawlApiKey);
  console.log('Query:', query);
  console.log('Stock Symbol:', stockSymbol);

  if (!firecrawlApiKey) {
    console.log('❌ Firecrawl API key not available');
    return { error: 'Firecrawl API key not configured' };
  }

  const webData: WebData = { debug: {} };
  
  try {
    // Test Firecrawl API first
    console.log('🔍 Testing Firecrawl API connection...');
    
    const testResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://httpbin.org/json',
        formats: ['markdown'],
        timeout: 10000
      }),
    });

    console.log('Test API response status:', testResponse.status);
    webData.debug.testApiStatus = testResponse.status;

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.log('❌ Firecrawl API test failed:', errorText);
      webData.debug.testApiError = errorText;
      return { error: `Firecrawl API test failed: ${errorText}`, debug: webData.debug };
    }

    console.log('✅ Firecrawl API test successful');

    // Determine what type of data to scrape based on query
    const isStockPriceQuery = /price|quote|trading|current|live|stock|share/i.test(query);
    const isNewsQuery = /news|latest|update|announcement/i.test(query);
    const isFinancialQuery = /financial|report|balance|income|revenue|profit|analysis/i.test(query);

    console.log('Query analysis:', { isStockPriceQuery, isNewsQuery, isFinancialQuery });

    // Enhanced stock price scraping
    if (isStockPriceQuery && stockSymbol) {
      console.log(`📈 Attempting to scrape stock price for: ${stockSymbol}`);
      
      const stockUrls = [
        `https://finance.yahoo.com/quote/${stockSymbol}.NS`,
        `https://www.moneycontrol.com/india/stockpricequote/${stockSymbol.toLowerCase()}`,
        `https://www.screener.in/company/${stockSymbol}/`,
        `https://www.nseindia.com/get-quotes/equity?symbol=${stockSymbol}`,
        `https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/GetQuote.jsp?symbol=${stockSymbol}`
      ];

      for (let i = 0; i < stockUrls.length; i++) {
        const url = stockUrls[i];
        try {
          console.log(`🌐 Scraping attempt ${i + 1}: ${url}`);
          
          const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${firecrawlApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: url,
              formats: ['markdown', 'html'],
              onlyMainContent: false,
              timeout: 20000,
              waitFor: 3000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              }
            }),
          });

          console.log(`Response status for ${url}:`, response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Scrape response success: ${data.success}`);
            console.log(`Data available: ${!!data.data}`);
            
            if (data.success && data.data) {
              const content = data.data.markdown || data.data.html || '';
              console.log(`Content length: ${content.length}`);
              console.log(`Content preview: ${content.substring(0, 200)}...`);
              
              if (content.length > 100) {
                webData.stockPrices = {
                  source: url,
                  data: content.substring(0, 5000),
                  timestamp: new Date().toISOString(),
                  symbol: stockSymbol
                };
                console.log('✅ Successfully scraped stock data');
                break;
              }
            }
          } else {
            const errorText = await response.text();
            console.log(`❌ Failed to scrape ${url}: ${response.status} - ${errorText}`);
          }
        } catch (error) {
          console.log(`❌ Error scraping ${url}:`, error.message);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Enhanced news scraping
    if (isNewsQuery || (!stockSymbol && /LIC|LICI/i.test(query))) {
      console.log('📰 Attempting to scrape financial news');
      
      const newsUrls = [
        'https://www.moneycontrol.com/news/business/',
        'https://economictimes.indiatimes.com/markets',
        'https://www.business-standard.com/markets/news',
        'https://www.livemint.com/market'
      ];

      for (const url of newsUrls) {
        try {
          console.log(`📰 Scraping news from: ${url}`);
          
          const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${firecrawlApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: url,
              formats: ['markdown'],
              onlyMainContent: true,
              timeout: 20000,
              waitFor: 3000
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`News scrape response: ${data.success}`);
            
            if (data.success && data.data?.markdown) {
              const content = data.data.markdown;
              if (content.length > 200) {
                webData.news = {
                  source: url,
                  data: content.substring(0, 6000),
                  timestamp: new Date().toISOString()
                };
                console.log('✅ Successfully scraped news data');
                break;
              }
            }
          }
        } catch (error) {
          console.log(`❌ Error scraping news from ${url}:`, error.message);
        }
      }
    }

    console.log('=== SCRAPING SUMMARY ===');
    console.log('Stock prices scraped:', !!webData.stockPrices);
    console.log('News scraped:', !!webData.news);
    console.log('Financial data scraped:', !!webData.financialData);

  } catch (error) {
    console.error('❌ Critical error in scrapeFinancialData:', error);
    webData.error = `Scraping error: ${error.message}`;
    webData.debug.criticalError = error.message;
  }

  return webData;
}

function extractStockSymbol(message: string): string | null {
  console.log('🔍 Analyzing message for stock symbol:', message);
  
  // Enhanced stock symbol extraction patterns
  const patterns = [
    // Direct LIC mentions
    /\b(LIC|LICI)\b/i,
    /life\s+insurance\s+corp/i,
    
    // Common Indian stocks with better pattern matching
    /\b(RELIANCE|TCS|HDFCBANK|INFY|ITC|SBIN|BHARTIARTL|LT|WIPRO|MARUTI|ADANIENT|ASIANPAINT|BAJFINANCE|KOTAKBANK|HINDUNILVR|TATAMOTORS|ULTRACEMCO|NESTLEIND|DRREDDY|POWERGRID|NTPC|ONGC|COALINDIA|GRASIM|BPCL|JSWSTEEL|TATASTEEL|HINDALCO|SHREECEM|BRITANNIA|DIVISLAB|CIPLA|EICHERMOT|HEROMOTOCO|BAJAJ-AUTO|M&M|TECHM|SUNPHARMA|TITAN)\b/i,
    
    // Pattern: "stock of [COMPANY]" or "[COMPANY] stock"
    /(?:stock\s+(?:of\s+)?|share\s+(?:of\s+)?|price\s+(?:of\s+)?)([A-Z]{2,15})(?:\s+(?:stock|share|price|company))?/i,
    /([A-Z]{2,15})\s+(?:stock|share|price|quote|analysis)/i,
    
    // Pattern: specific stock queries
    /\b([A-Z]{3,10})\s+(?:current|latest|today|live)/i,
    
    // Company name patterns
    /(?:company|corp|corporation|ltd|limited)\s+([A-Z]{2,10})/i,
    /([A-Z]{2,10})\s+(?:company|corp|corporation|ltd|limited)/i
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      let symbol = match[1]?.toUpperCase();
      
      // Handle special cases
      if (symbol === 'LIC' || symbol === 'LIFECORP' || /life.*insurance/i.test(message)) {
        symbol = 'LICI'; // LIC India stock symbol
      }
      
      console.log(`✅ Extracted stock symbol: ${symbol} using pattern: ${pattern}`);
      return symbol;
    }
  }
  
  console.log('❌ No stock symbol found in message');
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    console.log('🚀 Enhanced AI Chat request:', message);

    // Extract stock symbol if present
    const stockSymbol = extractStockSymbol(message);
    console.log('📊 Extracted stock symbol:', stockSymbol);

    // Scrape relevant web data with enhanced debugging
    console.log('🌐 Starting web data scraping...');
    const webData = await scrapeFinancialData(message, stockSymbol);
    console.log('📊 Scraped web data summary:', {
      hasStockPrices: !!webData.stockPrices,
      hasNews: !!webData.news,
      hasFinancialData: !!webData.financialData,
      hasError: !!webData.error,
      debug: webData.debug
    });

    // Build enhanced system prompt with web data
    let systemPrompt = `You are StockMind AI, a specialized Indian stock market assistant with REAL-TIME access to live market data through web scraping. You help investors with:

1. Real-time stock analysis and recommendations for NSE/BSE stocks
2. Live market insights and trends using CURRENT data
3. Current news analysis and market impact
4. Investment strategies for Indian markets with LIVE data
5. Technical and fundamental analysis with REAL-TIME information
6. Risk assessment and portfolio advice

CRITICAL: You have LIVE ACCESS to real-time financial data through web scraping. Use this data prominently in your responses.

Key Guidelines:
- Always mention currency in ₹ (INR)
- Use Indian market terminology (lakhs, crores)
- Reference Indian market timings (9:15 AM - 3:30 PM IST)
- Consider Indian investor behavior and preferences
- Mention relevant Indian indices (Nifty 50, Sensex, Bank Nifty)
- Include regulatory context (SEBI guidelines when relevant)
- Be conversational but professional
- Always add risk disclaimers for investment advice
- ALWAYS use the provided real-time data to give accurate, current information
- If you have real-time data, lead with it and analyze it thoroughly
- Always mention the source and timestamp of any live data used

Current context: ${context || 'General stock market conversation with live data access'}

REAL-TIME DATA STATUS:`;

    // Add scraped data to the prompt with enhanced formatting
    let dataUsed = [];
    
    if (webData.stockPrices) {
      systemPrompt += `\n\n🔥 LIVE STOCK PRICE DATA AVAILABLE (${webData.stockPrices.timestamp}):\nSource: ${webData.stockPrices.source}\nSymbol: ${webData.stockPrices.symbol}\nData: ${webData.stockPrices.data}`;
      dataUsed.push('stockPrices');
    }

    if (webData.news) {
      systemPrompt += `\n\n📰 LATEST MARKET NEWS AVAILABLE (${webData.news.timestamp}):\nSource: ${webData.news.source}\nData: ${webData.news.data}`;
      dataUsed.push('news');
    }

    if (webData.financialData) {
      systemPrompt += `\n\n📊 FINANCIAL DATA AVAILABLE (${webData.financialData.timestamp}):\nSource: ${webData.financialData.source}\nData: ${webData.financialData.data}`;
      dataUsed.push('financialData');
    }

    if (webData.error) {
      systemPrompt += `\n\n⚠️ DATA SCRAPING STATUS: Some data sources encountered issues: ${webData.error}`;
    }

    if (dataUsed.length === 0) {
      systemPrompt += '\n\n⚠️ NOTE: No specific real-time data was successfully scraped for this query. I will provide general market knowledge and recommend checking official financial websites for the most current data. Please note that web scraping may be limited due to website restrictions.';
    } else {
      systemPrompt += '\n\n✅ SUCCESS: Live data has been scraped and is available for analysis. Use this data prominently in your response.';
    }

    console.log('🤖 Sending request to Gemini with data types:', dataUsed);
    console.log('📝 System prompt length:', systemPrompt.length);

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser Query: ${message}\n\nPlease provide a comprehensive response using any available live data. If live data is available, start your response by highlighting the current information found.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    const response = geminiData.candidates[0].content.parts[0].text;

    console.log('✅ Successfully generated AI response');

    return new Response(JSON.stringify({ 
      response,
      webDataUsed: dataUsed,
      stockSymbol: stockSymbol,
      timestamp: new Date().toISOString(),
      debug: webData.debug,
      scrapingError: webData.error
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Critical error in ai-chat-enhanced:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'Sorry, I encountered an error while fetching live market data. Please try again. The system is working to improve data access.',
      debug: { error: error.message }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
