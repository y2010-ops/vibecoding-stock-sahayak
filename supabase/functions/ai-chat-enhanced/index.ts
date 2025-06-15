
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
    // Quick test with shorter timeout
    console.log('🔍 Testing Firecrawl API connection with shorter timeout...');
    
    const testResponse = await Promise.race([
      fetch('https://api.firecrawl.dev/v0/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firecrawlApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: 'https://httpbin.org/json',
          formats: ['markdown'],
          timeout: 5000 // Reduced timeout
        }),
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Test timeout')), 8000)
      )
    ]) as Response;

    console.log('Test API response status:', testResponse.status);
    webData.debug.testApiStatus = testResponse.status;

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.log('❌ Firecrawl API test failed:', errorText);
      webData.debug.testApiError = errorText;
      return { error: `API temporarily unavailable`, debug: webData.debug };
    }

    console.log('✅ Firecrawl API test successful');

    // Only attempt scraping if test passes and we have a stock symbol
    if (stockSymbol) {
      console.log(`📈 Attempting quick stock data fetch for: ${stockSymbol}`);
      
      // Try just one reliable source with very short timeout
      const stockUrl = `https://finance.yahoo.com/quote/${stockSymbol}.NS`;
      
      try {
        const stockResponse = await Promise.race([
          fetch('https://api.firecrawl.dev/v0/scrape', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${firecrawlApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: stockUrl,
              formats: ['markdown'],
              onlyMainContent: true,
              timeout: 8000, // Very short timeout
              waitFor: 1000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            }),
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Stock scrape timeout')), 10000)
          )
        ]) as Response;

        console.log(`Stock scrape response status: ${stockResponse.status}`);
        
        if (stockResponse.ok) {
          const data = await stockResponse.json();
          console.log(`Stock scrape success: ${data.success}`);
          
          if (data.success && data.data?.markdown) {
            const content = data.data.markdown;
            console.log(`Content length: ${content.length}`);
            
            if (content.length > 100) {
              webData.stockPrices = {
                source: stockUrl,
                data: content.substring(0, 3000), // Limit content size
                timestamp: new Date().toISOString(),
                symbol: stockSymbol
              };
              console.log('✅ Successfully scraped stock data');
            }
          }
        }
      } catch (stockError) {
        console.log(`⚠️ Stock scraping failed: ${stockError.message}`);
        webData.debug.stockScrapingError = stockError.message;
      }
    }

    console.log('=== SCRAPING SUMMARY ===');
    console.log('Stock prices scraped:', !!webData.stockPrices);

  } catch (error) {
    console.error('❌ Critical error in scrapeFinancialData:', error);
    webData.error = `Data service temporarily unavailable`;
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
    
    // Common Indian stocks
    /\b(RELIANCE|TCS|HDFCBANK|INFY|ITC|SBIN|BHARTIARTL|LT|WIPRO|MARUTI|ADANIENT|ASIANPAINT|BAJFINANCE|KOTAKBANK|HINDUNILVR|TATAMOTORS|ULTRACEMCO|NESTLEIND|DRREDDY|POWERGRID|NTPC|ONGC|COALINDIA|GRASIM|BPCL|JSWSTEEL|TATASTEEL|HINDALCO|SHREECEM|BRITANNIA|DIVISLAB|CIPLA|EICHERMOT|HEROMOTOCO|BAJAJ-AUTO|M&M|TECHM|SUNPHARMA|TITAN)\b/i,
    
    // Pattern: stock/price/quote mentions
    /(?:stock\s+(?:of\s+)?|share\s+(?:of\s+)?|price\s+(?:of\s+)?)([A-Z]{2,15})(?:\s+(?:stock|share|price|company))?/i,
    /([A-Z]{2,15})\s+(?:stock|share|price|quote|analysis)/i,
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

    // Attempt to scrape web data with improved timeout handling
    console.log('🌐 Starting web data scraping...');
    const webData = await scrapeFinancialData(message, stockSymbol);
    console.log('📊 Scraped web data summary:', {
      hasStockPrices: !!webData.stockPrices,
      hasNews: !!webData.news,
      hasFinancialData: !!webData.financialData,
      hasError: !!webData.error,
      debug: webData.debug
    });

    // Build enhanced system prompt with improved fallback
    let systemPrompt = `You are StockMind AI, a specialized Indian stock market assistant. You help investors with:

1. Stock analysis and recommendations for NSE/BSE stocks
2. Market insights and trends 
3. Investment strategies for Indian markets
4. Technical and fundamental analysis
5. Risk assessment and portfolio advice

Key Guidelines:
- Always mention currency in ₹ (INR)
- Use Indian market terminology (lakhs, crores)
- Reference Indian market timings (9:15 AM - 3:30 PM IST)
- Consider Indian investor behavior and preferences
- Mention relevant Indian indices (Nifty 50, Sensex, Bank Nifty)
- Include regulatory context (SEBI guidelines when relevant)
- Be conversational but professional
- Always add risk disclaimers for investment advice
- If you cannot access real-time data, provide general market knowledge and suggest reliable sources

Current context: ${context || 'General stock market conversation'}

REAL-TIME DATA STATUS:`;

    // Add scraped data to the prompt with better error handling
    let dataUsed = [];
    
    if (webData.stockPrices) {
      systemPrompt += `\n\n🔥 LIVE STOCK PRICE DATA AVAILABLE (${webData.stockPrices.timestamp}):\nSource: ${webData.stockPrices.source}\nSymbol: ${webData.stockPrices.symbol}\nData: ${webData.stockPrices.data}`;
      dataUsed.push('stockPrices');
    }

    if (webData.error) {
      systemPrompt += `\n\n⚠️ DATA SCRAPING STATUS: ${webData.error}. When this happens, provide helpful general information about the requested stock/topic and recommend checking official sources like NSE, BSE, or major financial websites for real-time data.`;
    }

    if (dataUsed.length === 0) {
      systemPrompt += '\n\n⚠️ NOTE: Real-time data scraping is currently experiencing technical difficulties. Please provide general market knowledge and analysis while recommending users check official financial websites (NSE, BSE, MoneyControl, Economic Times) for current data. Focus on providing valuable insights about the requested stock or market topic using your knowledge.';
    } else {
      systemPrompt += '\n\n✅ SUCCESS: Live data has been scraped and is available for analysis. Use this data prominently in your response.';
    }

    // Enhanced prompt for better responses when data is unavailable
    if (stockSymbol && !webData.stockPrices) {
      systemPrompt += `\n\nSpecific guidance for ${stockSymbol}: Since real-time data is unavailable, provide comprehensive analysis including:
- Company overview and business model
- Recent performance trends and market position
- Key financial metrics to watch
- Investment considerations and risk factors
- Suggest specific reliable sources for current price (NSE: nseindia.com, BSE: bseindia.com, MoneyControl, Yahoo Finance India)
- Market sentiment and analyst views if known`;
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
            text: `${systemPrompt}\n\nUser Query: ${message}\n\nPlease provide a comprehensive and helpful response. If real-time data is unavailable, focus on providing valuable analysis and insights while guiding users to reliable sources for current information.`
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
      response: 'I apologize for the technical difficulty. As your Indian stock market assistant, I can still help with general market analysis and investment guidance. Please try your question again, and I\'ll provide the best insights I can while recommending reliable sources for real-time data.',
      debug: { error: error.message }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
