
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = 'AIzaSyCgLle23-yYqdR9wmbDOyGAEbd40kzJMSI';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();

    console.log('AI Chat request:', message);

    const systemPrompt = `You are StockMind AI, a specialized Indian stock market assistant. You help investors with:

    1. Stock analysis and recommendations for NSE/BSE stocks
    2. Market insights and trends
    3. Investment strategies for Indian markets
    4. Technical and fundamental analysis explanations
    5. Sector analysis and comparisons
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

    Current context: ${context || 'General stock market conversation'}`;

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
          maxOutputTokens: 1024,
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
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat-assistant:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'Sorry, I encountered an error. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
