
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CREATOMATE_API_KEY = "979ab23a51404134a1fe10dabd6f7c40027f060d267f15804478d007426815e7bec4962f3ffcb226dd5a12ed24032f2e";
const TEMPLATE_ID = "f9705121-1dd6-42ab-81f9-fcae510e4828";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, answer } = await req.json();

    if (!question || !answer) {
      return new Response(
        JSON.stringify({ error: 'Question and answer are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.creatomate.com/v1/renders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CREATOMATE_API_KEY}`
      },
      body: JSON.stringify({
        template_id: TEMPLATE_ID,
        modifications: {
          "Question.text": question,
          "Answer.text": answer,
          "Shape.fill_color": "rgba(255,107,107,1)",
          "Title.text": "Questions & Quizzes"
        }
      })
    });

    const data = await response.json();
    
    console.log('Creatomate API response:', data);
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in creatomate-post function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
