
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
}

async function scrapeFinancialData(query: string, stockSymbol?: string): Promise<WebData> {
  if (!firecrawlApiKey) {
    console.log('Firecrawl API key not available');
    return {};
  }

  const webData: WebData = {};
  
  try {
    // Determine what type of data to scrape based on query
    const isStockPriceQuery = /price|quote|trading|current|live/i.test(query);
    const isNewsQuery = /news|latest|update|announcement/i.test(query);
    const isFinancialQuery = /financial|report|balance|income|revenue|profit/i.test(query);

    // Stock price scraping
    if (isStockPriceQuery && stockSymbol) {
      console.log(`Scraping stock price for ${stockSymbol}`);
      const stockUrls = [
        `https://www.nseindia.com/get-quotes/equity?symbol=${stockSymbol}`,
        `https://www.moneycontrol.com/india/stockpricequote/${stockSymbol.toLowerCase()}`,
        `https://finance.yahoo.com/quote/${stockSymbol}.NS`
      ];

      for (const url of stockUrls) {
        try {
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
              timeout: 10000
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data?.markdown) {
              webData.stockPrices = {
                source: url,
                data: data.data.markdown,
                timestamp: new Date().toISOString()
              };
              break; // Use first successful scrape
            }
          }
        } catch (error) {
          console.log(`Failed to scrape ${url}:`, error);
        }
      }
    }

    // News scraping
    if (isNewsQuery) {
      console.log('Scraping financial news');
      const newsUrls = [
        'https://www.moneycontrol.com/news/',
        'https://economictimes.indiatimes.com/markets',
        'https://www.livemint.com/market'
      ];

      for (const url of newsUrls) {
        try {
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
              timeout: 10000
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data?.markdown) {
              webData.news = {
                source: url,
                data: data.data.markdown,
                timestamp: new Date().toISOString()
              };
              break;
            }
          }
        } catch (error) {
          console.log(`Failed to scrape news from ${url}:`, error);
        }
      }
    }

    // Financial data scraping
    if (isFinancialQuery && stockSymbol) {
      console.log(`Scraping financial data for ${stockSymbol}`);
      const financialUrls = [
        `https://www.screener.in/company/${stockSymbol}/`,
        `https://www.moneycontrol.com/financials/${stockSymbol.toLowerCase()}`
      ];

      for (const url of financialUrls) {
        try {
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
              timeout: 10000
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data?.markdown) {
              webData.financialData = {
                source: url,
                data: data.data.markdown,
                timestamp: new Date().toISOString()
              };
              break;
            }
          }
        } catch (error) {
          console.log(`Failed to scrape financial data from ${url}:`, error);
        }
      }
    }

  } catch (error) {
    console.error('Error in scrapeFinancialData:', error);
  }

  return webData;
}

function extractStockSymbol(message: string): string | null {
  // Extract stock symbols from common patterns
  const patterns = [
    /\b([A-Z]{2,10})\s+(?:stock|share|price|quote)/i,
    /(?:stock|share|price|quote)\s+(?:of\s+)?([A-Z]{2,10})\b/i,
    /\b([A-Z]{2,10})\s+(?:analysis|recommendation)/i,
    /\b(RELIANCE|TCS|HDFCBANK|INFY|ITC|SBIN|BHARTIARTL|LT|WIPRO|MARUTI)\b/i
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    console.log('Enhanced AI Chat request:', message);

    // Extract stock symbol if present
    const stockSymbol = extractStockSymbol(message);
    console.log('Extracted stock symbol:', stockSymbol);

    // Scrape relevant web data
    const webData = await scrapeFinancialData(message, stockSymbol);
    console.log('Scraped web data:', Object.keys(webData));

    // Build enhanced system prompt with web data
    let systemPrompt = `You are StockMind AI, a specialized Indian stock market assistant with access to real-time market data. You help investors with:

1. Real-time stock analysis and recommendations for NSE/BSE stocks
2. Live market insights and trends
3. Current news analysis and market impact
4. Investment strategies for Indian markets
5. Technical and fundamental analysis with live data
6. Risk assessment and portfolio advice

Key Guidelines:
- Always mention currency in ₹ (INR)
- Use Indian market terminology (lakhs, crores)
- Reference Indian market timings (9:15 AM - 3:30 PM IST)
- Consider Indian investor behavior and preferences
- Mention relevant Indian indices (Nifty 50, Sensex, Bank Nifty)
- Include regulatory context (SEBI guidelines when relevant)
- Be conversational but professional
- Always add risk disclaimers for investment advice
- Use the provided real-time data to give accurate, current information

Current context: ${context || 'General stock market conversation with live data access'}

REAL-TIME DATA AVAILABLE:`;

    // Add scraped data to the prompt
    if (webData.stockPrices) {
      systemPrompt += `\n\nLIVE STOCK PRICE DATA (${webData.stockPrices.timestamp}):\n${webData.stockPrices.data}`;
    }

    if (webData.news) {
      systemPrompt += `\n\nLATEST MARKET NEWS (${webData.news.timestamp}):\n${webData.news.data}`;
    }

    if (webData.financialData) {
      systemPrompt += `\n\nFINANCIAL DATA (${webData.financialData.timestamp}):\n${webData.financialData.data}`;
    }

    if (Object.keys(webData).length === 0) {
      systemPrompt += '\n\nNote: No specific real-time data was scraped for this query, providing general market knowledge.';
    }

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
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

    return new Response(JSON.stringify({ 
      response,
      webDataUsed: Object.keys(webData),
      stockSymbol: stockSymbol,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat-enhanced:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'Sorry, I encountered an error while fetching live market data. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
