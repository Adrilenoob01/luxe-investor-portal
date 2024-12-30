import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    
    if (!clientId) {
      throw new Error('PayPal Client ID not found in environment variables');
    }

    return new Response(
      JSON.stringify({ clientId }),
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error('Error fetching PayPal client ID:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: corsHeaders
      },
    )
  }
})