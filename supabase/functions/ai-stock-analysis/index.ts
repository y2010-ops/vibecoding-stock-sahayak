
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const geminiApiKey = 'AIzaSyCgLle23-yYqdR9wmbDOyGAEbd40kzJMSI';
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { stockSymbol, exchange, analysisType } = await req.json();

    console.log(`Analyzing ${stockSymbol} on ${exchange} for ${analysisType}`);

    // Create AI prompt based on analysis type
    let prompt = '';
    switch (analysisType) {
      case 'technical':
        prompt = `Provide a comprehensive technical analysis for ${stockSymbol} (${exchange}). Include:
        - Current price trends and momentum
        - Support and resistance levels
        - Key technical indicators (RSI, MACD, Moving Averages)
        - Chart patterns and trading signals
        - Volume analysis
        - Risk assessment and entry/exit points
        Format the response as a detailed technical analysis report for Indian investors.`;
        break;
      
      case 'fundamental':
        prompt = `Provide a fundamental analysis for ${stockSymbol} (${exchange}). Include:
        - Financial health and key ratios (P/E, P/B, ROE, Debt/Equity)
        - Revenue and profit growth trends
        - Sector comparison and competitive position
        - Management quality and corporate governance
        - Future growth prospects
        - Investment thesis and fair value estimation
        Format for Indian market investors with INR values.`;
        break;
      
      case 'sentiment':
        prompt = `Analyze market sentiment for ${stockSymbol} (${exchange}). Include:
        - Recent news sentiment analysis
        - Social media and investor sentiment
        - Analyst recommendations and price targets
        - Institutional investor activity (FII/DII)
        - Market perception and public opinion
        - Sentiment-based trading opportunities
        Provide insights relevant to Indian stock market dynamics.`;
        break;
      
      case 'ai_recommendation':
        prompt = `Provide a comprehensive AI investment recommendation for ${stockSymbol} (${exchange}) combining technical, fundamental, and sentiment analysis. Include:
        - Overall investment recommendation (Buy/Hold/Sell)
        - Risk rating and suitability for different investor types
        - Price targets and time horizons
        - Key catalysts and risk factors
        - Portfolio allocation suggestions
        - Action plan for different market scenarios
        Make it actionable for Indian retail investors.`;
        break;
      
      default:
        prompt = `Provide a general stock analysis for ${stockSymbol} (${exchange}) covering technical, fundamental, and sentiment aspects for Indian investors.`;
    }

    // Call Gemini AI API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
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
    const analysis = geminiData.candidates[0].content.parts[0].text;

    // Get user ID from auth
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        // Store analysis in database
        await supabase.from('stock_analyses').insert({
          user_id: user.id,
          stock_symbol: stockSymbol,
          exchange: exchange,
          analysis_type: analysisType,
          analysis_data: {
            analysis: analysis,
            timestamp: new Date().toISOString(),
            model: 'gemini-1.5-flash'
          }
        });
      }
    }

    return new Response(JSON.stringify({ 
      analysis,
      stockSymbol,
      exchange,
      analysisType,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-stock-analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate AI analysis'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
