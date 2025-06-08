
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
    const { headline, stockSymbol, source } = await req.json();

    console.log(`Analyzing sentiment for: ${headline}`);

    const prompt = `Analyze the sentiment of this financial news headline and provide a sentiment score between -1.0 (very negative) to 1.0 (very positive):

    Headline: "${headline}"
    Stock: ${stockSymbol}
    Source: ${source}

    Consider:
    - Impact on stock price
    - Market implications
    - Investor sentiment
    - Business fundamentals impact

    Respond with only a decimal number between -1.0 and 1.0 representing the sentiment score.`;

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
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 50,
        }
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    const sentimentText = geminiData.candidates[0].content.parts[0].text.trim();
    
    // Extract numeric sentiment score
    const sentimentScore = parseFloat(sentimentText.match(/-?\d+\.?\d*/)?.[0] || '0');
    const clampedScore = Math.max(-1, Math.min(1, sentimentScore));

    // Store in database
    const { error } = await supabase.from('news_sentiment').insert({
      stock_symbol: stockSymbol,
      news_headline: headline,
      news_source: source,
      sentiment_score: clampedScore,
      published_at: new Date().toISOString()
    });

    if (error) {
      console.error('Database error:', error);
    }

    return new Response(JSON.stringify({ 
      sentimentScore: clampedScore,
      headline,
      stockSymbol,
      source,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in news-sentiment-analyzer:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      sentimentScore: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
